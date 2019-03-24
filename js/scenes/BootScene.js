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
        this.load.image('black50', 'assets/images/globals/black50.png');


        this.load.image('world_map', 'assets/images/globals/world_redux.png');
        this.load.image('heart', 'assets/images/globals/heart.png');

        this.load.spritesheet('player', 'assets/spritesheets/player/bleu_idle.png', { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet('player_attack', 'assets/spritesheets/player/bleu_attack.png', { frameWidth: 64, frameHeight: 64 });
        // this.load.spritesheet('player_hurt', 'assets/spritesheets/player/player_hurt.png', { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('kidlatslash', 'assets/spritesheets/effects/kidlatslash.png',  { frameWidth: 32, frameHeight: 32 });


        this.load.bitmapFont('hira', 'assets/font/bmpfont/jackey.png', 'assets/font/bmpfont/jackey.fnt');
        this.load.bitmapFont('onscreen', 'assets/font/bmpfont/keyboard.png', 'assets/font/bmpfont/keyboard.fnt');



        /* load sfx */
        this.load.audio('hover', ['assets/sounds/sfx/sfx_coin_double1.wav']);
        this.load.audio('click', ['assets/sounds/sfx/sfx_coin_double3.wav']);
        this.load.audio('zawarudo', ['assets/sounds/sfx/sfx_exp_odd5.wav']);
        this.load.audio('disabled', ['assets/sounds/sfx/sfx_sounds_error7.wav']);
        this.load.audio('shake', ['assets/sounds/sfx/sfx_sounds_impact6.wav']);
        this.load.audio('ugh', ['assets/sounds/sfx/sfx_deathscream_human2.wav']);
        this.load.audio('punch', ['assets/sounds/sfx/sfx_wpn_punch3.wav']);
        this.load.audio('minus', ['assets/sounds/sfx/sfx_sounds_damage3.wav']);
        this.load.audio('unga', ['assets/sounds/sfx/sfx_deathscream_alien3.wav']);
        this.load.audio('flicker', ['assets/sounds/sfx/sfx_sounds_damage3.wav']);
        this.load.audio('slash', ['assets/sounds/sfx/sfx_exp_short_hard13.wav']);
        this.load.audio('type', ['assets/sounds/sfx/sfx_menu_move4.wav']);
        this.load.audio('delete', ['assets/sounds/sfx/sfx_menu_move3.wav']);
        this.load.audio('next', ['assets/sounds/sfx/sfx_menu_move3.wav']);
        this.load.audio('success', ['assets/sounds/sfx/sfx_sounds_fanfare3.wav']);
        this.load.audio('start', ['assets/sounds/sfx/sfx_sounds_fanfare2.wav']);
        this.load.audio('fail', ['assets/sounds/sfx/sfx_sounds_impact10.wav']);
        this.load.audio('show', ['assets/sounds/sfx/sfx_sounds_fanfare1.wav']);
        this.load.audio('enemy_death', ['assets/sounds/sfx/sfx_deathscream_alien5.wav']);
        this.load.audio('player_death', ['assets/sounds/sfx/sfx_deathscream_human14.wav']);

        this.sound.pauseOnBlur = false;

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
        this.sound.volume = 0.05;

        this.loaded = false;
        this.worldJson = this.cache.json.get('main_world');
        // console.log(this.worldJson);
        // console.log(game.global.UI_TEXT_HIGHLIGHT);
        this.announcement = {};
        $.ajax({
            url: game.global.URL + "hello",
            type: "GET",
            async: true,
            context: this,
            success: function (responseData) {

                this.announcement = {
                    title: responseData['title'],
                    body: responseData['body']
                }
                this.loaded = true;
                // console.log('ayy lmaoooo', responseData);
            },
            error: function (xhr) {
                this.announcement = {
                    title: "Uh oh",
                    body: "Unable to read from server"
                }
            }
        });
    }
    update () {
        if(game.loaded && this.loaded){
            this.player = new Unit(this, 120, 320, game.player_name, 5, 1);
            this.player.level = this.player.story = game.story;
            for(let i = 0; i < game.charset.length; i++ ){
                for(let j = 0; j < game.charset[i].length; j++) {
                    this.player.characterPool.push(game.charset[i][j]);
                }
            }
            this.player.schedule = game.sched;
            // console.log(this.player.characterPool, game.charset);
            this.resize();
            console.log(this.player);
            this.scene.start("MainScene", {player: this.player, world: this.worldJson, announcement: this.announcement});
        }
    }

    resize() {
        var canvas = game.canvas, width = window.innerWidth - 10, height = window.innerHeight - 10;
        if(width > 720) {
            width = 720;
        }
        if(height > 480) {
            height = 480;
        }
        var wratio = width / height, ratio = canvas.width / canvas.height;

        if (wratio < ratio) {
            canvas.style.width = width + "px";
            canvas.style.height = (width / ratio) + "px";
        } else {
            canvas.style.width = (height * ratio) + "px";
            canvas.style.height = height + "px";
        }
    }
}
