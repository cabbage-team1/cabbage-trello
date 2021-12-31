import axios from "axios";
const t = window.TrelloPowerUp.iframe();
const Diff = require('diff');

window.onVersionBoardBtnCLick = function onVersionBoardBtnCLick(text,cardId) {
    axios.get(`http://localhost:8086/description/${cardId}`).then(list => {
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

        const diff = Diff.diffChars(oldData.descriptions, currentData.descriptions);
        let savedTime = currentData.createdTime;

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
