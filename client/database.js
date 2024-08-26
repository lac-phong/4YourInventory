const mysql = require('mysql2');
const config = require('./config');

// pool of connections
const pool = mysql.createPool({
    host: config.MYSQL_HOST,
    user: config.MYSQL_USER,
    password: config.MYSQL_PASSWORD,
    database: config.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise()

// ------------------------------------------------------------------------------------------------------------------------------------------------//

// ------------------------------------------------------------- PART NUMBERS -------------------------------------------------------------------------//

async function getAllParts() {
    const sql = `SELECT * FROM movedbtwo.parts;`;
    try {
        const [rows] = await pool.query(sql);
        return rows; // Directly return rows; no need to map here
    } catch (error) {
        throw new Error('Failed to retrieve parts: ' + error.message);
    }
}


async function getItemByPartNumberWithSerials(part_number) {
    const sql = `
        SELECT p.*, s.id AS serial_id, s.serial_number, s.sold, s.locations, s.item_condition
        FROM movedbtwo.parts p
        LEFT JOIN movedbtwo.serials s ON p.part_number = s.part_number
        WHERE p.part_number = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [part_number]);
        if (rows.length) {
            const part = {
                part_number: rows[0].part_number,
                quantity: rows[0].quantity,
                quantity_on_ebay: rows[0].quantity_on_ebay,
                quantity_sold: rows[0].quantity_sold,
                item_description: rows[0].item_description,
                category: rows[0].category,
                manufacturer: rows[0].manufacturer,
                serials: rows.map(row => ({
                    serial_id: row.serial_id,
                    serial_number: row.serial_number,
                    sold: row.sold ? row.sold.readUInt8(0) : 0, // Convert buffer to integer
                    locations: row.locations,
                    item_condition: row.item_condition
                }))
            };
            return part;
        } else {
            throw new Error('Item not found');
        }
    } catch (error) {
        throw new Error('Failed to retrieve item by part number: ' + error.message);
    }
}

async function getItemBySerialNumber(serial_number) {
    const sql = `
        SELECT serial_number, part_number, CAST(sold AS UNSIGNED) AS sold, locations, item_condition FROM movedbtwo.serials
        WHERE serial_number = ?;
    `;
    try {
        const [rows] = await pool.query(sql, [serial_number]);
        if (rows.length) {
            console.log("Backend fetch result with cast:", rows[0]); // Log the result with cast
            return rows[0];
        } else {
            throw new Error('Item not found');
        }
    } catch (error) {
        throw new Error('Failed to retrieve item by serial number: ' + error.message);
    }
}

async function insertPart(partNumber, locations, serialNumbers, item_description, category, manufacturer, item_condition) {
    const sqlInsertPart = `
        INSERT INTO parts (part_number, quantity, quantity_on_ebay, quantity_sold, item_description, category, manufacturer)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;
    const sqlInsertSerial = `
        INSERT INTO serials (part_number, serial_number, locations, item_condition)
        VALUES (?, ?, ?, ?);
    `;
    const sqlSelectPart = 'SELECT part_number FROM parts WHERE part_number = ?';
    let connection;
    try {
        connection = await pool.getConnection(); // Use the connection pool

        // Check if the part_number already exists
        const [existingPart] = await connection.query(sqlSelectPart, [partNumber]);
            
        const quantity = 0;
        const quantitySold = 0;
        const quantityOnEbay = 0;
        
        // Insert the new part
        const [result] = await connection.query(sqlInsertPart, [partNumber, quantity, quantityOnEbay, quantitySold, item_description, category, manufacturer]);
        if (!result.affectedRows) {
            console.error('Insert failed, no rows affected');
            throw new Error('Insert failed, no rows affected');
        }

        // Insert serial numbers
        for (const serialNumber of serialNumbers) {
            await connection.query(sqlInsertSerial, [partNumber, serialNumber, locations, item_condition]);
        }

        return { inserted: true };
    } catch (error) {
        console.error('Failed to insert part:', error);
        throw new Error('Failed to insert part: ' + error.message);
    } finally {
        if (connection) connection.release(); // Release the connection back to the pool
    }
}

async function updatePart(part_number, updates) {
    const { quantity, quantity_on_ebay, quantity_sold, item_description, category, manufacturer } = updates;

    const sql = `
        UPDATE movedbtwo.parts
        SET quantity = ?, quantity_on_ebay = ?, quantity_sold = ?, item_description = ?, category = ?, manufacturer = ?
        WHERE part_number = ?;
    `;

    try {
        console.log('Parameters:', [quantity, quantity_on_ebay, quantity_sold, item_description, category, manufacturer, part_number]);

        const [result] = await pool.query(sql, [quantity, quantity_on_ebay, quantity_sold, item_description, category, manufacturer, part_number]);
        if (result.affectedRows) {
            // After the update, fetch the updated part including its serials
            return await getItemByPartNumberWithSerials(part_number);
        } else {
            throw new Error('Part not found or no update needed');
        }
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

async function updateSerial(serial_number, updates) {
    const { part_number, sold, locations, item_condition } = updates;

    const sql = `
        UPDATE movedbtwo.serials
        SET part_number = ?, sold = ?, locations = ?, item_condition = ?
        WHERE serial_number = ?;
    `;

    try {
        console.log('Parameters:', [part_number, sold, locations, item_condition, serial_number]);

        const [result] = await pool.query(sql, [part_number, sold, locations, item_condition, serial_number]);
        if (result.affectedRows) {
            return { serial_number, part_number, sold, locations, item_condition };
        } else {
            throw new Error('Serial not found or no update needed');
        }
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

// Function to sell serial numbers
async function markSerialNumbersAsSold(partNumber, serialNumbers) {
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

// MANUFACTURER SEARCH
async function getPartsByManufacturer(manufacturer) {
    const sql = `
        SELECT part_number, quantity, quantity_on_ebay, quantity_sold, item_description, category, manufacturer
        FROM movedbtwo.parts
        WHERE TRIM(LOWER(manufacturer)) = TRIM(LOWER(?));
    `;
    try {
        const [rows] = await pool.query(sql, [manufacturer]);
        return rows;
    } catch (error) {
        throw new Error('Failed to retrieve parts by manufacturer: ' + error.message);
    }
}

// CATEGORY SEARCH
async function getPartsByCategory(category) {
    const sql = `
        SELECT part_number, quantity, quantity_on_ebay, quantity_sold, item_description, category, manufacturer
        FROM movedbtwo.parts
        WHERE TRIM(LOWER(category)) = TRIM(LOWER(?));
    `;
    try {
        const [rows] = await pool.query(sql, [category]);
        return rows;
    } catch (error) {
        throw new Error('Failed to retrieve parts by category: ' + error.message);
    }
}

// Function to get all unique categories
async function getAllCategories() {
    const sql = `SELECT category FROM movedbtwo.unique_categories ORDER BY category;`;
    try {
        const [rows] = await pool.query(sql);
        return rows.map(row => row.category);
    } catch (error) {
        throw new Error('Failed to retrieve categories: ' + error.message);
    }
}

// Function to add a new category to the database
async function insertCategory(category) {
    const sqlInsertCat = `
        INSERT INTO unique_categories (category)
        VALUES (?);
    `;
    const sqlSelectCat = 'SELECT category FROM unique_categories WHERE category = ?';
    let connection;
    try {
        connection = await pool.getConnection(); // Use the connection pool

        // Check if the category already exists
        const [existingCat] = await connection.query(sqlSelectCat, [category]);

        if (existingCat.length > 0) {
            return { inserted: false }; // Category already exists
        }

        // Insert the new category
        const [result] = await connection.query(sqlInsertCat, [category]);

        if (!result.affectedRows) {
            console.error('Category Insert failed, no rows affected');
            throw new Error('Category Insert failed, no rows affected');
        }

        return { inserted: true };
    } catch (error) {
        console.error('Failed to insert category:', error);
        throw new Error('Failed to insert category: ' + error.message);
    } finally {
        if (connection) connection.release(); 
    }
}

// Function to delete a category from the database
async function deleteCategory(category) {
    const sqlDeleteCat = 'DELETE FROM unique_categories WHERE category = ?';
    let connection;

    try {
        connection = await pool.getConnection(); // Use the connection pool

        // Delete the category
        const [result] = await connection.query(sqlDeleteCat, [category]);
        if (result.affectedRows === 0) {
            console.error('Category Delete failed, no rows affected');
            return { deleted: false };
        }

        return { deleted: true };
    } catch (error) {
        console.error('Failed to delete category:', error);
        throw new Error('Failed to delete category: ' + error.message);
    } finally {
        if (connection) connection.release(); 
    }
}


// ---------------- MANUFACTURERS ------------------- //

// Function to get all unique manufacturers
async function getAllManufacturers() {
    const sql = `SELECT manufacturer FROM movedbtwo.unique_manufacturers ORDER BY manufacturer;`;
    try {
        const [rows] = await pool.query(sql);
        return rows.map(row => row.manufacturer);
    } catch (error) {
        throw new Error('Failed to retrieve manufacturers: ' + error.message);
    }
}

// Function to add a new manufacturer to the database
async function insertManufacturer(manufacturer) {
    const sqlInsertManu = `
        INSERT INTO unique_manufacturers (manufacturer)
        VALUES (?);
    `;
    const sqlSelectManu = 'SELECT manufacturer FROM unique_manufacturers WHERE manufacturer = ?';
    let connection;
    try {
        connection = await pool.getConnection(); // Use the connection pool

        // Check if already exists
        const [existingManu] = await connection.query(sqlSelectManu, [manufacturer]);

        if (existingManu.length > 0) {
            return { inserted: false }; //  already exists
        }

        // Insert the new 
        const [result] = await connection.query(sqlInsertManu, [manufacturer]);

        if (!result.affectedRows) {
            console.error('Manufacturer Insert failed, no rows affected');
            throw new Error('Manufacturer Insert failed, no rows affected');
        }

        return { inserted: true };
    } catch (error) {
        console.error('Failed to insert manufacturer:', error);
        throw new Error('Failed to insert manufacturer: ' + error.message);
    } finally {
        if (connection) connection.release(); 
    }
}

// Function to delete a manufacturer from the database
async function deleteManufacturer(manufacturer) {
    const sqlDeleteManu = 'DELETE FROM unique_manufacturers WHERE manufacturer = ?';
    let connection;

    try {
        connection = await pool.getConnection(); // Use the connection pool

        // Delete 
        const [result] = await connection.query(sqlDeleteManu, [manufacturer]);
        if (result.affectedRows === 0) {
            console.error('Manufacturer Delete failed, no rows affected');
            return { deleted: false };
        }

        return { deleted: true };
    } catch (error) {
        console.error('Failed to delete manufacturer:', error);
        throw new Error('Failed to delete manufacturer: ' + error.message);
    } finally {
        if (connection) connection.release(); 
    }
}


// INTERNAL FUNCTION
async function checkPartExists(partNumber) {
    const sql = `
        SELECT 1 FROM movedbtwo.parts 
        WHERE part_number = ?
    `;
    try {
        const [rows] = await pool.query(sql, [partNumber]);
        return rows.length > 0;
    } catch (error) {
        throw new Error('Database operation failed: ' + error.message);
    }
}

module.exports = {
    getAllParts,
    getItemByPartNumberWithSerials,
    getItemBySerialNumber,
    insertPart,
    updatePart,
    updateSerial,
    markSerialNumbersAsSold,
    getPartsByManufacturer,
    getPartsByCategory,
    getAllCategories,
    insertCategory,
    deleteCategory,
    getAllManufacturers,
    insertManufacturer,
    deleteManufacturer,
    checkPartExists
};