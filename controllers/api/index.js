// Imports
const router = require("express").Router();
const userRoutes = require("./userRoutes");
const blogPostRoutes = require("./blogPostRoutes");
const commentRoutes = require("./commentRoutes");
const dashboardRoutes = require("./dashboardRoutes"); // Add the new dashboardRoutes

// Middleware
router.use("/users", userRoutes);
router.use("/blogPost", blogPostRoutes);
router.use("/comment", commentRoutes);
router.use("/dashboard", dashboardRoutes); // Add the new dashboard route

// Exports
module.exports = router;
