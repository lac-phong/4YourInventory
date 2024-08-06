import express from 'express';
import bodyParser from 'body-parser';
import { updateDatabaseWithEbayData } from './ebayService.js';
import { getItemByPartNumberWithSerials, getItemBySerialNumber, insertPart, updatePart, updateSerial, deletePart, deleteSerial } from './database.js';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

// Endpoint to get item by part number with serials
app.get('/api/items/part/:part_number', async (req, res) => {
    try {
        const part = await getItemByPartNumberWithSerials(req.params.part_number);
        res.json(part);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Endpoint to get item by serial number
app.get('/api/items/serial/:serial_number', async (req, res) => {
    try {
        const serial = await getItemBySerialNumber(req.params.serial_number);
        res.json(serial);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Endpoint to insert a new part and its serials
app.post('/api/items', async (req, res) => {
    try {
        const { partNumber, locations, serialNumbers, item_description, category, manufacturer, item_condition } = req.body;
        const result = await insertPart({ partNumber, locations, serialNumbers, item_description, category, manufacturer, item_condition });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to update part details
app.put('/api/items/part/:part_number', async (req, res) => {
    try {
        const updates = req.body;
        const result = await updatePart(req.params.part_number, updates);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to update serial details
app.put('/api/items/serial/:serial_number', async (req, res) => {
    try {
        const updates = req.body;
        const result = await updateSerial(req.params.serial_number, updates);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to delete part by part number
app.delete('/api/items/part/:part_number', async (req, res) => {
    try {
        const result = await deletePart(req.params.part_number);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to delete serial by serial number
app.delete('/api/items/serial/:serial_number', async (req, res) => {
    try {
        const result = await deleteSerial(req.params.serial_number);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to update the database with eBay data
app.post('/api/ebay/update', async (req, res) => {
    try {
        await updateDatabaseWithEbayData();
        res.json({ message: 'Database updated with eBay data.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
