const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Profile Model
const Profile = require("../../models/Profile");
// Load User Model
const User = require("../../models/User");

router.get("/test");

/**
 * @route GET api/profile
 * @desc Get current user profile
 * @access Private
 */
router.get("/", passport.authenticate('jwt', { session: false }), (req, res) => {
  const errors = {};
  try {
    let profile = await Profile.findOne({ user: req.user.id })
    if (!profile) { 
      errors.noprofile = "Ther is no profile for this user.";
      return res.status(404).json(errors);
    }
    res.json(profile);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
