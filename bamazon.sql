DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES 
("Dust Mask", "Health & Personal Care", 4.50, 30),
("Cacao Honey", "Grocery", 21.99, 100),
("Moon Cheese", "Grocery", 25.99, 100),
("Crest 3D White Whitening Toothpaste","Health & Personal Care",7.49,50),
("Polaroid Originals B&W Film", "Electronics",14.44, 50),
("Polaroid Instant Film Cameras","Electronics", 71.40,30),
("Canned Wet Cat Food", "Pet Supplies", 15.39, 24),
("Indoor Palm Tree","Home & Kitchen", 60.86, 10);
