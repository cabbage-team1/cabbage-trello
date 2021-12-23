export function getBoardButton(t, opts) {
    return [{
        icon: 'https://uxwing.com/wp-content/themes/uxwing/download/19-e-commerce-currency-shopping/change-exchange.png',
        text: 'Requirement Changes',
        condition: 'always',
        callback: function (t, opt) {
            t.modal({
                title: 'Requirement Change Analysis',
                url: './requirementChangeAnalysis.html',
                fullscreen: true,
            })
        }
    }];
}
