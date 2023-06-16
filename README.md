# node.js를 사용해 백엔드 서버 구현하기
node.js, express, mongoDB를 활용하여 로그인 기능이 없는 백엔드 서버를 만들어보기

## 기능
1. 게시글 작성, 조회, 수정, 삭제
2. 게시글에 댓글 작성, 조회, 수정, 삭제

## API , 모듈
post.js
게시글 작성, 조회, 수정, 삭제
댓글 작성, 조회, 수정, 삭제

date.js
오늘 날짜, 현재 시각 스트링 변환

## DataBase
postCount.js
게시글 db정의

comment.js
댓글 db정의

postCount.js
게시글의 postId 값에 할당할 db정의

## 미흡한 점
1. 발제를 제대로 확인하지 않고 API 명세서만 보고 진행하여, CRUD만 구현
2. 에러 핸들링 미구현

## 느낀점
1. mongoDB 활용 하는데 어려움을 겪음
   => mongoDB에서 활용하는 함수들을 계속 공부하며 활용
2. async/await 문법에 대한 이해가 부족
   => 동기/비동기 처리, promise 문법에 대해 공부
