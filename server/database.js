import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Utility function to execute queries
export async function executeQuery(sql, params) {
    const [rows] = await pool.query(sql, params);
    return rows;
}

// Get item by part number with serials
export async function getItemByPartNumberWithSerials(part_number) {
    const sql = `
        SELECT p.*, s.id AS serial_id, s.serial_number, s.sold, s.locations, s.item_condition
        FROM parts p
        LEFT JOIN serials s ON p.part_number = s.part_number
        WHERE p.part_number = ?;
    `;
    const rows = await executeQuery(sql, [part_number]);
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
                sold: row.sold ? row.sold.readUInt8(0) : 0,
                locations: row.locations,
                item_condition: row.item_condition
            }))
        };
        return part;
    } else {
        throw new Error('Item not found');
    }
}

// Get item by serial number
export async function getItemBySerialNumber(serial_number) {
    const sql = `
        SELECT serial_number, part_number, CAST(sold AS UNSIGNED) AS sold, locations, item_condition FROM serials
        WHERE serial_number = ?;
    `;
    const rows = await executeQuery(sql, [serial_number]);
    if (rows.length) {
        return rows[0];
    } else {
        throw new Error('Item not found');
    }
}

// Insert a new part and its serials
export async function insertPart({ partNumber, locations, serialNumbers, item_description, category, manufacturer, item_condition }) {
    const sqlInsertPart = `
        INSERT INTO parts (part_number, quantity, quantity_on_ebay, quantity_sold, item_description, category, manufacturer)
        VALUES (?, 0, 0, 0, ?, ?, ?);
    `;
    const sqlInsertSerial = `
        INSERT INTO serials (part_number, serial_number, locations, item_condition)
        VALUES (?, ?, ?, ?);
    `;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query(sqlInsertPart, [partNumber, item_description, category, manufacturer]);

        for (const serialNumber of serialNumbers) {
            await connection.query(sqlInsertSerial, [partNumber, serialNumber, locations, item_condition]);
        }

        await connection.commit();
        return { inserted: true };
    } catch (error) {
        await connection.rollback();
        throw new Error('Failed to insert part: ' + error.message);
    } finally {
        connection.release();
    }
}

// Update part details
export async function updatePart(part_number, updates) {
    const { quantity, quantity_on_ebay, quantity_sold, item_description, category, manufacturer } = updates;
    const sql = `
        UPDATE parts
        SET quantity = ?, quantity_on_ebay = ?, quantity_sold = ?, item_description = ?, category = ?, manufacturer = ?
        WHERE part_number = ?;
    `;
    const result = await executeQuery(sql, [quantity, quantity_on_ebay, quantity_sold, item_description, category, manufacturer, part_number]);
    if (result.affectedRows) {
        return { part_number, ...updates };
    } else {
        throw new Error('Part not found or no update needed');
    }
}

// Update serial details
export async function updateSerial(serial_number, updates) {
    const { part_number, sold, locations, item_condition } = updates;
    const sql = `
        UPDATE serials
        SET part_number = ?, sold = ?, locations = ?, item_condition = ?
        WHERE serial_number = ?;
    `;
    const result = await executeQuery(sql, [part_number, sold, locations, item_condition, serial_number]);
    if (result.affectedRows) {
        return { serial_number, ...updates };
    } else {
        throw new Error('Serial number not found or no update needed');
    }
}

// Delete part by part number
export async function deletePart(part_number) {
    const sql = `
        DELETE FROM parts WHERE part_number = ?;
    `;
    const result = await executeQuery(sql, [part_number]);
    if (result.affectedRows) {
        return { part_number, deleted: true };
    } else {
        throw new Error('Part not found');
    }
}

// Delete serial by serial number
export async function deleteSerial(serial_number) {
    const sql = `
        DELETE FROM serials WHERE serial_number = ?;
    `;
    const result = await executeQuery(sql, [serial_number]);
    if (result.affectedRows) {
        return { serial_number, deleted: true };
    } else {
        throw new Error('Serial number not found');
    }
}
