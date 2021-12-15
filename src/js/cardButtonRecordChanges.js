var t = window.TrelloPowerUp.iframe();

let changingTimes = 0;
onRecordBtnClick = function (){
    console.log("clickRecord =====" + changingTimes);
    t.get('board','shared','changeTime').then(function (board) {
        console.log(JSON.stringify(board,null,2));
    });
    t.get('board','shared').then(function (boardAll) {
        console.log(JSON.stringify(boardAll,null,2));
    });
    changingTimes = changingTimes + 1;
    t.set('board','shared',{"changeTime":changingTimes}).then(function (savedTimes){
        console.log(JSON.stringify(savedTimes,null,2))
    })
}

onSaveBtnClick = function (){
    console.log("onSaveBtnClick")
}
