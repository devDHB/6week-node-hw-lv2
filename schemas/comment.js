const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: {
    type: Number,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
