import axios from 'axios';
const t = window.TrelloPowerUp.iframe();

const context = t.getContext();
let requirementChangeCount;
t.get(context.card, 'shared', 'requirementChangeCount',0).then(requirementChangeCountInResponse => {
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
        const button = document.createElement("button");
        button.textContent = list.data[i].version;
        button.addEventListener('click', function () {onVersionBtnCLick(button.textContent)});
        versionRecord.appendChild(button);
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
    console.log('text', text);
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

            const btnList = document.getElementsByTagName("button");
            let versionBtnList = [];
            for (let i = 0; i < btnList.length; i++) {
                if(btnList[i].textContent.substr(0, 1) === "v") {
                    versionBtnList.push(btnList[i]);
                }
            }

            if(versionBtnList.length < 5) {
                axios.get(`http://localhost:8086/description/${context.card}`).then(list => {
                    let versionRecord = document.getElementById("versionRecord");
                    addBtnForVersionRecord(list, versionRecord);
                });
            }
            else {
                axios.get(`http://localhost:8086/description/${context.card}`).then(list => {

                    for (let i = list.data.length - 1, j = 0; i >= list.data.length - 5, j < 5; i--, j++) {
                        versionBtnList[j].textContent = list.data[i].version;
                    }
                });
            }
        });
    });
}

const showRequirementChangeCount = requirementChangeCount => {
    let element = document.getElementById('requirementChangeCount');
    element.innerHTML = requirementChangeCount;
}
