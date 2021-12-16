export function getBoardButton (t, opts) {
    return [{
        text:'Requirement Changes',
        condition:'always',
        callback:function(t, opt){
            t.modal({
                title:'Requirement Changes Analysis',
                fullscreen:true,
            })
        }
    }];
}