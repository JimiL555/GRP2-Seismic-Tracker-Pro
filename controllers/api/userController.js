const router = require('express').Router();
const { User } = require('../../models');
const bcrypt = require('bcrypt');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const userData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password, // Store the hashed password
    });

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res.status(400).json({ message: 'Incorrect email or password, please try again.' });
      return;
    }

    const validPassword = bcrypt.compareSync(req.body.password, userData.password); // Correct bcrypt comparison

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect email or password, please try again.' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Logout
router.post('/logout', (req, res) => {
  if (req.session) {
    // Destroy the session
    req.session.destroy(err => {
      if (err) {
        res.status(500).json({ message: 'Error logging out.' });
      } else {
        res.status(204).send(); // No content, meaning logout was successful
      }
    });
  } else {
    res.status(204).send(); // No session to destroy, but that's fine
  }
});

// Middleware to protect authenticated routes
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
      return next();
  } else {
      res.redirect('/login');
  }
}

// GET: User profile/dashboard (protected route)
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
      const userId = req.user.id;  // Get the authenticated user's ID
      
      // Fetch user data and any related info you want to display (e.g., saved searches)
      const user = await User.findByPk(userId, {
          include: [{ model: Searches }]  // Assuming user searches are stored in the Searches model
      });

      // Render the dashboard template with the user's data
      res.render('dashboard', { user });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error loading dashboard', error: err });
  }
});

// Register a new user with a unique username check
router.post('/register', async (req, res) => {
  try {
    const existingUser = await User.findOne({ where: { username: req.body.username } });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists, please choose another one.' });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash the password
    const userData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword, // Store the hashed password
    });

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      res.status(200).json(userData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;