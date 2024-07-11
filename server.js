// Imports
const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const helpers = require("./utils/helpers");
const Sequelize = require('sequelize');
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const withAuth = require("./utils/auth");
const { User } = require("./models"); // Make sure you have a User model

// Initialize Express.js
const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

// Session configuration
const sess = {
  secret: process.env.SESSION_SECRET || "Super secret secret", // Use environment variable for secret
  cookie: {
    maxAge: 1200000, // Session timeout in milliseconds (20 minutes)
    httpOnly: true, // Forces cookies to be used only through HTTP(S) requests
    secure: false, // Ensure cookies are only sent over HTTPS in production
    sameSite: "strict", // Mitigates CSRF attacks by restricting when cookies are sent
  },
  resave: false, // Prevents session data from being re-saved to the session store on each request
  saveUninitialized: true, // Ensures a session is created even if it's not initialized
  store: new SequelizeStore({
    db: sequelize, // Connects sessions table with Sequelize
    expiration: 86400000, // Session expiration time in milliseconds (24 hours)
    tableName: "Session", // Name of the session table in your database
  }),
};

// Middleware
app.use(session(sess)); // Adds session support to Express.js
app.engine("handlebars", hbs.engine); // Sets Handlebars as the template engine
app.set("view engine", "handlebars"); // Uses Handlebars for rendering views
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads
app.use(express.static(path.join(__dirname, "public"))); // Serves static files from the "public" directory

// Sample login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Attempting to log in with:", email);

    // Example user authentication logic (replace with your own)
    const user = await User.findOne({ where: { email } });
    if (!user) {
      console.log("User not found");
      return res.status(401).send('Login failed. Please check your credentials.');
    }

    // Assume your User model has a method to compare passwords
    const validPassword = await user.checkPassword(password);
    if (!validPassword) {
      console.log("Invalid password");
      return res.status(401).send('Login failed. Please check your credentials.');
    }

    req.session.logged_in = true;
    req.session.user_id = user.id;
    res.redirect('/dashboard');
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
});

// Sample protected route using withAuth middleware
app.get('/dashboard', withAuth, (req, res) => {
  res.render('dashboard'); // Render the dashboard or any other protected route
});

// Routes
app.use(routes); // Mounts all routes defined in ./controllers

// Syncs Sequelize models with the database and starts the server
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
    sequelize.sync({ force: false }).then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
    // Handle database connection errors here
  });

module.exports = app; // Export the app for testing
