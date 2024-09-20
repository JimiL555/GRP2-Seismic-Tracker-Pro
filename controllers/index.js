const router = require('express').Router();
const userRoutes = require('./api/userController');

router.use('/users', userRoutes);  // Updated to expose routes at '/users'

module.exports = router;