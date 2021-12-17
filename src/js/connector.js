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
        icon: 'https://uxwing.com/wp-content/themes/uxwing/download/19-e-commerce-currency-shopping/change-exchange.png',
        callback: onCardBtnClick,
        condition: 'always',
    }];
}

window.TrelloPowerUp.initialize(
    {
        'board-buttons': getBoardButton,
        'card-buttons': cardButtons,
        'card-badges': function(t) {
            return t.get(t.getContext().card, 'shared', 'requirementChangeCount').then(res => {
                if(res) {
                    return [{
                        icon:'https://uxwing.com/wp-content/themes/uxwing/download/19-e-commerce-currency-shopping/change-exchange.png',
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
                    if(requirementChangeCount !== 0) {
                        return [
                            {
                                title: "Changes",
                                text: requirementChangeCount,
                                color: 'red',
                            },
                        ];
                    }
                })
        },
    }
);
