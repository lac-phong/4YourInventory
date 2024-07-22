import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

import {
    getItemByPartNumber,
    insertPart,
    updatePart,
    deletePart
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
    const { id, partNumber, quantity, quantityOnEbay, quantitySold, locations } = req.body;
    const newPart = await insertPart(id, partNumber, quantity, quantityOnEbay, quantitySold, locations);
    res.json(newPart);
});


// EXTERNAL: update a part
app.put("/parts/:id", async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const updatedPart = await updatePart(id, updates);
    res.json(updatedPart);
});

// EXTERNAL: delete a part
app.delete("/parts/:partNumber", async (req, res) => {
    const { partNumber } = req.params;
    const deletedPart = await deletePart(partNumber);
    res.json(deletedPart);
});

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
