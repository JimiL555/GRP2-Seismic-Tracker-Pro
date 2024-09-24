const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const passport = require('passport');
const flash = require('connect-flash');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// Import the necessary routes and models
const routes = require('./controllers'); // Assuming index.js in controllers folder manages routes
const helpers = require('./utils/helpers');
const sequelize = require('./config/connection');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

// Set up sessions with Sequelize store
const sess = {
  secret: 'Super secret secret', // Secret for signing session ID cookies
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// Middleware for sessions and flash messages
app.use(session(sess));
app.use(flash()); // Flash messages for errors, info, etc.

// Initialize Passport and restore authentication state from session
app.use(passport.initialize());
app.use(passport.session());

// Set up Handlebars.js as the template engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up static assets (public folder for CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(routes);

// Custom middleware for setting flash messages to locals (for Handlebars)
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success');
  res.locals.error_messages = req.flash('error');
  next();
});

// Sync database and start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
});