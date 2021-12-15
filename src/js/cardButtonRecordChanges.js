var t = window.TrelloPowerUp.iframe();


let changingTimes = 0;
onRecordBtnClick = function (){
    console.log("clickRecord =====" + changingTimes);
    t.get('board','shared','changeTime').then(function (board) {
        console.log("board ==== " + board);
    });
    t.get('board','shared').then(function (boardAll) {
        console.log("boardAll ==== " + boardAll);
    });
    changingTimes = changingTimes + 1;
}

onSaveBtnClick = function (){
    console.log("onSaveBtnClick")
}
