class BootScene extends Phaser.Scene {

    constructor () {
        super('BootScene');
    }

    preload () {
        // load resources
        this.load.image('cave', 'assets/images/cave.png');
        this.load.image('level', 'assets/images/level.png');

        this.load.image('grassland', 'assets/images/grass.png');

        this.load.image('heart', 'assets/images/heart.png');

        this.load.spritesheet('player', 'assets/spritesheets/miniIdle.png', { frameWidth: 32, frameHeight: 32 });

        this.player = new Unit(this, 120, 320, "TestBoi", 5, 1);

        this.load.bitmapFont('hira', 'assets/font/font.png', 'assets/font/font.fnt');

    }

    create () {
        this.scene.start("MainScene", {player: this.player});
    }
}
