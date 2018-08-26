const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load Validation
const validateProfileInput = require("../../validations/profile");
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
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const errors = {};
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        errors.noprofile = "Ther is no profile for this user.";
        return res.status(404).json(errors);
      }
      res.json(profile);
    } catch (err) {
      console.log(err);
    }
  }
);

/**
 * @route POST api/profile
 * @desc Create or edit current user profile
 * @access Private
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // check validation
    if (!isValid) {
      // return errors
      return res.status(400).json(errors);
    }

    // get fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = rewebsite.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills - Split into an array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    // Social is an object
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.ylinkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        // Update
        let updatedProfile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
      } else {
        // Create

        // Check to see if handle exists.
        let handleExistsProfile = await Profile.findOne({
          handle: profileFields.handle
        });
        if (handleExistsProfile) {
          errors.handle = `${req.body.handle} handle already exists`;
          res.status(400).json(errors);
        }

        // Save the profile
        let newProfile = new Profile(profileFields);
        await newProfile.save();
        return res.json(newProfile);
      }
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);

module.exports = router;
