import {getBoardButton} from "./getBoardButton";

console.log('Hello World!');
let requirementChangeCount;

const onBtnClick = function (t) {
    return t.popup({
        title: 'Requirement Changes',
        url: './cardButtonRecordChanges.html'
    });
};

const cardButtons = function () {
    return [{
        text: 'Demand Changes',
        icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Emoji_u1f601.svg/2048px-Emoji_u1f601.svg.png',
        callback: onBtnClick,
        condition: 'edit'
    }, {
        text: 'Open',
        condition: 'always',
        target: 'Trello Developer Site'
    }];
}

window.TrelloPowerUp.initialize(
    {
        'board-buttons': getBoardButton,
        'card-badges': function () {
            return [
                {
                    dynamic: function () {
                        return {
                            text: "Dynamic" + (Math.random() * 100).toFixed(0).toString(),
                            color: "green",
                            refresh: 10,
                        };
                    },
                },
                {
                    text: "Static",
                    color: null,
                }];
        },
        'card-buttons': cardButtons,
        "card-detail-badges": function (t) {
            return t.get(t.getContext().card, 'shared', 'requirementChangeCount')
                .then(res => {
                    console.log('requirementChangeCount in res: ', res);
                    requirementChangeCount = res ? res : 0;
                    return [
                        {
                            title: "Requirement Changes",
                            text: requirementChangeCount,
                            color: 'red',
                        },
                    ];
                })
        },
    }
);
