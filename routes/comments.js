const express = require("express");
const Post = require("../schemas/post");
const Comment = require("../schemas/comment");
const router = express.Router();

router.get("/comments", async (req, res) => {
  const comments = await Comment.find();
  const postIds = comments.map((comment) => comment._id);

  const posts = await Post.find({ postId: postIds });

  const results = comments.map((comment) => {
    return {
      commentId: comment._id,
      user: comment.user,
      password: comment.password,
      content: comment.content,
      createdAt: comment.createdAt,
      posts: posts.find((item) => item.postId === comment.postId),
    };
  });

  res.json({
    comments: results,
  });
});

module.exports = router;
