const express = require('express');
const router = express.Router();
const db = require('../db'); // Import the database connection
const authMiddleware = require('../middleware/authMiddleware');

// GET all products - Public
router.get('/', (req, res) => {
    db.query("SELECT * FROM product", (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving products');
        }
        res.json(result);
    });
});

// GET a single product by ID - Public
router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query("SELECT * FROM product WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error retrieving product');
        }
        if (result.length === 0) {
            return res.status(404).send(`Product not found with id: ${id}`);
        }
        res.json(result[0]);
    });
});

// DELETE a product by ID - Protected
router.delete('/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM product WHERE id = ?", [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error deleting product');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send(`Product not found with id: ${id}`);
        }
        res.status(204).send("delete successfully!"); // No content to send back
    });
});

// POST a new product - Protected
router.post('/', authMiddleware, (req, res) => {
    const { title, price, author, image_url } = req.body;

    if (!title || !price || !author) {
        return res.status(400).send('Missing required fields: title, price, and author.');
    }

    const newProduct = { title, price, author, image_url };
    db.query("INSERT INTO product (id, title, price, author, image_url) VALUES (UUID(), ?, ?, ?, ?)", 
             [newProduct.title, newProduct.price, newProduct.author, newProduct.image_url], 
             (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error adding product');
        }
        res.status(201).json({ message: "Product created successfully", productId: result.insertId });
    });
});

// PUT (update) a product by ID - Protected
router.put('/:id', authMiddleware, (req, res) => {
    const { id } = req.params;
    const { title, price, author, image_url } = req.body;

    if (!title || !price) {
        return res.status(400).send('Missing required fields: title and price.');
    }

    const updatedProduct = { title, price, author, image_url };
    db.query("UPDATE product SET title = ?, price = ?, author = ?, image_url = ? WHERE id = ?", 
             [updatedProduct.title, updatedProduct.price, updatedProduct.author, updatedProduct.image_url, id], 
             (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating product');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send(`Product not found with id: ${id}`);
        }
        res.json({ message: "Product updated successfully" });
    });
});

module.exports = router;