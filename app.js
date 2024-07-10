// app.js

const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection');
const path = require('path');
const routes = require('./controllers'); // Updated path to controllers
const { User } = require('./models');

const app = express();

// Session middleware
const sess = {
  secret: 'your_secret_key_here',
  cookie: { maxAge: 3600000 },
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
app.use(routes); // Assuming your routes are defined in a separate file

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }

    // Validate password
    if (user.password !== password) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    // Store user data in session
    req.session.loggedInUser = {
      id: user.id,
      username: user.username,
    };

    res.json({ success: true, redirect: '/dashboard' });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = app;
