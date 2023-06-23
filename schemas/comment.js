const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  // userId 추가
  userId: {
    type: String,
    required: true, // 특정 유저를 구분해야하기 때문에 필수
  },
  // user -> nickname 으로 변경
  nickname: {
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
