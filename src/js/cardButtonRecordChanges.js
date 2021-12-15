var t = window.TrelloPowerUp.iframe();

onRecordBtnClick = function () {
    var changingTimes = t.get('card', 'shared', 'changeTime').then(function (result) {
        console.log(JSON.stringify(result));
        console.log(result);
        result.then(res => console.log(JSON.stringify(res)));
    });
    // if (changingTimes) {
    //     changingTimes.then(function (recordTime) {
    //         recordTime = recordTime;
    //         console.log(JSON.stringify(recordTime, null, 2));
    //         t.set('card', 'shared', {"changeTime": recordTime});
    //     })
    // } else {
    //     changingTimes = 0;
    //     console.log(changingTimes);
    //     t.set('card', 'shared', {"changeTime": changingTimes});
    // }
}

onSaveBtnClick = function () {
    console.log("onSaveBtnClick")
}
