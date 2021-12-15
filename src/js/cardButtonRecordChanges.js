var t = window.TrelloPowerUp.iframe();

onRecordBtnClick = function () {
    var context = t.getContext();
    console.log("JSON.stringify(context, null, 2)");
    console.log(JSON.stringify(context, null, 2));
    var stringify = JSON.stringify(context, null, 2);
    var cardId = stringify.card;
    t.get(cardId).then(res => console.log(JSON.stringify(res, null, 2)));

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
