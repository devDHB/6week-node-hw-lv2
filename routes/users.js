const express = require("express");
const router = express.Router();

const User = require("../schemas/user");
const authMiddleware = require("../middlewars/auth-middleware");

// 내 정보 조회 API
router.get("/users/me", authMiddleware, async (req, res) => {
  const { nickname } = res.locals.user;

  res.status(200).json({
    user: { nickname },
  });
});

// 회원가입 API
router.post("/users", async (req, res) => {
  const { nickname, password, confirmPassword } = req.body;

  // 닉네임 정규식 검증
  const numCheck = /\d/;
  const lowerCheck = /[a-z]/;
  const upperCheck = /[A-Z]/;
  const nicknameNumReg = numCheck.test(nickname);
  const nicknameLowerReg = lowerCheck.test(nickname);
  const nicknameUpperReg = upperCheck.test(nickname);

  // 정규식 체크 (3글자이상, 숫자 , 영대소문자)
  if (
    nickname.length > 2 &&
    nicknameNumReg &&
    nicknameLowerReg &&
    nicknameUpperReg
  ) {
    // 비밀번호에 닉네임 값이 포함되었는지
    const passwordCheck = password.includes(nickname);
    // 비밀번호 4글자 이상, 닉네임이 포함되었는지 체크
    if (password.length > 3 && passwordCheck) {
      res.status(400).json({
        errorMessage:
          "패스워드는 4글자이상, 닉네임이 포함되지 않게 작성해주세요.",
      });
      return;
    }
    if (password !== confirmPassword) {
      res.status(400).json({
        errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
      });
      return;
    }

    // nickname이 동일한 데이터가 있는지 확인하기 위해 가져온다.
    const existsUsers = await User.findOne({
      // 닉네임이 일치할때, 조회함
      $or: [{ nickname }],
    });
    // 유저가 존재한다면
    if (existsUsers) {
      // 보안을 위해 에러 메세지는 자세하게 X
      res.status(400).json({
        errorMessage: "이미 사용중인 닉네임입니다.",
      });
      return;
    }

    // 데이터 베이스에 저장
    const user = new User({ nickname, password });
    await user.save();

    res.status(201).json({});
  } else {
    res
      .status(400)
      .send({ message: "3글자이상, 숫자, 영 대소문자로 적어주세요" });
  }
});

module.exports = router;
