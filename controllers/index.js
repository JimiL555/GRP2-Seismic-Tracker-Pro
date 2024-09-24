// Import express
const express = require('express');
const router = express.Router();

// Import API routes (userController, searchController, etc.)
const userRoutes = require('./api/userController');
const searchRoutes = require('./api/searchController');

// Set up routes
router.use('/api/users', userRoutes); // Routes related to user authentication and management
router.use('/api/search', searchRoutes); // Routes related to earthquake searches

// Export the router
module.exports = router;