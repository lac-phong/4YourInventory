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
	serial_number VARCHAR(255) UNIQUE,
    part_number VARCHAR(255),
    sold BIT,
    FOREIGN KEY (part_number) REFERENCES parts(part_number)
);