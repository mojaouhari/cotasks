const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../../config");

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
    console.log(errors);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array });
    }
    let user;
    const { firstname, lastname, username, email, password } = req.body;
    try {
      // check if email or username are already used
      user = await User.findOne({ email: email });
      if (user) res.status(400).send({ errors: [{ msg: "Email address already in use", param: "email" }] });
      user = await User.findOne({ username: username });
      if (user) res.status(400).send({ errors: [{ msg: "Username already in use", param: "username" }] });

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
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
