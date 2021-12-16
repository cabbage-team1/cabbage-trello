export function getBoardButton (t, opts) {
    return [{
        text:'Requirement Changes',
        condition:'always',
        callback:t.modal({
            title:'Requirement Changes Analysis',
            fullscreen:true,
        })
    }];
}