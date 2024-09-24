const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const { User, Searches } = require('../../models');
const router = express.Router();
const { isAuthenticated } = require('../../middleware/auth');
console.log(__dirname);

// GET: User dashboard (protected route)
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const savedSearches = await Searches.findAll({
      where: { userId },
    });
    res.render('dashboard', { user: req.user, searches: savedSearches });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching dashboard data', error: err });
  }
});

// POST: Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Check if username is already taken
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

// POST: User login
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login',
  failureFlash: true,
}));

// GET: User logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
      if (err) {
          console.log(err);
          res.status(500).json({ message: 'Error logging out' });
      } else {
          req.session.destroy(() => {
              res.redirect('/login'); // Make sure /login exists as a route
          });
      }
  });
});

module.exports = router;