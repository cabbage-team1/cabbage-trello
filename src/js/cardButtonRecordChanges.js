var t = window.TrelloPowerUp.iframe();

onRecordBtnClick = function () {
    var changingTimes = t.get('card', 'shared', 'changeTime');
    if (changingTimes) {
        changingTimes.then(function (recordTime) {
            recordTime = recordTime + 1;
            console.log(JSON.stringify(recordTime, null, 2));
            t.set('card', 'shared', {"changeTime": recordTime});
        })
    } else {
        changingTimes = 0;
        t.set('card', 'shared', {"changeTime": changingTimes});
    }
}

onSaveBtnClick = function () {
    console.log("onSaveBtnClick")
}
