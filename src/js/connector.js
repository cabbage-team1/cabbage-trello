import {getBoardButton} from "./getBoardButton";

console.log('Hello World!');
let requirementChangeCount;

const onCardBtnClick = function (t) {
    return t.popup({
        title: 'Requirement Change',
        url: './cardButtonRecordChanges.html'
    });
};

let inDevListId;
const getCardButtons = function (t) {
    const context = t.getContext();
    t.lists('id', 'name').then(function (lists) {
        lists.forEach(function (list) {
            if (list.name === 'IN DEV') {
                inDevListId = list.id;
            }
        });
        if (context.list === inDevListId) {
            t.get(context.card, 'shared', 'originalDesc', '').then(function (res) {
                console.log('res === \'\': ', res === '');
                if(res === ''){
                    t.set(context.card, 'shared', {
                        originalDesc: t.card('desc').get('desc'),
                    }).then(function () {
                        t.get(context.card, 'shared', 'originalDesc').then(res => console.log('t.get desc after set', res))
                    })
                }
            });
        }
    })
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
