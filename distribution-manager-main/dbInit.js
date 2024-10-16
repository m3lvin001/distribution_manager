const mysql = require('mysql2');
require('dotenv').config();

const dbConfig = {
  host: process.env.DBHOST,
  user: process.env.DBUSER,
  password: process.env.DBPASS,
};

const createDatabase = () => {
  const connection = mysql.createConnection(dbConfig);

  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL server');

    connection.query('CREATE DATABASE IF NOT EXISTS dmsdb', (err) => {
      if (err) throw err;
      console.log('Database created or already exists');

      connection.changeUser({database: 'dmsdb'}, (err) => {
        if (err) throw err;
        console.log('Using dmsdb database');

        const tables = [
          `CREATE TABLE IF NOT EXISTS items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            category VARCHAR(100) NOT NULL,
            image VARCHAR(255) NOT NULL
          )`,
          `CREATE TABLE IF NOT EXISTS customers (
            id INT AUTO_INCREMENT PRIMARY KEY,
            firstname VARCHAR(100) NOT NULL,
            lastname VARCHAR(100) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            physicalAddress VARCHAR(255) NOT NULL,
            pass VARCHAR(255) NOT NULL
          )`,
          `CREATE TABLE IF NOT EXISTS cart (
            id INT AUTO_INCREMENT PRIMARY KEY,
            customerId INT NOT NULL,
            itemId INT NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            quantity INT NOT NULL,
            FOREIGN KEY (customerId) REFERENCES customers(id),
            FOREIGN KEY (itemId) REFERENCES items(id)
          )`,
          `CREATE TABLE IF NOT EXISTS orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            customerId INT NOT NULL,
            orderDescription TEXT NOT NULL,
            amount DECIMAL(10, 2) NOT NULL,
            paymentMode VARCHAR(50) NOT NULL,
            physicalAddress VARCHAR(255) NOT NULL,
            DS ENUM('waiting', 'delivered') NOT NULL DEFAULT 'waiting',
            PS ENUM('paid', 'pending') NOT NULL DEFAULT 'pending',
            delivererId INT,
            delivererName VARCHAR(255),
            FOREIGN KEY (customerId) REFERENCES customers(id)
          )`,
          `CREATE TABLE IF NOT EXISTS orderItems (
            id INT AUTO_INCREMENT PRIMARY KEY,
            orderId INT NOT NULL,
            itemId INT NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            quantity INT NOT NULL,
            FOREIGN KEY (orderId) REFERENCES orders(id),
            FOREIGN KEY (itemId) REFERENCES items(id)
          )`,
          `CREATE TABLE IF NOT EXISTS transactions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            MerchantRequestID VARCHAR(255) NOT NULL,
            CheckoutRequestID VARCHAR(255) NOT NULL,
            Amount DECIMAL(10, 2) NOT NULL,
            ReceiptNumber VARCHAR(255) NOT NULL,
            TransactionDate DATETIME NOT NULL,
            PhoneNumber VARCHAR(15) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`,
          `CREATE TABLE IF NOT EXISTS magazines (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            price DECIMAL(10, 2) NOT NULL,
            category VARCHAR(100) NOT NULL,
            image VARCHAR(255) NOT NULL
          )`,
          `CREATE TABLE IF NOT EXISTS vendor (
            id INT AUTO_INCREMENT PRIMARY KEY,
            firstname VARCHAR(255) NOT NULL,
            lastname VARCHAR(255) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            physicalAddress VARCHAR(255) NOT NULL,
            pass VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`,
          `CREATE TABLE IF NOT EXISTS deliverer (
            id INT AUTO_INCREMENT PRIMARY KEY,
            firstname VARCHAR(255) NOT NULL,
            lastname VARCHAR(255) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            physicalAddress VARCHAR(255) NOT NULL,
            pass VARCHAR(255) NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`
        ];

        tables.forEach((table, index) => {
          connection.query(table, (err) => {
            if (err) throw err;
            console.log(`Table ${index + 1} created or already exists`);
            if (index === tables.length - 1) {
              console.log('All tables created successfully');
              connection.end();
            }
          });
        });
      });
    });
  });
};

module.exports = { createDatabase };