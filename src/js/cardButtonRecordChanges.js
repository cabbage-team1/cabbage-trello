var t = window.TrelloPowerUp.iframe();

onRecordBtnClick = function () {
    var changingTimes = t.get('card', 'shared', 'changeTime');
    if (changingTimes) {
        changingTimes.then(function (board) {
            changingTimes = changingTimes + 1;
            console.log(JSON.stringify(board, null, 2));
            t.set('card', 'shared', {"changeTime": changingTimes}).then(function (savedTimes) {
                console.log(JSON.stringify(savedTimes, null, 2))
            })
        })
    } else {
        changingTimes = 0;
        t.set('card', 'shared', {"changeTime": changingTimes}).then(function (savedTimes) {
            console.log(JSON.stringify(savedTimes, null, 2))
        })
    }
}

onSaveBtnClick = function () {
    console.log("onSaveBtnClick")
}
