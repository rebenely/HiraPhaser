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
    scene: [ BootScene, MainScene, BattleScene, ResultScene, DetailScene, DungeonScene, CutScene, CutLoaderScene, TrainScene, MultipleChoiceScene, MatchingTypeScene, HintScene, DialogBoxScene, WorldNavScene, MessageScene ]
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
