const router = require('express').Router();
const userRoutes = require('../controllers/api/userController');

const searchRoutes = require('../controllers/api/searchController'); // Adjust path if needed

router.use('/', searchRoutes); // This exposes the /search route


// Add middleware to protect routes here if needed, or do it in userController
router.use('/users', userRoutes);  // Routes for user actions, e.g., '/users/dashboard'

module.exports = router;