const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection'); // Assuming you have your Sequelize connection set up
const routes = require('./routes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js with custom helpers
const hbs = exphbs.create({
  helpers: {
    formatDate: function (timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleDateString(); // Formats as MM/DD/YYYY or based on locale
    },
    json: function (context) {
      return JSON.stringify(context); // Converts an object to a JSON string
    }
  },
});

// Set up session with Sequelize store
const sess = {
  secret: process.env.SESSION_SECRET || 'fallbackSecretKey', // Use environment variable for secret
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // Session expires after 1 day
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'strict', // Ensures the cookie is only sent in first-party contexts
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// Apply the session configuration
app.use(session(sess));

// Set up Handlebars as the view engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware for handling JSON, form data, and static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Use routes defined in your routes folder
app.use(routes);

// Start the server and sync the Sequelize models
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on http://localhost:${PORT}`));
});