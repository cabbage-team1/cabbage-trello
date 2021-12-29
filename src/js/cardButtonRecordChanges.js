import axios from 'axios';

const Diff = require('diff');
const t = window.TrelloPowerUp.iframe();

const context = t.getContext();
let requirementChangeCount;

t.get(context.card, 'shared', 'requirementChangeCount', 0).then(requirementChangeCountInResponse => {
    requirementChangeCount = requirementChangeCountInResponse;
    showRequirementChangeCount(`Total Changes: ${requirementChangeCount}`);
});

let info = {
    cardId: '',
    descriptions: '',
    version: '',
}

const addBtnForVersionRecord = (list, versionRecord, curPage) => {
    versionRecord.remove();
    versionRecord = document.createElement("div");
    document.body.appendChild(versionRecord);
    versionRecord.id = "versionRecord";

    for (let i = list.data.length - 1 - curPage * 5; i >= list.data.length - curPage * 5 - 5 && i >= 0; i--) {
        if (list.data[i].version !== 'v0.0') {
            const button = document.createElement("button");
            button.textContent = list.data[i].version;
            button.addEventListener('click', function () {
                onVersionBtnCLick(button.textContent)
            });
            versionRecord.appendChild(button);
        }
    }

    if (list.data.length > 5 || curPage !== 0) {
        const prevPage = document.createElement("button");
        prevPage.textContent = "<";
        prevPage.onclick = function () {
            if (curPage > 0) {
                curPage = curPage - 1;
                addBtnForVersionRecord(list, versionRecord, curPage);
            }
        }
        versionRecord.appendChild(prevPage);

        const nextPage = document.createElement("button");
        nextPage.textContent = ">";
        nextPage.onclick = function () {
            if (curPage <= list.data.length / 5) {
                curPage = curPage + 1;
                addBtnForVersionRecord(list, versionRecord, curPage);
            }
        }
        versionRecord.appendChild(nextPage);
    }
}

function onVersionBtnCLick(text) {
    console.log("0.text: ", text);
    axios.get(`http://localhost:8086/description/${context.card}`).then(list => {
        console.log("进入.get方法")
        console.log('0.5.list:', list);
        const versionNum = parseInt(text.substring(1));
        const lastVersionNum = versionNum - 1;
        const lastVersionText = `v${lastVersionNum}.0`;
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
        console.log('1.currentData: ', currentData);
        console.log('1.5.currentData: ', currentData.descriptions);
        console.log('2.oldData: ', oldData);
        console.log('2.5.oldData: ', oldData.descriptions);

        const diff = Diff.diffChars(oldData.descriptions, currentData.descriptions);
        let savedTime = currentData.createdTime;
        console.log("currentData.createTime: -> ", savedTime);
        console.log("typeof currentData.createTime: -> ", typeof savedTime);

        return t.modal({
            url: './versionComparisons.html',
            args: {
                text: diff,
                savedTime: savedTime
            },
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


window.onSaveBtnClick = function onSaveBtnClick() {
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
            console.log("post return value: ", res)
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

