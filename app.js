const express = require("express");
// 쿠키파서 가져오기
const cookieParser = require("cookie-parser");

const app = express();
const port = 3000;

// 라우터 연결
// 게시글 댓글 라우터
const postsRouter = require("./routes/posts");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

// 스키마 불러오기 index.js
const connect = require("./schemas");
connect();

// post로 들어오는 body데이터를 사용하기 위한 미들웨어
// 밑의 /api 설정 전에 사용
app.use(express.json());

// 쿠키파서 미들웨어로 등록
app.use(cookieParser());

// /api -> 라우터
app.use("/api", [postsRouter, usersRouter, authRouter]);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
