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

// Initialize Express.js
const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

// Session configuration
const sess = {
  secret: "Super secret secret", // Used to sign the session ID cookie
  cookie: {
    maxAge: 1200000, // Session timeout in milliseconds (20 minutes)
    httpOnly: true, // Forces cookies to be used only through HTTP(S) requests
    secure: false, // Ensures cookies are only sent over HTTPS in production
    sameSite: "strict", // Mitigates CSRF attacks by restricting when cookies are sent
  },
  resave: false, // Prevents session data from being re-saved to the session store on each request
  saveUninitialized: true, // Ensures a session is created even if it's not initialized
  store: new SequelizeStore({
    db: sequelize, // Connects sessions table with Sequelize
    expiration: 86400000, // Optional: Session expiration time in milliseconds (24 hours)
    tableName: "Session", // Optional: Name of the session table
  }),
};

// Middleware
app.use(session(sess)); // Adds session support to Express.js
app.engine("handlebars", hbs.engine); // Sets Handlebars as the template engine
app.set("view engine", "handlebars"); // Uses Handlebars for rendering views
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses incoming requests with URL-encoded payloads
app.use(express.static(path.join(__dirname, "public"))); // Serves static files from the "public" directory

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
  });
