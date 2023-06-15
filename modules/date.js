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

// 내보내기
let datetime = date + " " + time;

module.exports = datetime;
