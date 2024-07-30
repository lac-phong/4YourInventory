import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

import {
    getItemByPartNumber,
    getItemBySerialNumber,
    insertPart,
    updatePart,
    updateSerial,
    markSerialNumbersAsSold
} from './database.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------- PARTS ---------------------------------------------------------------------------//

app.get("/parts/:part_number", async (req, res) => {
    const { part_number } = req.params;
    try {
        const parts = await getItemByPartNumber(part_number);
        res.json(parts);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.get("/serials/:serial_number", async (req, res) => {
    const { serial_number } = req.params;
    try {
        const serials = await getItemBySerialNumber(serial_number);
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
    const { part_number } = req.params; // Correct extraction of part_number from req.params
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
    const { serial_number } = req.params; // Correct extraction of serial_number from req.params
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
    const result = await markSerialNumbersAsSold(partNumber, serialNumbers);
    res.json(result);
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
