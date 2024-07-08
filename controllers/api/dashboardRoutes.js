// Imports
const router = require("express").Router();
const { Dashboard } = require("../../models");
const withAuth = require("../../utils/auth");

// CREATE Dashboard Item
router.post("/", withAuth, async (req, res) => {
  try {
    const newDashboardItem = await Dashboard.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newDashboardItem);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

// READ all Dashboard Items
router.get("/", withAuth, async (req, res) => {
  try {
    const dashboardData = await Dashboard.findAll({
      where: {
        user_id: req.session.user_id,
      },
    });
    res.status(200).json(dashboardData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// UPDATE Dashboard Item
router.put("/:id", withAuth, async (req, res) => {
  try {
    const updatedDashboardItem = await Dashboard.update(req.body, {
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!updatedDashboardItem[0]) {
      res.status(404).json({ message: "No dashboard item found with that id!" });
      return;
    }

    res.status(200).json(updatedDashboardItem);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// DELETE Dashboard Item
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const dashboardItem = await Dashboard.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!dashboardItem) {
      res.status(404).json({ message: "No dashboard item found with that id!" });
      return;
    }

    res.status(200).json(dashboardItem);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Exports
module.exports = router;
