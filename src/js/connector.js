console.log('Hello World!');

let changingTimes = 0;
const onSaveBtnClicked = function (t, opts) {
  changingTimes = changingTimes + 1;
}

const onBtnClick = function(t, opts) {
  console.log('Someone clicked the button');
  return t.popup({
    title: 'Demand Change',
    url: './cardButtonRecordChanges.html'
  });
};

const cardButtons = function(t, opts) {
  return [{
    text: 'Demand Changes',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Emoji_u1f601.svg/2048px-Emoji_u1f601.svg.png',
    callback: onBtnClick,
    condition: 'edit'
  }, {
    text: 'Open',
    condition: 'always',
    target: 'Trello Developer Site'
  }];
}

window.TrelloPowerUp.initialize(
  {
    'board-buttons':function (t, opts) {
      return [{
        text:'Requirement Changes',
        callback:t.modal({
          title:'Requirement Changes Analysis',
          fullscreen:true,
        })
      }];
    },
    'card-badges': function(t, opts) {
      t.get();
      let cardAttachments = t.card('attachments');
      // let cardAttachments = opts.attachments;
      return t.card("name")
        .get("name")
        .then(function(cardName) {
        console.log('card name  ' + cardName);
        return [
          {
          dynamic: function() {
            return {
              text: "Dynamic" + (Math.random() * 100).toFixed(0).toString(),
              color: "green",
              refresh: 10,
            };
          },
        },
          {
            text: "Static",
            color: null,
          }];
      });
    },
    'card-buttons': cardButtons,
    'card-detail-badges': function (t, opts) {
      return t.card('name')
          .get('name')
          .then(function (cardName) {
            return [{
              dynamic: function () {
                return {
                  title: 'Changes',
                  text: changingTimes.toString(),
                  color: 'red',
                  refresh: 10
                };
              },
            }]
          })
    },
  }
);
