import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import qs from 'querystring';

import {
    getItemByPartNumberWithSerials,
    getItemBySerialNumber,
    insertPart,
    updatePart,
    updateSerial,
    markSerialNumbersAsSold,
    getPartsByManufacturer,
    getPartsByCategory
} from './database.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// Function to get OAuth token from eBay
async function getEbayAuthToken() {
    const authToken = Buffer.from(`${process.env.EBAY_APP_NAME}:${process.env.EBAY_CERT_NAME}`).toString('base64');
    const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${authToken}`,
        },
        body: qs.stringify({
            grant_type: 'client_credentials',
            scope: 'https://api.ebay.com/oauth/api_scope'
        })
    });

    if (!tokenResponse.ok) {
        throw new Error('Failed to get OAuth token');
    }

    const tokenData = await tokenResponse.json();
    return tokenData.access_token;
}

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------- PARTS ---------------------------------------------------------------------------//

app.get("/parts/:part_number", async (req, res) => {
    const { part_number } = req.params;
    try {
        const parts = await getItemByPartNumberWithSerials(part_number);
        res.json(parts);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.get("/serials/:serial_number", async (req, res) => {
    const { serial_number } = req.params;
    try {
        const serials = await getItemBySerialNumber(serial_number);
        console.log("Backend data:", serials);
        res.json(serials);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// EXTERNAL: insert a new part
app.post("/parts", async (req, res) => {
    const { partNumber, location, serialNumbers, item_description, category, manufacturer, item_condition } = req.body;
    const newPart = await insertPart(partNumber, location, serialNumbers, item_description, category, manufacturer, item_condition);
    res.json(newPart);
});

// EXTERNAL: update a part
app.put("/parts/:part_number", async (req, res) => {
    const { part_number } = req.params;
    const updates = req.body;

    console.log('Part Number:', part_number);
    console.log('Updates:', updates);

    try {
        const updatedPart = await updatePart(part_number, updates);
        res.json(updatedPart);
    } catch (error) {
        console.error('Failed to update part:', error);
        res.status(500).json({ error: error.message });
    }
});

// EXTERNAL: update a serial
app.put("/serials/:serial_number", async (req, res) => {
    const { serial_number } = req.params;
    const updates = req.body;

    console.log('Serial Number:', serial_number);
    console.log('Updates:', updates);

    try {
        const updatedSerial = await updateSerial(serial_number, updates);
        res.json(updatedSerial);
    } catch (error) {
        console.error('Failed to update serial:', error);
        res.status(500).json({ error: error.message });
    }
});

// EXTERNAL: mark serial numbers as sold
app.put("/serials", async (req, res) => {
    const { partNumber, serialNumbers } = req.body;
    if (!partNumber || !serialNumbers || !serialNumbers.length) {
        return res.status(400).json({ error: 'Part number and serial numbers are required' });
    }

    try {
        const result = await markSerialNumbersAsSold(partNumber, serialNumbers);
        res.json(result);
    } catch (error) {
        console.error('Error updating serial numbers:', error.message);
        res.status(500).json({ error: 'An error occurred while updating serial numbers: ' + error.message });
    }
});

// EXTERNAL: search by manufacturer
app.get("/parts/manufacturer/:manufacturer", async (req, res) => {
    const { manufacturer } = req.params;
    try {
        const parts = await getPartsByManufacturer(manufacturer);
        res.json(parts);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// EXTERNAL: search by category
app.get("/parts/category/:category", async (req, res) => {
    const { category } = req.params;
    try {
        const parts = await getPartsByCategory(category);
        res.json(parts);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// EBAY API: find eBay listing from part number
app.get('/item/:part_number', async (req, res) => {
    const { part_number } = req.params;

    try {
        const accessToken = await getEbayAuthToken();
        const headers = {
            'Authorization': `Bearer ${accessToken}`,
            'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
        };
        
        const response = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?q=${part_number}&limit=100`, {
            headers: headers
        });

        const data = await response.json();

        const seller4yourbusinessItemIds = data.itemSummaries
            .filter(item => item.seller.username === '4yourbusiness')
            .map(item => item.itemId);

        let result = { quantity: 0 };

        if (seller4yourbusinessItemIds.length !== 0) {
            const itemDetails = await fetch(`https://api.ebay.com/buy/browse/v1/item/${seller4yourbusinessItemIds}`, {
                headers: headers
            });
            const itemJson = await itemDetails.json();

            result = {
                quantity: itemJson.estimatedAvailabilities[0].estimatedAvailableQuantity
            };
        }
        
        res.json(result);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching data' });
    }
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
