const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

class User extends Model {
  // Method to check if an unhashed password matches the hashed password stored in the database
  async checkPassword(loginPassword) {
    return await bcrypt.compare(loginPassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8], // Minimum length of password
      },
    },
  },
  {
    hooks: {
      // Before a User is created, hash their password
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      // Before a User is updated, hash their password if it has been changed
      async beforeUpdate(updatedUserData) {
        if (updatedUserData.password) {
          updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        }
        return updatedUserData;
      },
    },
    sequelize,
    timestamps: true,
    underscored: true,
    modelName: 'User', // Note: Model name should typically be singular
    tableName: 'users', // Note: Table name should typically be plural
  }
);

module.exports = User;
