const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const passport = require("passport");
const validatePostInput = require("../../validations/post");

router.get("/", async (req, res) => {
  try {
    return res.json(await Post.find().sort({ date: -1 }));
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.post(
  "/like/:post_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { post_id } = req.params;
      let profile = await Profile.findOne({ user: req.user.id });
      let post = await Post.findById(post_id);
      if (
        post.likes.filter(like => like.user.toString() === req.user.id).length >
        0
      ) {
        let err = new Error();
        err.message = "This post has already been liked by the user.";
        return res.status(400).json({ error: err });
      }
      post.likes.unshift({ user: req.user.id });
      return res.json(await post.save());
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);

router.post(
  "/unlike/:post_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { post_id } = req.params;
      let profile = await Profile.findOne({ user: req.user.id });
      let post = await Post.findById(post_id);
      if (
        post.likes.filter(like => like.user.toString() === req.user.id)
          .length === 0
      ) {
        let err = new Error();
        err.message = "User has not liked the post.";
        return res.status(400).json({ error: err });
      }
      // Get index to remove
      let indexOf = post.likes
        .map(like => like.user.toString())
        .indexOf(req.user.id);
      if (indexOf !== -1) {
        post.likes.splice(indexOf, 1);
      }
      return res.json(await post.save());
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);

router.get("/:post_id", async (req, res) => {
  try {
    const { post_id } = req.params;
    let post = await Post.findById(post_id);
    if (!post) {
      let err = new Error();
      err.message = `Post with id: ${post_id} not found`;
      return res.status(404).json({ error: err });
    }
    return res.json(post);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.delete(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      let post = await Post.findById(req.params.post_id);
      if (post.user.toString() !== req.user.id) {
        let err = new Error();
        err.message = "User not authorized to delete this post";
        return res.status(401).json({ error: err });
      }

      // delete
      await post.remove();
      return res.json({ success: true });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);

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

router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { text, name } = req.body;
      let post = await Post.findById(id);
      if (!post) {
        let error = new Error();
        error.message = `Post with id: ${id} not found`;
        return res.status(404).json({ error });
      }
      const newComment = {
        text,
        name,
        avatar: req.body.avatar,
        user: req.user.id
      };
      post.comments.unshift(newComment);
      return res.json(await post.save());
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);

router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const { id, comment_id } = req.params;
      let post = await Post.findById(id);
      if (!post) {
        let error = new Error();
        error.message = `Post with id: ${id} not found`;
        return res.status(404).json({ error });
      }

      if (
        post.comments.filter(comment => comment._id.toString() === comment_id)
          .length === 0
      ) {
        let error = new Error();
        error.message = `Comment with id: ${comment_id} not found`;
        return res.status(404).json({ error });
      }

      const indexOf = post.comments
        .map(comment => comment._id.toString())
        .indexOf(comment_id);
      if (indexOf !== -1) {
        post.comments.splice(indexOf, 1);
      }
      return res.json(await post.save());
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);

module.exports = router;
