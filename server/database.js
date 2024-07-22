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

export async function getItemByPartNumber(part_number) {
    const sql = `
        SELECT * FROM movedbtwo.parts
        WHERE part_number = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [part_number]);
        if (rows.length){
            return rows[0];
        } else {
            throw new Error('Item not found');
        }
    } catch (error) {
        throw new Error('Failed to retrieve item by part number: ' + error.message);
    }
}

export async function insertPart(id, partNumber, quantity, quantityOnEbay, quantitySold, locations) {
    const sql = `
        INSERT INTO movedbtwo.parts (ID, PART_NUMBER, QUANTITY, QUANTITY_ON_EBAY, QUANTITY_SOLD, LOCATIONS)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    try {
        const partExists = await checkPartExists(partNumber);
        if (partExists) {
            throw new Error('Part already exists');
        }
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
    const { part_number, quantity, quantity_on_ebay, quantity_sold, locations } = updates;

    const sql = `
        UPDATE movedbtwo.parts
        SET part_number = ?, quantity = ?, quantity_on_ebay = ?, quantity_sold = ?, locations = ?
        WHERE ID = ?;
    `;

    try {
        const [result] = await pool.query(sql, [part_number, quantity, quantity_on_ebay, quantity_sold, locations, id]);
        if (result.affectedRows) {
            return { id, part_number, quantity, quantity_on_ebay, quantity_sold, locations };
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
