// Import dependencies
const express = require('express');
const session = require('express-session');
const path = require('path');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection'); // Your Sequelize connection
const routes = require('./controllers'); // Your route definitions
const exphbs = require('express-handlebars'); // For Handlebars if you're using it
const helpers = require('./utils/helpers'); // If you have any custom helpers for Handlebars
const models = require('./models'); // Import your models

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers (if using Handlebars for views)
const hbs = exphbs.create({ helpers });

// Session configuration
const sess = {
  secret: 'Super secret secret', // Change this to a more secure secret for production
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // Session expires after 1 day
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: false, // Set to true if using HTTPS in production
    sameSite: 'strict', // Ensures the cookie is only sent in first-party contexts
  },
  resave: false, // Prevents session from being saved back to the store if not modified
  saveUninitialized: true, // Save a session that is new, but not modified
  store: new SequelizeStore({
    db: sequelize,
  }),
};

// Middleware for managing user sessions
app.use(session(sess));

// Middleware to parse incoming JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Set up Handlebars.js as the template engine (if using it)
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Use routes defined in your "controllers" folder
app.use('/api', routes);

// Start the server after syncing Sequelize models with the database
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
});