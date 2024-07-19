import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

// pool of connections
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------- PART NUMBERS -------------------------------------------------------------------------//

export async function getPartNumber() {
    const sql = `
        SELECT ITEM.part_number FROM movedbtwo.parts ITEM;
    `;
    try {
        const [rows] = await pool.query(sql);
        return rows;
    } catch (error) {
        throw new Error('Failed to retrieve businesses: ' + error.message);
    }
}

export async function insertPart(id, partNumber, quantity, quantityOnEbay, quantitySold, locations) {
    const sql = `
        INSERT INTO movedbtwo.parts (ID, PART_NUMBER, QUANTITY, QUANTITY_ON_EBAY, QUANTITY_SOLD, LOCATIONS)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    try {
        const [result] = await pool.query(sql, [id, partNumber, quantity, quantityOnEbay, quantitySold, locations]);
        if (result.affectedRows) {
            return { inserted: true };
        } else {
            throw new Error('Insert failed, no rows affected');
        }
    } catch (error) {
        throw new Error('Failed to insert part: ' + error.message);
    }
}

export async function updatePart(id, updates) {
    // Ensure that there is at least one field to update
    const validFields = ['part_number', 'quantity', 'quantity_on_ebay', 'quantity_sold', 'locations'];
    const fieldsToUpdate = Object.keys(updates).filter(field => validFields.includes(field));

    if (fieldsToUpdate.length === 0) {
        throw new Error('No valid fields to update');
    }

    // Build the SQL query dynamically
    const setClause = fieldsToUpdate.map(field => `${field.toUpperCase()} = ?`).join(', ');
    const sql = `UPDATE movedbtwo.parts SET ${setClause} WHERE ID = ?`;

    // Prepare the values array
    const values = fieldsToUpdate.map(field => updates[field]);
    values.push(id);

    try {
        const [result] = await pool.query(sql, values);
        if (result.affectedRows) {
            return { id, ...updates };
        } else {
            throw new Error('Part not found or no update needed');
        }
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

export async function deletePart(partNumber) {
    const sql = `
        DELETE FROM movedbtwo.parts
        WHERE PART_NUMBER = ?;
    `;

    try {
        // Check if the part exists
        const partExists = await checkPartExists(partNumber);
        if (!partExists) {
            throw new Error('Part not found');
        }

        const [result] = await pool.query(sql, [partNumber]);
        if (result.affectedRows) {
            return { deleted: true };
        } else {
            throw new Error('Delete failed, part not found');
        }
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}


// INTERNAL FUNCTION
async function checkPartExists(partNumber) {
    const sql = `
        SELECT 1 FROM movedbtwo.parts 
        WHERE PART_NUMBER = ?
    `;
    try {
        const [rows] = await pool.query(sql, [partNumber]);
        return rows.length > 0;
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}
