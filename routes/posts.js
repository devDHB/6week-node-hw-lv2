//라우터 연결
const express = require("express");

const router = express.Router();

// post 스키마 불러오기
const Post = require("../schemas/post");
const PostCount = require("../schemas/postCount");
const Comment = require("../schemas/comment");

// date 모듈 불러오기
let datetime = require("../modules/date");

// 전체 게시글 조회 GET
router.get("/posts/", async (req, res) => {
  const posts = await Post.find();
  const results = posts.map((post) => {
    return {
      postId: post.postId,
      user: post.user,
      title: post.title,
      createdAt: post.createdAt,
    };
  });
  res.json({
    data: results,
  });
});

// 게시글 추가 POST
router.post("/posts/", async (req, res) => {
  const { user, password, title, content } = req.body;

  // 현재시간
  const createdAt = datetime;

  const existsPosts = await Post.find();
  if (existsPosts.length) {
    await PostCount.updateOne(
      { name: "Post Count" },
      { $inc: { postCount: 1 } }
    );
  } else {
    PostCount.create({
      postCount: 0,
      name: "Post Count",
    });
  }

  // 총 게시글 개수
  let count = await PostCount.find({ name: "Post Count" });

  // post id 저장
  let postId = count[0]["postCount"];

  const createdPost = await Post.create({
    postId,
    user,
    password,
    title,
    content,
    createdAt,
  });

  res.json({ posts: createdPost });
});

// 게시글 상세 조회
router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;

  let posts = await Post.find({});
  let result = null;
  for (const post of posts) {
    if (Number(postId) === post.postId) {
      result = post;
    }
  }

  res.status(200).json({ detail: result });
});

// 게시글 수정
router.put("/posts/:postId/", async (req, res) => {
  const postsId = req.params.postId;
  const password = req.body.password;
  const user = req.body.user;
  const title = req.body.title;
  const content = req.body.content;

  const existsPosts = await Post.find({});
  if (existsPosts.length) {
    await Post.updateOne(
      { postId: postsId },
      {
        $set: {
          password: password,
          user: user,
          title: title,
          content: content,
        },
      }
    );
  }
  // 게시글 유무 상관없이 트루 출력
  res.status(200).json({ success: true });
});

// 게시글 삭제
router.delete("/posts/:postId", async (req, res) => {
  const postsId = req.params.postId;
  const password = req.body.password;

  let posts = await Post.find({});

  for (const post of posts) {
    if (Number(postsId) === post.postId) {
      if (password == post.password) {
        await Post.deleteOne({ postId: postsId });
      }
    }
  }

  res.json({ result: "success" });
});

// 게시글에 코멘트 추가하기
router.post("/comments/:postId/", async (req, res) => {
  const postsId = req.params.postId;
  const { user, password, content } = req.body;

  // 현재시간
  const createdAt = datetime;

  const existsPosts = await Post.find({ postId: postsId });

  const postId = existsPosts[0].postId;
  console.log(postId);

  if (existsPosts.length) {
    const createdComment = await Comment.create({
      postId,
      user,
      password,
      content,
      createdAt,
    });
    res.json({ comments: createdComment });
  } else {
    return res.status(400).json({
      success: false,
      errorMessage: "게시글이 없습니다.",
    });
  }
});

// 댓글 목록 조회
router.get("/comments/:postId", async (req, res) => {
  const postsId = req.params.postId;
  const comments = await Comment.find({ postId: postsId });

  const results = comments.map((comment) => {
    return {
      postId: comment.postId,
      commentId: comment._id,
      user: comment.user,
      password: comment.password,
      content: comment.content,
      createdAt: comment.createdAt,
    };
  });

  res.json({
    data: results,
  });
});

// 댓글 수정
router.put("/comments/:commentId/", async (req, res) => {
  const commentId = req.params.commentId;
  const { password, content } = req.body;

  const existsComments = await Comment.find({});
  if (existsComments.length) {
    await Comment.updateOne(
      { _id: commentId },
      {
        $set: {
          password: password,
          content: content,
        },
      }
    );
  }
  // 게시글 유무 상관없이 트루 출력
  res.status(200).json({ message: "댓글을 수정하였습니다." });
});

// 게시글 삭제
router.delete("/comments/:commentId/", async (req, res) => {
  const commentId = req.params.commentId;
  const password = req.body.password;

  let comments = await Comment.find({});

  for (const comment of comments) {
    if (commentId == comment._id) {
      if (password == comment.password) {
        await Comment.deleteOne({ _id: commentId });
      }
    }
  }

  res.json({ message: "댓글을 삭제하였습니다." });
});

module.exports = router;
