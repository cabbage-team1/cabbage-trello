const t = window.TrelloPowerUp.iframe();

const context = t.getContext();
const REQUIREMENT_CHANGE_TEXT = `Total Changes: ${requirementChangeCount}`;
let requirementChangeCount;
t.get(context.card, 'shared', 'requirementChangeCount', 0).then(requirementChangeCountInResponse => {
    requirementChangeCount = requirementChangeCountInResponse;
    showRequirementChangeCount(REQUIREMENT_CHANGE_TEXT);
});

onRecordBtnClick = () => {
    requirementChangeCount = requirementChangeCount + 1;
    showRequirementChangeCount(REQUIREMENT_CHANGE_TEXT);
}

onSaveBtnClick = () => {
    t.set(context.card, 'shared', {requirementChangeCount})
        .then(() => {
                showRequirementChangeCount(REQUIREMENT_CHANGE_TEXT + '(save successfully!)');
            },
            () => {
                showRequirementChangeCount(REQUIREMENT_CHANGE_TEXT + '(failed to save!)');
            });
}

showRequirementChangeCount = requirementChangeCount => {
    let element = document.getElementById('requirementChangeCount');
    element.innerHTML = requirementChangeCount;
}
