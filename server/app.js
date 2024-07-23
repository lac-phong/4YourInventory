import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

import {
    getItemByPartNumber,
    insertPart,
    updatePart,
    deleteSerialNumbers
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
    const {part_number} = req.params;
    const parts = await getItemByPartNumber(part_number);
    res.json(parts);
});

// EXTERNAL: insert a new part
app.post("/parts", async (req, res) => {
    const { partNumber, locations, serialNumbers } = req.body;
    const newPart = await insertPart(partNumber, locations, serialNumbers);
    res.json(newPart);
});


// EXTERNAL: update a part
app.put("/parts/:id", async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const updatedPart = await updatePart(id, updates);
    res.json(updatedPart);
});

// External: delete serial numbers
app.delete('/api/serialNumbers', async (req, res) => {
    const { partNumber, serialNumbers } = req.body;
    const deletedSerials = await deleteSerialNumbers(partNumber, serialNumbers);
    res.json(deletedSerials);
  });


// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
