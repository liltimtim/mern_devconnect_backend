const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Load User Model
const User = require("../../models/User");
const config = require("../../config/keys");
const passport = require("passport");

// Validation Register
const validateRegisterInput = require("../../validations/register");

/**
 * @route GET api/posts/test
 * @desc Get all users
 * @access Public
 */
router.get("/", (req, res) =>
  res.json({
    msg: "user"
  })
);

router.post("/register", async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    let user = await User.findOne({
      email: req.body.email
    });

    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json({ errors });
    }

    // Grab the Gravatar
    let avatar = gravatar.url(req.body.email, {
      s: "200", // Size
      r: "pg", // Rating
      d: "retro" // Default Style
    });

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      avatar,
      password: req.body.password
    });

    // gen salt
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(newUser.password, salt);
    newUser.password = hash;
    await newUser.save();
    res.json(newUser);
  } catch (err) {
    res.status(400).json({ error: err });
  }
});

/**
 * @route POST api/users/login
 * @desc Login User / Return JWT Token
 * @access Public
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    let user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ email: `User with email ${email} not found.` });
    }

    // compare / match pw hash
    let comparison = await bcrypt.compare(password, user.password);
    if (!comparison) {
      return res.status(403).json({ password: "Invalid password." });
    }

    // generate JWT Token / sign the token
    let token = await jwt.sign({ id: user.id }, config.jwtSecret, {
      expiresIn: 3600
    });
    return res.json({
      success: true,
      token: `Bearer ${token}`
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

/**
 * @route GET api/users/current
 * @desc Return current user
 * @access Private
 */
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { user } = req;
    res.json({ user });
  }
);

module.exports = router;
