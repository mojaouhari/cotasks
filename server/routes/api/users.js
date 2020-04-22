const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../../config");
const auth = require("../../middleware/auth");
const mongoose = require("mongoose");


const User = require("../../models/User");

// @route   GET api/users
// @desc    Get all users
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.aggregate([
      {
        $project: {
          _id: 1,
          firstname: 1,
          lastname: 1,
          email: 1,
        },
      },
    ]);
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/users/:id
// @desc    Get a user
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
      {
        $project: {
          _id: 1,
          firstname: 1,
          lastname: 1,
          email: 1,
        },
      },
    ]);
    res.send(user);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});


// @route   POST api/users
// @desc    Create a user
// @access  Public
router.post(
  "/",
  [
    check("firstname", "First name is required").not().isEmpty(),
    check("lastname", "Last name is required").not().isEmpty(),
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check("password", "Minimum password length is 8 characters").isLength({ min: 8 }),
  ],
  async (req, res) => {
    // console.log(req.body.);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }
    let user;
    const { firstname, lastname, username, email, password } = req.body;
    try {
      // check if email or username are already used
      user = await User.findOne({ email: email });
      if (user) return res.status(400).json({ errors: [{ msg: "Email address already in use", param: "email" }] });
      user = await User.findOne({ username: username });
      if (user) return res.status(400).json({ errors: [{ msg: "Username already in use", param: "username" }] });

      // create the user
      user = new User({ firstname, lastname, username, email, password });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };
      jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
