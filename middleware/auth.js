const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models');

passport.use(new LocalStrategy(
  async (username, password, done) => {
      try {
          const user = await User.findOne({ where: { username } });
          if (!user) {
              return done(null, false, { message: 'Incorrect username.' });
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
              return done(null, false, { message: 'Incorrect password.' });
          }
          
          return done(null, user);
      } catch (err) {
          return done(err);
      }
  }
));

// Serialize user to save user.id in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user to retrieve full user data from user.id stored in session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const withAuth = (req, res, next) => {
  if (!req.session.user_id) {
    res.status(401).json({ message: 'You need to log in to access this resource.' });
  } else {
    next();
  }
};

module.exports = withAuth;