import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

import {
    getItemByPartNumber,
    insertPart,
    updatePart,
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

// EXTERNAL: get part numbers
app.get("/parts/:part_number", async (req, res) => {
    const { part_number } = req.params;
    const parts = await getItemByPartNumber(part_number);
    res.json(parts);
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
