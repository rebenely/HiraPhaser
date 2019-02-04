class BootScene extends Phaser.Scene {

    constructor () {
        super('BootScene');
    }

    preload () {
        /* Preload dungeon icons, level icons, player sprite */
        this.loading = new HiraText(this, 720/2, 480/2, "Loading", "header");
        this.add.existing(this.loading);


        this.load.image('cave', 'assets/images/globals/dungeon.png');
        this.load.image('clouds', 'assets/images/globals/clouds.png');
        this.load.image('level', 'assets/images/globals/level.png');
        this.load.image('learn', 'assets/images/globals/learn.png');
        this.load.image('train', 'assets/images/globals/train.png');
        this.load.image('practice', 'assets/images/globals/practice.png');
        this.load.image('message', 'assets/images/globals/inn.png');
        this.load.image('shadow', 'assets/images/globals/shadow.png');


        this.load.image('world_map', 'assets/images/globals/world_redux.png');
        this.load.image('heart', 'assets/images/globals/heart.png');

        this.load.spritesheet('player', 'assets/spritesheets/player/bleu_idle.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('player_attack', 'assets/spritesheets/player/bleu_attack.png', { frameWidth: 64, frameHeight: 64 });
        // this.load.spritesheet('player_hurt', 'assets/spritesheets/player/player_hurt.png', { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('kidlatslash', 'assets/spritesheets/effects/kidlatslash.png',  { frameWidth: 32, frameHeight: 32 });


        this.load.bitmapFont('hira', 'assets/font/font.png', 'assets/font/font.fnt');
        this.load.bitmapFont('mnspc', 'assets/font/mnspc.png', 'assets/font/mnspc.fnt');



        this.load.on('progress', this.onLoadProgress, this);
        this.load.on('complete', this.onLoadComplete, this);

        this.load.json('main_world', 'assets/config/main_world.json');
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
    }
    create () {
        this.worldJson = this.cache.json.get('main_world');
        this.player = new Unit(this, 120, 320, "TestBoi", 5, 1);
        console.log(this.worldJson);
        console.log(game.global.UI_TEXT_HIGHLIGHT);
        if(this.worldJson) {
            this.loaded = true;
        }
    }
    update () {

        if(game.loaded){
            this.scene.start("MainScene", {player: this.player, world: this.worldJson});
        }
    }
}
