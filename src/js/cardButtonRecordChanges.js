import axios from 'axios';
const Diff = require('diff');
const t = window.TrelloPowerUp.iframe();

const context = t.getContext();
let requirementChangeCount;
let diffDescArray;

t.get(context.card, 'shared', 'requirementChangeCount', 0).then(requirementChangeCountInResponse => {
    requirementChangeCount = requirementChangeCountInResponse;
    showRequirementChangeCount(`Total Changes: ${requirementChangeCount}`);
});

let info = {
    cardId: '',
    descriptions: '',
    version: ''
}

const addBtnForVersionRecord = (list, versionRecord, curPage) => {
    versionRecord.remove();
    versionRecord = document.createElement("div");
    document.body.appendChild(versionRecord);
    versionRecord.id = "versionRecord";

    for (let i = list.data.length - 1 - curPage * 5; i >= list.data.length - curPage * 5 - 5 && i >= 0; i--) {
        if(list.data[i].version !== 'v0.0') {
            const button = document.createElement("button");
            button.textContent = list.data[i].version;
            button.addEventListener('click', function () {onVersionBtnCLick(button.textContent)});
            versionRecord.appendChild(button);
        }
    }

    if(list.data.length > 5 || curPage !== 0) {
        const prevPage = document.createElement("button");
        prevPage.textContent = "<";
        prevPage.onclick = function() {
            if(curPage > 0) {
                curPage = curPage - 1;
                addBtnForVersionRecord(list, versionRecord, curPage);
            }
        }
        versionRecord.appendChild(prevPage);

        const nextPage = document.createElement("button");
        nextPage.textContent = ">";
        nextPage.onclick = function() {
            if(curPage <= list.data.length / 5)
            {
                curPage = curPage + 1;
                addBtnForVersionRecord(list, versionRecord, curPage);
            }
        }
        versionRecord.appendChild(nextPage);
    }
}

function onVersionBtnCLick(text) {
    console.log("0.text: ", text);
    // const savedDateTime = getSavedDateTime();
    axios.get(`http://localhost:8086/description/${context.card}`).then(list => {
        console.log('length of list', list.data.length);

        const versionNum = parseInt(text.substring(1));
        const lastVersionNum = versionNum - 1;
        const lastVersionText = `v${lastVersionNum}.0`;
        console.log("2.lastVersionNum: ", lastVersionNum);
        console.log("3.lastVersionText: ", lastVersionText);

        let currentData;
        let oldData;
        list.data.forEach(item => {
            if (item.version === text) {
                currentData = item;
            }
            if (item.version === lastVersionText) {
                oldData = item;
            }
        });
        console.log("4.currentData: ", currentData);
        console.log("5.oldData: ", oldData);

        const diff = Diff.diffChars(oldData.descriptions, currentData.descriptions);
        console.log("6.versionDiff: ", diff);

        // t.set(context.card, 'shared', {
        //             savedTime: savedDateTime
        //         }).then(() => console.log('7.set diff version'));
        return t.modal({
            url: './versionComparisons.html',
            args: {text: diff},
            height: 500,
            fullscreen: false,
            title: 'Description Comparison'
        })
    });
}

const getVersionRecord = () => {
    axios.get(`http://localhost:8086/description/${context.card}`).then(list => {
        const versionRecord = document.getElementById("versionRecord");
        let curPage = 0;
        addBtnForVersionRecord(list, versionRecord, curPage);
    });
}
getVersionRecord();

window.onRecordBtnClick = function onRecordBtnClick() {
    requirementChangeCount = requirementChangeCount + 1;
    showRequirementChangeCount(`Total Changes: ${requirementChangeCount}`);
}

function getSavedDateTime() {
    const savedTime = Date.now();
    const now = new Date(savedTime);
    console.log('now.getDate: ', now.getDate());
    return 'yyyy/mm/dd'.replace('mm', now.getMonth() + 1)
        .replace('yyyy', now.getFullYear())
        .replace('dd', now.getDate());
}

window.onSaveBtnClick = function onSaveBtnClick() {
    //trello database 存储与original desc的diff ：86-105
    const Diff = require("diff");
    const savedDateTime = getSavedDateTime();
    console.log('after formatted savedDateTime: ', savedDateTime);
    let currentDesc;
    t.card('desc').get('desc').then(function (curDesc) {
        currentDesc = curDesc;
        console.log('let currentDesc: ', currentDesc);
    });
    t.get(context.card, 'shared', 'originalDesc').then(function (lastDesc) {
        diffDescArray = Diff.diffChars(lastDesc.fulfillmentValue, currentDesc);
        console.log('diff：', diffDescArray);
        t.set(context.card, 'shared', {
            diff: diffDescArray,
            savedTime: savedDateTime
        }).then(function () {
            t.get(context.card, 'shared', 'savedTime').then(res => console.log('savedTime: ', res))
        })
        t.get(context.card, 'shared', 'originalDesc')
            .then(res => console.log('previous desc: \n', res))
    })
    //
    t.set(context.card, 'shared', {requirementChangeCount})
        .then(() => {
                showRequirementChangeCount(`Total Changes: ${requirementChangeCount}` + '(save successfully!)');
            },
            () => {
                showRequirementChangeCount(`Total Changes: ${requirementChangeCount}` + '(failed to save!)');
            });

    t.card('id', 'desc').then(res => {
        console.log('id', res);
        info.cardId = res.id;
        info.descriptions = res.desc;
        info.version = `v${requirementChangeCount}.0`;
        axios.post("http://localhost:8086/description", info).then(res => {
            axios.get(`http://localhost:8086/description/${context.card}`).then(list => {
                console.log("save return list============", list.data.length)
                let versionRecord = document.getElementById("versionRecord");
                addBtnForVersionRecord(list, versionRecord, 0);
            });
        });
    });
}

const showRequirementChangeCount = requirementChangeCount => {
    let element = document.getElementById('requirementChangeCount');
    element.innerHTML = requirementChangeCount;
}

window.onDiffBtnClick = function () {
    console.log('new page');
    return t.modal({
        url: './lastDescDiff.html',
        height: 500,
        fullscreen: false,
        title: 'Description Comparison'
    })
}
