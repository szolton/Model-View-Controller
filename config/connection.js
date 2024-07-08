// Dotenv import
require("dotenv").config();

// Sequelize import
const Sequelize = require("sequelize");

// Create Sequelize instance
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: "localhost",
  dialect: "mysql",
  dialectOptions: {
    decimalNumbers: true,
  },
});

// Test the connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
