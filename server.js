const express = require('express');
const session = require('express-session');
const Sequelize = require('sequelize');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Example session middleware
app.use(session({
    secret: 'super secret',
    resave: false,
    saveUninitialized: true,
}));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});