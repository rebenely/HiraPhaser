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
        this.load.spritesheet('player_attack', 'assets/spritesheets/punchrightmini.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player_hurt', 'assets/spritesheets/player_hurt.png', { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('kidlatslash', 'assets/spritesheets/kidlatslash.png',  { frameWidth: 32, frameHeight: 32 });



        this.player = new Unit(this, 120, 320, "TestBoi", 5, 1);

        this.load.bitmapFont('hira', 'assets/font/font.png', 'assets/font/font.fnt');




        this.load.on('progress', this.onLoadProgress, this);
        this.load.on('complete', this.onLoadComplete, this);
    }

    onLoadProgress(progress) {
        console.debug(`${Math.round(progress * 100)}%`);
    }
    onLoadComplete(loader, totalComplete, totalFailed) {
        // IMPORTANT: Here we utilize the webfonts loader script we loaded above.
        // NOTE: I played around with calling this in different places and settled
        // on this one currently. Feel free to play around with where it is called.
        // just make sure that you do not call it before it is done loading and also
        // make sure not to proceed to a scene that needs the font before it renders.

        console.debug('completed: ', totalComplete);
        console.debug('failed: ', totalFailed);
        this.loaded = true;
    }

    update () {
        console.log(this.loaded);
        if(this.loaded){
            this.scene.start("MainScene", {player: this.player});
        }
    }
}
