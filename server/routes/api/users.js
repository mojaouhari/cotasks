const express = require("express");
const router = express.Router();

const User = require("../../models/User");

// @route   GET api/users
// @desc    Get all users
// @access  Public
router.get("/", (req, res) => {
  res.send("User route");
});

// @route   POST api/users
// @desc    Create a user
// @access  Public
router.post("/", async (req, res) => {
  try {
    const newUser = new User({ ...req.body });
    const user = await newUser.save();
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
