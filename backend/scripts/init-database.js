
import mysql from 'mysql2';
require('dotenv').config();

const dbName = process.env.DB_NAME || 'eliteshop';

// Clean schema string: all tables and inserts, no duplicates
const schema = `
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    category_id INT UNSIGNED,
    image_url VARCHAR(500),
    stock_quantity INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS product_images (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    product_id INT UNSIGNED NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNSIGNED,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT,
    billing_address TEXT,
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    order_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS cart_items (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    user_id INT UNSIGNED,
    session_id VARCHAR(255),
    product_id INT UNSIGNED NOT NULL,
    quantity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    product_id INT UNSIGNED NOT NULL,
    user_id INT UNSIGNED,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT IGNORE INTO categories (id, name, description) VALUES 
(1, 'Audio', 'Premium audio equipment and accessories'),
(2, 'Gaming', 'Gaming peripherals and accessories'),
(3, 'Computing', 'Laptops, computers and accessories'),
(4, 'Wearables', 'Smart watches and wearable technology');

INSERT IGNORE INTO products (id, name, description, price, original_price, category_id, image_url, stock_quantity, is_featured, is_new, rating, review_count) VALUES 
(1, 'Premium Wireless Headphones', 'High-quality wireless headphones with noise cancellation and premium sound quality. Perfect for music lovers and professionals.', 299.00, 399.00, 1, '/src/assets/hero-headphones.jpg', 50, TRUE, TRUE, 4.8, 156),
(2, 'Mechanical Gaming Keyboard', 'Professional mechanical gaming keyboard with RGB lighting and customizable keys. Built for competitive gaming.', 149.00, 199.00, 2, '/src/assets/product-keyboard.jpg', 30, FALSE, FALSE, 4.6, 89),
(3, 'Ultrabook Laptop Pro', 'Powerful ultrabook with latest processors, high-resolution display, and all-day battery life. Perfect for professionals.', 1299.00, NULL, 3, '/src/assets/product-laptop.jpg', 15, TRUE, TRUE, 4.9, 234),
(4, 'Smart Fitness Watch', 'Advanced fitness tracking with heart rate monitoring, GPS, and smartphone integration. Track your health 24/7.', 249.00, 299.00, 4, '/src/assets/product-watch.jpg', 25, FALSE, FALSE, 4.5, 178);
`;

console.log('Initializing database...');

// Step 1: Create database if not exists
const adminConnection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306
});

adminConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`, (err) => {
    if (err) {
        console.error('Error creating database:', err);
        adminConnection.end();
        process.exit(1);
    }
    adminConnection.end();

    const dbConnection = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD,
        database: dbName,
        port: process.env.DB_PORT || 3306
    });

    const statements = schema.split(';').map(s => s.trim()).filter(Boolean);
    (async () => {
        try {
            for (const stmt of statements) {
                await new Promise((resolve, reject) => {
                    dbConnection.query(stmt, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            }
            console.log('Database initialized successfully!');
            console.log('Sample data inserted.');
            dbConnection.end();
            process.exit(0);
        } catch (error) {
            console.error('Error initializing schema:', error);
            dbConnection.end();
            process.exit(1);
        }
    })();
});