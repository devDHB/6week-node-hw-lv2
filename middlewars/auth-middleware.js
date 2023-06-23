const jwt = require("jsonwebtoken");
const User = require("../schemas/user");

// 사용자 인증 미들웨어
module.exports = async (req, res, next) => {
  // 등록한 쿠키를 받아옴
  const { Authorization } = req.cookies;
  // Authorization 쿠키가 존재하지 않았을때(undefined일때)
  // 빈문자열로 줄거고 split 메소드를 쓰더라도 에러가 나지않게
  // ?? 는 null 병합 문자열이라고 해서
  // 왼쪽에 있는 값이 비었으면 오른쪽 값으로 대체하는 것
  // 스플릿을 쓰는 이유는
  // Bearer qwer.qwerqwer.qweqwr 이 Bearer 토큰을
  // 앞에있는 Bearer 과 뒤의 JWT 토큰을 분리해주기 위해 사용하는거
  // 왼쪽에 있는 값을 authtype, 우측값을 authtoken 에 할당
  const [authType, authToken] = (Authorization ?? "").split(" ");

  // 위에서 할당한 authtpye === Bearer 값인지 확인
  // authtoken 검증 (JWT가 서버에서 안보내지게 되면 비었을수가 있음)
  if (authType !== "Bearer" || !authToken) {
    res.status(401).json({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }

  try {
    // authToken 이 만료되었는지 확인
    // authToken 이 서버가 발급한 토큰이 맞는지 검증
    // verify 메서드로 검증
    const { userId } = jwt.verify(authToken, "customized-secret-key");

    // authToken 에 있는 userId에 해당하는 사용자가 실제 DB에 존재하는지 확인
    const user = await User.findById(userId);

    // 미들 웨어 다음으로 보냄
    // 이렇게 담아준 값은 정상적으로 응답값을 보내고 나면 소멸함
    // 이 다음에 있는 게시글작성 같은 API를 호출하기
    // 위해서 호출했을때 어떤 사용자가 호출했는지 확인 가능함
    res.locals.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};
