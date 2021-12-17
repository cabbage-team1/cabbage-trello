export function getBoardButton(t, opts) {
    return [{
        text: 'Requirement Changes',
        condition: 'always',
        callback: function (t, opt) {
            t.popup({
                title: 'Requirement Changes Analysis',
                url: 'requirementChangeList.html',
                height: 278,
            })
        }
    }];
}
