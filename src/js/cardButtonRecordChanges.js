const t = window.TrelloPowerUp.iframe();
const context = t.getContext();
console.log("context=",context);
let demandChangeCount;
t.get(context.card, 'shared', 'demandChangeCount').then(demandChangeCountInResponse => {
    demandChangeCount = demandChangeCountInResponse ? demandChangeCountInResponse : 0;
    showDemandChangeCount(`total changes: ${demandChangeCount}`);
});
t.cards("all").then(function (cards) {
    console.log('t.cards(\'all\') res: ', JSON.stringify(cards, null, 2));
});


onRecordBtnClick = () => {
    demandChangeCount = demandChangeCount + 1;
    console.log("demandChangeCount is increased, now its value is: ", demandChangeCount);
    showDemandChangeCount(`total changes: ${demandChangeCount}`);
}

onSaveBtnClick = () => {
    t.set(context.card, 'shared', {demandChangeCount});
    console.log("demandChangeCount is saved!");
    showDemandChangeCount(`total changes: ${demandChangeCount} (save successfully!)`);
}

showDemandChangeCount = demandChangeCount => {
    let element = document.getElementById("demandChangeCount");
    element.innerHTML = demandChangeCount;
}