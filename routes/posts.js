//라우터 연결
const express = require("express");

const router = express.Router();

// post 스키마 불러오기
const Post = require("../schemas/post");
const PostCount = require("../schemas/postCount");
const Comment = require("../schemas/comment");
const { isValidObjectId } = require("mongoose");

// 전체 게시글 조회 GET
router.get("/posts/", async (req, res) => {
  // 날짜 내림차순
  const posts = await Post.find().sort({ createdAt: -1 });
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

  // # 400 body 또는 params를 입력받지 못한 경우
  if (!user || !password || !title || !content) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  } else {
    // 현재 날짜 저장
    let today = new Date();

    let year = today.getFullYear();
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let day = ("0" + today.getDate()).slice(-2);

    let hours = ("0" + today.getHours()).slice(-2);
    let minutes = ("0" + today.getMinutes()).slice(-2);
    let seconds = ("0" + today.getSeconds()).slice(-2);

    let date = year + "-" + month + "-" + day;
    let time = hours + ":" + minutes + ":" + seconds;

    // 년 월 일 시간
    let dateTime = date + " " + time;
    const createdAt = dateTime;

    const existsPosts = await Post.find();
    if (existsPosts.length) {
      await PostCount.updateOne(
        { name: "Post Count" },
        { $inc: { postCount: 1 } }
      );
    } else {
      await PostCount.create({
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
  }
});

// 게시글 상세 조회
router.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;

  // # 400 body 또는 params를 입력받지 못한 경우
  if (isValidObjectId(postId) || !postId) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  } else {
    let posts = await Post.find({});
    let result = null;
    for (const post of posts) {
      if (postId === post.postId) {
        result = post;
      }
    }
    res.status(200).json({ data: result });
  }
});

// 게시글 수정
router.put("/posts/:postId/", async (req, res) => {
  const postsId = req.params.postId;
  const password = req.body.password;
  const user = req.body.user;
  const title = req.body.title;
  const content = req.body.content;

  // # 400 body 또는 params를 입력받지 못한 경우
  if (
    isValidObjectId(postsId) ||
    !postsId ||
    !user ||
    !password ||
    !title ||
    !content
  ) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  } else {
    const existsPosts = await Post.findOne({
      postId: postsId,
    });
    // # 404 _postId에 해당하는 게시글이 존재하지 않을 경우
    if (!existsPosts) {
      res.status(400).json({ message: "게시글이 없습니다" });
    } else {
      if (existsPosts.password === password) {
        await Post.updateOne(
          { postId: postsId },
          {
            $set: {
              user: user,
              title: title,
              content: content,
            },
          }
        );
        res.status(200).json({ message: "게시글을 수정하였습니다" });
      } else {
        res.status(400).json({ message: "비밀 번호가 일치하지 않습니다" });
      }
    }
  }
});

// 게시글 삭제
router.delete("/posts/:postId", async (req, res) => {
  const postsId = req.params.postId;
  const password = req.body.password;

  // # 400 body 또는 params를 입력받지 못한 경우
  if (isValidObjectId(postsId) || !postsId || !password) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  } else {
    const existsPosts = await Post.findOne({
      postId: postsId,
    });
    // # 404 _postId에 해당하는 게시글이 존재하지 않을 경우
    if (!existsPosts) {
      res.status(400).json({ message: "존재하지 않는 게시글입니다" });
    }
    if (existsPosts.password === password) {
      await Post.deleteOne({ postId: postsId });
      res.json({ message: "게시글을 삭제하였습니다" });
    } else {
      res.status(400).json({ message: "비밀 번호가 일치하지 않습니다" });
    }
  }
});

// 게시글에 코멘트 추가하기
router.post("/comments/:postId/", async (req, res) => {
  const postsId = req.params.postId;
  const { user, password, content } = req.body;
  // 현재 날짜 저장
  let today = new Date();

  let year = today.getFullYear();
  let month = ("0" + (today.getMonth() + 1)).slice(-2);
  let day = ("0" + today.getDate()).slice(-2);

  let hours = ("0" + today.getHours()).slice(-2);
  let minutes = ("0" + today.getMinutes()).slice(-2);
  let seconds = ("0" + today.getSeconds()).slice(-2);

  let date = year + "-" + month + "-" + day;
  let time = hours + ":" + minutes + ":" + seconds;

  // 년 월 일 시간
  let dateTime = date + " " + time;
  const createdAt = dateTime;

  const existsPosts = await Post.findOne({ postId: postsId });

  // # 400 body 또는 params를 입력받지 못한 경우
  if (isValidObjectId(postsId) || !postsId || !user || !password) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
    // # 400 body의 content를 입력받지 못한 경우
  } else if (!content) {
    res.status(400).json({ message: "댓글 내용을 입력해주세요" });
    // 존재하지 않는 게시글일 경우
  } else if (!existsPosts) {
    res.status(400).json({ message: "존재하지 않는 게시글입니다" });
  } else {
    const postId = existsPosts.postId;
    const createdComment = await Comment.create({
      postId,
      user,
      password,
      content,
      createdAt,
    });
    res.json({ comments: createdComment });
  }
});

// 댓글 목록 조회
router.get("/comments/:postId", async (req, res) => {
  const postsId = req.params.postId;
  // 날짜 내림차순 정렬
  const comments = await Comment.find({ postId: postsId }).sort({
    createdAt: -1,
  });

  // # 400 body 또는 params를 입력받지 못한 경우
  if (isValidObjectId(postsId) || !postsId) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  } else {
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
  }
});

// 댓글 수정
router.put("/comments/:commentId/", async (req, res) => {
  const commentId = req.params.commentId;
  const { password, content } = req.body;

  // # 400 body의 content를 입력받지 못한 경우
  if (!isValidObjectId(commentId) || !commentId) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  } else if (!content) {
    res.status(400).json({ message: "댓글 내용을 입력해주세요" });
  } else {
    // # 400 body 또는 params를 입력받지 못한 경우
    const existsComments = await Comment.findOne({ _id: commentId });
    // # 404 _commentId에 해당하는 댓글이 존재하지 않을 경우
    if (!existsComments) {
      res.status(400).json({ message: "댓글 조회에 실패하였습니다" });
    } else {
      if (existsComments.password === password) {
        await Comment.updateOne(
          { _id: commentId, password },
          {
            $set: {
              content: content,
            },
          }
        );
        res.status(200).json({ message: "댓글을 수정하였습니다." });
      } else {
        res.status(400).json({ message: "비밀번호가 틀렸습니다" });
      }
    }
  }
});

// 게시글 삭제
router.delete("/comments/:commentId/", async (req, res) => {
  const commentId = req.params.commentId;
  const password = req.body.password;

  // # 400 body 또는 params를 입력받지 못한 경우
  if (!isValidObjectId(commentId) || !commentId || !password) {
    res.status(400).json({ message: "데이터 형식이 올바르지 않습니다" });
  } else {
    const existsComments = await Comment.findOne({ _id: commentId });
    // 댓글이 존재하지 않는 경우
    if (!existsComments) {
      res.status(400).json({ message: "댓글 조회에 실패하였습니다" });
    } else {
      if (existsComments.password === password) {
        await Comment.deleteOne({ _id: commentId, password });
        res.status(200).json({ message: "댓글을 삭제하였습니다." });
      } else {
        res.status(400).json({ message: "비밀번호가 틀렸습니다" });
      }
    }
  }
});

module.exports = router;
