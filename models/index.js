// index.js (or database.js)
const Sequelize = require('sequelize');
const sequelize = require('../config/connection');

const User = require('./user');
const BlogPost = require('./blogPost');
const Comment = require('./comment');

// Define associations
User.hasMany(BlogPost, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

BlogPost.belongsTo(User, {
  foreignKey: 'user_id',
});

BlogPost.hasMany(Comment, {
  foreignKey: 'blog_post_id',
  onDelete: 'CASCADE',
});

Comment.belongsTo(BlogPost, {
  foreignKey: 'blog_post_id',
});

Comment.belongsTo(User, {
  foreignKey: 'user_id',
});

User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

module.exports = { User, BlogPost, Comment, sequelize };
