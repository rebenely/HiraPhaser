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
    scene: [ BootScene, MainScene, BattleScene, ResultScene, DetailScene, DungeonScene, CutScene, CutLoaderScene, TrainScene, MultipleChoiceScene, MatchingTypeScene, HintScene, DialogBoxScene, WorldNavScene, MessageScene, JournalScene, LogScene, StatsScene, CutSceneV2 ]
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
    URL: window.location.href
};
game.loaded = false;
game.story = 0;
game.player_name = '';
game.charset = [];
game.token = '';
game.showOKB = false;
game.logged_out = false;
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
