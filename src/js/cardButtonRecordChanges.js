const t = window.TrelloPowerUp.iframe();

const context = t.getContext();
console.log("context=",context);
let requirementChangeCount;
t.get(context.card, 'shared', 'requirementChangeCount', 0).then(requirementChangeCountInResponse => {
    requirementChangeCount = requirementChangeCountInResponse;
    showRequirementChangeCount(`total changes: ${requirementChangeCount}`);
});
t.cards("all").then(function (cards) {
    console.log('t.cards(\'all\') res: ', JSON.stringify(cards, null, 2));
});


onRecordBtnClick = () => {
    requirementChangeCount = requirementChangeCount + 1;
    console.log("requirementChangeCount is increased, now its value is: ", requirementChangeCount);
    showRequirementChangeCount(`total changes: ${requirementChangeCount}`);
}

onSaveBtnClick = () => {
    t.set(context.card, 'shared', {requirementChangeCount});
    console.log("requirementChangeCount is saved!");
    showRequirementChangeCount(`total changes: ${requirementChangeCount} (save successfully!)`);
}

showRequirementChangeCount = requirementChangeCount => {
    let element = document.getElementById("requirementChangeCount");
    element.innerHTML = requirementChangeCount;
}
