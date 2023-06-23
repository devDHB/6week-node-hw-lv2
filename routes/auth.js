const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const User = require("../schemas/user");

// 로그인 API
router.post("/auth", async (req, res) => {
  const { nickname, password } = req.body;

  // nickname 이 일치하는 유저 찾기
  const user = await User.findOne({ nickname });

  // 1. 닉네임이 일치하는 유저가 존재하지 않거나
  // 2. 유저의 비밀번호와 입력한 비밀번호가 다를때
  if (!user || password !== user.password) {
    res.status(400).json({
      // NOTE: 인증 메세지는 자세히 설명하지 않는것을 원칙으로 한다.
      errorMessage: "입력한 닉네임의 유저가 없거나, 패스워드가 틀렸습니다.",
    });
    return;
  }

  // JWT 생성하기
  const token = jwt.sign({ userId: user.userId }, "customized-secret-key");

  // JWT를 Cookie로 할당 (Bearer타입으로)
  res.cookie("Authorization", `Bearer ${token}`);
  // JWT를 Body로 할당
  res.status(200).json({ token });
});

module.exports = router;
