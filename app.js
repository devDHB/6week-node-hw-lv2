const express = require("express");
const app = express();
const port = 4000;

// 라우터 연결
const postsRouter = require("./routes/posts");
// const commentsRouter = require("./routes/comments");

// 스키마 불러오기 index.js
const connect = require("./schemas");
connect();

// post로 들어오는 body데이터를 사용하기 위한 미들웨어
// 밑의 /api 설정 전에 사용
app.use(express.json());

// /api -> 라우터
app.use("/api", postsRouter);
// commentsRouter

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
