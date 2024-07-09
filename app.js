// app.js

const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection'); // Assuming this is where your Sequelize instance is configured
const path = require('path');
const routes = require('./routes'); // Import your routes

const app = express();

// Session middleware
const sess = {
  secret: 'your_secret_key_here',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving middleware
app.use(express.static(path.join(__dirname, 'public')));

// Set up your routes
app.use('/', routes); // Assuming your routes are defined in a separate file

module.exports = app;