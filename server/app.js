import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

import {
    getAccountPage,
    getPartNumber,
    insertPart,
    updatePart,
    deletePart,
    checkPartExists
} from './database.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------- PARTS ---------------------------------------------------------------------------//

// EXTERNAL: get part numbers
app.get("/parts", async (req, res) => {
    try {
        const parts = await getPartNumber();
        res.json(parts);
    } catch (error) {
        console.error('Error retrieving part numbers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// EXTERNAL: insert a new part
app.post("/parts", async (req, res) => {
    const { id, partNumber, quantity, quantityOnEbay, quantitySold, locations } = req.body;
    try {
        const partExists = await checkPartExists(partNumber);
        if (partExists) {
            return res.status(422).json('Part number already exists');
        }
        const newPart = await insertPart(id, partNumber, quantity, quantityOnEbay, quantitySold, locations);
        res.json(newPart);
    } catch (error) {
        console.error('Error inserting part:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// EXTERNAL: update a part
app.put("/parts/:id", async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const updatedPart = await updatePart(id, updates);
        res.json(updatedPart);
    } catch (error) {
        console.error('Error updating part:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// EXTERNAL: delete a part
app.delete("/parts/:partNumber", async (req, res) => {
    const { partNumber } = req.params;
    try {
        const deletedPart = await deletePart(partNumber);
        res.json(deletedPart);
    } catch (error) {
        console.error('Error deleting part:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
