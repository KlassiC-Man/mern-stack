const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const User = require("../../models/Users");
const jwt = require("jsonwebtoken");
const config = require("config");

// DEPRECATED: This is the /api/users route.
// DEPRECATED: It is the default route for /api/users;
// This route is now used to register user!!!!
router.post(
  "/",
  [
    check("name", "Name is Required").not().isEmpty(),
    check("email", "Please enter a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    const { name, email, password } = req.body;
    try {
      // Check if user exists!
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "user already exists!" }] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      // Create a user instance!
      user = new User({
        name,
        email,
        password,
        avatar,
      });
      // Encrypt the password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save the user!!
      await user.save();

      // Return a jsonwebtoken for the user!
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 86400 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: "Server error!" });
    }
  }
);

module.exports = router;
