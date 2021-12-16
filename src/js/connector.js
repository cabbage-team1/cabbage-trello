import {getBoardButton} from "./getBoardButton";

console.log('Hello World!');
let requirementChangeCount;

const onCardBtnClick = function (t) {
    return t.popup({
        title: 'Requirement Change',
        url: './cardButtonRecordChanges.html'
    });
};

const cardButtons = function () {
    return [{
        text: 'Requirement Change',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Emoji_u1f601.svg/2048px-Emoji_u1f601.svg.png',
        callback: onCardBtnClick,
        condition: 'always',
    }];
}

window.TrelloPowerUp.initialize(
    {
        'board-buttons': getBoardButton,
        'card-buttons': cardButtons,
        'card-badges': function(t) {
            return t.get(t.getContext().card, 'shared', 'demandChangeCount').then(res => {
                if(res) {
                    return [{
                        text: 'Changes',
                        color: 'red'
                    }]
                }
            })
        },
        "card-detail-badges": function (t) {
            return t.get(t.getContext().card, 'shared', 'requirementChangeCount')
                .then(res => {
                    console.log('requirementChangeCount in res: ', res);
                    requirementChangeCount = res ? res : 0;
                    return [
                        {
                            title: "Changes",
                            text: requirementChangeCount,
                            color: 'red',
                        },
                    ];
                })
        },
    }
);
