CREATE TABLE parts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    part_number VARCHAR(255) UNIQUE,
    quantity INT,
    quantity_on_ebay INT,
    quantity_sold INT,
    locations TEXT
);

CREATE TABLE serials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serial_number VARCHAR(255),
    part_number VARCHAR(255),
    sold BIT,
    FOREIGN KEY (part_number) REFERENCES parts(part_number),
    UNIQUE (serial_number, part_number)
);

INSERT INTO serials (serial_number, part_number, sold)
SELECT 
    e.`Serial Number` AS serial_number,
    p.part_number AS part_number,
    IF(e.`Qty Sold` > 0, 1, 0) AS sold
FROM parts p
JOIN equipment e ON p.part_number = e.`Part Number`;

INSERT INTO parts (part_number, locations, quantity, quantity_sold)
SELECT 
    UPPER(REPLACE(TRIM(`Part Number`), ' ', '')) AS part_number,
    COALESCE(GROUP_CONCAT(DISTINCT Location ORDER BY Location SEPARATOR ', '), '') AS locations,
    COALESCE(COUNT(`Serial Number`), 0) AS quantity,
    COALESCE(SUM(`Qty Sold`), 0) AS quantity_sold
FROM equipment
WHERE `Part Number` IS NOT NULL
GROUP BY UPPER(REPLACE(TRIM(`Part Number`), ' ', ''));