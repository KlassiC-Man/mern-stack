const express = require("express");
const auth = require("../../middleware/auth");
const router = express.Router();
const { validationResult, check } = require("express-validator");
const User = require("../../models/Users");
const Profile = require("../../models/Profile");
const Post = require("../../models/Post");

// Add Post Route!
router.post(
  "/",
  [auth, [check("text", "Text is required").not().isEmpty()]],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      });

      const post = await newPost.save();

      res.json(post);
    } catch (e) {
      console.error(e);
      res.status(500).send("Internal Server Error!");
    }
  }
);

// Get all the posts through this route
router.get("/", auth, async function (req, res) {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (e) {
    console.error(e);
    return res.status(500).send("Internal Server Error!");
  }
});

router.get("/:id", auth, async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(400).json({ error: "No Post with that ID" });
    }
    res.json(post);
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error!");
  }
});

router.delete("/:id", auth, async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(400).json({ error: "No Post with that ID" });
    }

    if (String(post.user) !== req.user.id) {
      return res.status(401).json({ error: "User not authorized!" });
    }

    await post.remove();
    res.json({ msg: "Post removed!" });
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error!");
  }
});

// ADD likes but updating the post object so it will be a put request!
router.put("/unlike/:id", auth, async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(400).json({ error: "No post with that ID!" });
    }
    if (
      post.likes.filter((like) => String(like.user) === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: "Post not liked!" });
    }
    const removeIndex = post.likes.map((like) => {
      String(like.user).indexOf(req.user.id);
    });
    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error!");
  }
});

router.post(
  "/comment/:id",
  [auth, [check("text", "Text is required")]],
  async function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findById(req.params.id);
      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      };
      post.comments.unshift(newComment);
      await post.save();
      res.json(post.comments);
    } catch (e) {
      console.error(e);
      res.status(500).send("Internal Server Error!");
    }
  }
);

router.delete("/comment/:id/:comment_id", auth, async function (req, res) {
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(400).json({ error: "No comment with that ID" });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "User not authorized!" });
    }
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (e) {
    console.error(e);
    res.status(500).send("Internal Server Error!");
  }
});

module.exports = router;
