var BootScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

    function BootScene ()
    {
        Phaser.Scene.call(this, { key: "BootScene" });
    },

    preload: function ()
    {
        // load resources
        this.load.image('cave', 'assets/images/cave.png');
        this.load.image('grassland', 'assets/images/grass.png');

        this.load.image('hiraganaA', 'assets/images/hiragana_A.png');
        this.load.image('hiraganaI', 'assets/images/hiragana_I.png');
        this.load.image('hiraganaU', 'assets/images/hiragana_U.png');
        this.load.image('hiraganaE', 'assets/images/hiragana_E.png');
        this.load.image('hiraganaO', 'assets/images/hiragana_O.png');

        this.load.image('heart', 'assets/images/heart.png');

        this.load.spritesheet('player', 'assets/spritesheets/miniIdle.png', { frameWidth: 32, frameHeight: 32 });

        this.player = new Unit(this, 120, 320, "TestBoi", 5, 1);
    },

    create: function ()
    {
        this.scene.start("MainScene", {player: this.player});
    }
});
