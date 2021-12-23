import {getBoardButton} from "./getBoardButton";

console.log('Hello World!');
let requirementChangeCount;

const onCardBtnClick = function (t) {
    return t.popup({
        title: 'Requirement Change',
        url: './cardButtonRecordChanges.html'
    });
};

const getCardButtons = function () {
    return [{
        text: 'Requirement Change',
        icon: 'https://uxwing.com/wp-content/themes/uxwing/download/19-e-commerce-currency-shopping/change-exchange.png',
        callback: onCardBtnClick,
        condition: 'always',
    }];
}

const getCardBadges = function (t) {
        return t.get(t.getContext().card, 'shared', 'requirementChangeCount').then(res => {
            if (res) {
                return [{
                    icon: 'https://uxwing.com/wp-content/themes/uxwing/download/19-e-commerce-currency-shopping/change-exchange.png',
                    color: 'red'
                }]
            }
        })
}

const getCardDetailBadges = function (t) {
        return t.get(t.getContext().card, 'shared', 'requirementChangeCount')
            .then(res => {
                console.log('requirementChangeCount in res: ', res);
                requirementChangeCount = res ? res : 0;
                if (requirementChangeCount !== 0) {
                    return [
                        {
                            title: "Changes",
                            text: requirementChangeCount,
                            color: 'red',
                        },
                    ];
                }
            })
}

window.TrelloPowerUp.initialize(
    {
        'board-buttons': getBoardButton,
        'card-buttons': getCardButtons,
        'card-badges': getCardBadges,
        "card-detail-badges": getCardDetailBadges,
    }
);
