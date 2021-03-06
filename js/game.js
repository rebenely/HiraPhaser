var config = {
    type: Phaser.AUTO,
    parent: "content",
    width: 720,
    height: 480,
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [ BootScene, MainScene, BattleScene, ResultScene, DetailScene, DungeonScene, CutScene, CutLoaderScene, TrainScene, MultipleChoiceScene, MatchingTypeScene, HintScene, DialogBoxScene, WorldNavScene, MessageScene, JournalScene, LogScene, StatsScene, CutSceneV2, SchedulerScene ]
};

var game = new Phaser.Game(config);
game.global = {
    EASY: 0,
    NORMAL: 1,
    HARD: 2,
    UI_COLOR: 0xfbf5ef,
    UI_THICKNESS: 2,
    UI_ALPHA: 0.8,
    UI_FILL_A: 0x3978a8,
    UI_FILL_B: 0x8aebf1,
    UI_TEXT_FILL: "#fbf5ef",
    UI_TEXT_STROKE: "#272744",
    UI_TEXT_HIGHLIGHT: 0xf2d3ab,
    UI_TEXT_STROKE_HIGHLIGHT: "#f2d3ab",
    URL: window.location.origin + '/'
};
game.loaded = false;
game.story = 0;
game.player_name = '';
game.charset = [];
game.sched = [];
game.idle = 0;
game.token = '';
game.showOKB = false;
game.logged_out = false;
game.playing = false;
game.roundOff = function (numba) {
    return Math.round(numba*100 * 10)/10;
}
game.screenWipe = function (scene) {
    var blocks = scene.add.group({ key: 'black50', repeat: 191 });

   Phaser.Actions.GridAlign(blocks.getChildren(), {
       width: 16,
       cellWidth: 50,
       cellHeight: 50,
       x: 25,
       y: 25
   });

   var _this = scene;

   var i = 0;

   blocks.children.iterate(function (child) {
       child.setDepth(10);

       _this.tweens.add({
           targets: child,
           alpha: 0,
           ease: 'Power3',
           duration: 500,
           delay: 1 + (i * 1)
       });
       i++;
       //  Change the value 32 for different results
       if (i % 16 === 0) {

       }

   });
}
game.timestamp = function (){
    return moment().utc().utcOffset(8).format('MM/DD/YYYY, hh:mm:ss A');
}
game.distracted = 0;
game.outOfFocus = false;
var stamp = null;
game.events.on('blur',
    function() {
        if(game.loaded){
            game.outOfFocus = true;
            stamp = moment();
        }
    }
, game);
game.events.on('focus',
    function() {
        if(stamp !== null && game.loaded) {
            var end = moment();
            game.distracted += end.diff(stamp, 'seconds');
            game.outOfFocus = false;
        }
        console.log('distracted for', game.distracted," seconds.");
    }
, game);

var inactivityTime = function () {
    var time;
    window.onload = resetTimer;
    // DOM Events
    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;

    var counter;

    function computeIdle() {
        counter = window.setInterval(CheckIdleTime, 1000);
        //location.href = 'logout.html'
    }


    function CheckIdleTime() {
         if(game.loaded && !game.outOfFocus){
             game.idle++;
             console.log(game.idle);
         } else {
             console.log('go concentrate');
         }
    }

    function resetTimer() {
        clearTimeout(time);
        clearTimeout(counter);
        if(game.playing) {
            console.log('start 30 seconds countdown');
            time = setTimeout(computeIdle, 10000);
        } else {
            console.log('start 15 seconds countdown');
            time = setTimeout(computeIdle, 5000);
        }

        // 1000 milliseconds = 1 second
    }
};
game.isVowel = function (input) {
    switch(input) {
        case 'A':
        case 'I':
        case 'O':
        case 'U':
        case 'E':
        return true;
        break;
        default:
        return false;
        break;
    }
}

inactivityTime();
console.log(moment("3/31/2019, 8:40:14 PM", 'MM/DD/YYYY, hh:mm:ss a'))
