const express = require("express");
const router = express.Router();
const passport = require("passport");

// Load Validation
const validateProfileInput = require("../../validations/profile");
// Load Profile Model
const Profile = require("../../models/Profile");
// Load User Model
const User = require("../../models/User");

const validateExpInput = require("../../validations/experience");

const validateEducationInput = require("../../validations/education");

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
      let profile = await Profile.findOne({ user: req.user.id }).populate(
        "user",
        ["name", "avatar"]
      );
      if (!profile) {
        errors.noprofile = "There is no profile for this user.";
        return res.status(404).json(errors);
      }
      res.json(profile);
    } catch (err) {
      console.log(err);
    }
  }
);

/**
 * @route GET api/profile/:handle
 * @desc Get profile by handle name
 * @access Public
 */
router.get("/handle/:handle", async (req, res) => {
  const { handle } = req.params;
  const errors = {};
  try {
    let profile = await Profile.findOne({ handle }).populate("user", [
      "name",
      "avatar"
    ]);
    if (!profile) {
      errors.noprofile = "There is no profile for this user";
      return res.status(404).json(errors);
    }
    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

/**
 * @route GET api/profile/all
 * @desc Get all profiles
 * @access Private
 */
router.get("/all", async (req, res) => {
  try {
    let profiles = await Profile.find().populate("user", ["name", "avatar"]);
    return res.json(profiles);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

/**
 * @route GET api/profile/:id
 * @desc Get profile by its id
 * @access Private
 */
router.get("/id/:id", async (req, res) => {
  const { id } = req.params;
  const errors = {};
  try {
    let profile = await Profile.findById(id).populate("user", [
      "name",
      "avatar"
    ]);
    if (!profile) {
      errors.noprofile = "There is no profile for this user";
      return res.status(404).json(errors);
    }
    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

/**
 * @route GET api/profile/user/:id
 * @desc Get profile by its user's id
 * @access Private
 */
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const errors = {};
  try {
    let profile = await Profile.findOne({ user: id }).populate("user", [
      "name",
      "avatar"
    ]);
    if (!profile) {
      errors.noprofile = "Ther is no profile for this user";
      return res.status(404).json(errors);
    }
    return res.json(profile);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

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
        return res.json(updatedProfile);
      } else {
        // Create

        // Check to see if handle exists.
        let handleExistsProfile = await Profile.findOne({
          handle: profileFields.handle
        });
        if (handleExistsProfile) {
          errors.handle = `${req.body.handle} handle already exists`;
          return res.status(400).json(errors);
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

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // check validation
    if (!isValid) {
      // return errors
      return res.status(400).json(errors);
    }
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // add to experience array
      profile.education.unshift(newEdu);

      await profile.save();
      return res.json(profile);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);

// @route   DELETE api/profile/experience/:id
// @desc    Remove experience to profile
// @access  Private
router.delete(
  "/experience/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      const removeAtIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.id);

      // get rid of item at index
      if (removeAtIndex != -1) {
        profile.experience.splice(removeAtIndex, 1);
      } else {
        throw new Error(`experience with id: ${req.params.id} was not found`);
      }
      return res.json(await profile.save());
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);

// @route   DELETE api/profile/education/:id
// @desc    Remove experience to profile
// @access  Private
router.delete(
  "/education/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      const removeAtIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.id);

      // get rid of item at index
      if (removeAtIndex != -1) {
        profile.education.splice(removeAtIndex, 1);
      } else {
        throw new Error(`education with id: ${req.params.id} was not found`);
      }
      return res.json(await profile.save());
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);

// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateExpInput(req.body);

    // check validation
    if (!isValid) {
      // return errors
      return res.status(400).json(errors);
    }
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // add to experience array
      profile.experience.unshift(newExp);

      await profile.save();
      return res.json(profile);
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);

// @route   DELETE api/profile
// @desc    Delete a user and profile
// @access  Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      await Profile.findOneAndRemove({ user: req.user.id });
      await User.findOneAndRemove({ _id: req.user.id });
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);

module.exports = router;
