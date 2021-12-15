var t = window.TrelloPowerUp.iframe();


let changingTimes = 0;
onRecordBtnClick = function (){
    console.log("clickRecord =====" + changingTimes);
    var board = t.get('board','shared','changeTime');
    var boardAll = t.get('board','shared');
    console.log("board ==== " + board);
    console.log("boardAll ==== " + boardAll);
    changingTimes = changingTimes + 1;
}

onSaveBtnClick = function (){
    console.log("onSaveBtnClick")
}
