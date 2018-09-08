const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../../models/Post");
const passport = require("passport");
const validatePostInput = require("../../validations/post");
// @route POST api/posts
// @desc
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    if (!isValid) {
      return res.status(400).json({ errors });
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    try {
      return res.json(await newPost.save());
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);

module.exports = router;
