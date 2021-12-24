import {getBoardButton} from "./getBoardButton";
import axios from 'axios';
let info = {
    cardId: '',
    descriptions: '',
    version: ''
}
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
            if (list.name === '高效生产中') {
                inDevListId = list.id;
            }
        });
        if (context.list === inDevListId) {
            t.get(context.card, 'shared', 'originalDesc', '').then(function (res) {
                if(res === ''){
                    t.set(context.card, 'shared', {
                        originalDesc: t.card('desc').get('desc'),
                    });
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
