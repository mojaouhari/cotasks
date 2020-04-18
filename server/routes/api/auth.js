const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../../../config");
const auth = require("../../middleware/auth");

const User = require("../../models/User");

// @route   GET api/auth
// @desc
// @access  Public
router.get("/", auth, (req, res) => {
  try {
  } catch (error) {}
});

// @route   POST api/auth
// @desc    Log in
// @access  Public
router.post(
  "/",
  [check("email", "Please enter a valid email").isEmail(), check("password", "Password is required").exists()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array });
    }
    let user;
    try {
      // verify user's email
      user = await User.findOne({ email: req.body.user.email });
      if (!user) res.status(400).json({ errors: [{ msg: "Invalid credentials", param: "email" }] });

      // verify password
      const isMatched = await bcrypt.compare(req.body.user.password, user.password);
      if (!isMatched) res.status(400).json({ errors: [{ msg: "Invalid credentials", param: "password" }] });

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
      console.log(error);
    }
  }
);

module.exports = router;
