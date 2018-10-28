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
    scene: [ BootScene, MainScene, BattleScene, ResultScene, DetailScene, DungeonScene, CutScene, CutLoaderScene, TrainScene, MultipleChoiceScene, MatchingTypeScene, HintScene ]
};
var game = new Phaser.Game(config);
game.global = {
    EASY: 0,
    NORMAL: 1,
    HARD: 2
}
