const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const productRoutes = require('./routes/products'); // Import the new routes file
const authRoutes = require('./routes/auth'); // Import the auth routes

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Set CORS Headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE"
    );
    next();
});

// Use the new product routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// General error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 3001; // Corrected 'port' from process.env
app.listen(port, () => {
    console.log('Listening on port', port);
});