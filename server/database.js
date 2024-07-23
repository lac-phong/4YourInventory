import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

// pool of connections
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
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


export async function insertPart(partNumber, locations, serialNumbers) {
    const sqlInsertPart = `
        INSERT INTO parts (ID, part_number, quantity, quantity_on_ebay, quantity_sold, locations)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    const sqlInsertSerial = `
        INSERT INTO serials (part_number, serial_number)
        VALUES (?, ?);
    `;
    const sqlSelectPart = 'SELECT ID FROM parts WHERE part_number = ?';
    let connection;
    try {
        connection = await pool.getConnection(); // Use the connection pool

        // Check if the part_number already exists
        const [existingPart] = await connection.query(sqlSelectPart, [partNumber]);
        
        let partId;
        if (existingPart.length > 0) {
            // If the part already exists, use the existing ID
            partId = existingPart[0].ID;
        } else {
            // Get the new ID
            const [rows] = await connection.query('SELECT MAX(ID) as maxId FROM parts');
            const newId = rows[0].maxId + 1;
            partId = newId;
            
            const quantity = 0;
            const quantitySold = 0;
            const quantityOnEbay = 0;
            
            // Insert the new part
            const [result] = await connection.query(sqlInsertPart, [newId, partNumber, quantity, quantityOnEbay, quantitySold, locations]);
            if (!result.affectedRows) {
                console.error('Insert failed, no rows affected');
                throw new Error('Insert failed, no rows affected');
            }
        }

        // Insert serial numbers
        for (const serialNumber of serialNumbers) {
            await connection.query(sqlInsertSerial, [partNumber, serialNumber]);
        }

        return { inserted: true };
    } catch (error) {
        console.error('Failed to insert part:', error);
        throw new Error('Failed to insert part: ' + error.message);
    } finally {
        if (connection) connection.release(); // Release the connection back to the pool
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


// Function to sell serial numbers
export async function markSerialNumbersAsSold(partNumber, serialNumbers) {
    if (!serialNumbers.length) {
        throw new Error('No serial numbers provided for update');
    }

    // Create a string of placeholders for the `IN` clause
    const placeholders = serialNumbers.map(() => '?').join(', ');

    // Start a transaction
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Step 1: Mark the serial numbers as sold
        const sqlUpdateSerials = `
          UPDATE movedbtwo.serials
          SET sold = 1
          WHERE part_number = ? AND serial_number IN (${placeholders});
        `;
        const [updateResult] = await connection.query(sqlUpdateSerials, [partNumber, ...serialNumbers]);

        if (updateResult.affectedRows === 0) {
            throw new Error('Update failed, serial numbers not found or already marked as sold');
        }

        // Step 2: Update the parts table
        // Calculate the number of serial numbers sold
        const quantitySold = serialNumbers.length;
        const sqlUpdateParts = `
          UPDATE movedbtwo.parts
          SET quantity = quantity - ?,
              quantity_sold = quantity_sold + ?
          WHERE part_number = ?;
        `;
        const [updatePartsResult] = await connection.query(sqlUpdateParts, [quantitySold, quantitySold, partNumber]);

        if (updatePartsResult.affectedRows === 0) {
            throw new Error('Update failed, part number not found');
        }

        // Commit the transaction
        await connection.commit();
        return { updated: true };
    } catch (error) {
        // Rollback the transaction in case of an error
        await connection.rollback();
        throw new Error('Database operation failed: ' + error.message);
    } finally {
        connection.release(); // Release the connection back to the pool
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
