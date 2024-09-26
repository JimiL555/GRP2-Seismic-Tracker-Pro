const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const exphbs = require('express-handlebars');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection'); // Assuming this points to your database connection file
const routes = require('./routes'); // Ensure this path points to your routes folder
const helpers = require('./utils/helpers'); // Import the helpers

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Set up session middleware with SequelizeStore for session persistence
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
  secret: 'Super secret secret',
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  },
  resave: false,
  saveUninitialized: true,
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Set up Handlebars.js as the templating engine and register custom helpers
const hbs = exphbs.create({ helpers }); // Register helpers here

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware for parsing requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Use the routes defined in the routes folder
app.use(routes);

// Sync Sequelize models and start the server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});