class ResultScene extends Phaser.Scene {

    constructor () {
        super('ResultScene');
    }

    init (data) {
        this.enemy = data.enemy;
        this.player = data.player;
        this.cleared = data.cleared;
        this.success = data.success;
        this.flee = data.flee;
        this.progress = data.progress;
        this.dataCapture = data.dataCapture;
    }

    preload () {
        this.load.image('gameover', 'assets/images/gameover.png');
    }

    create () {
        this.scene.bringToTop();

        this.container = this.add.graphics();
        this.container.lineStyle(game.global.UI_THICKNESS, game.global.UI_COLOR, 1);

        this.container.fillGradientStyle(game.global.UI_FILL_A, game.global.UI_FILL_A, game.global.UI_FILL_B, game.global.UI_FILL_B, 1);
        this.container.fillRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);
        this.container.strokeRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);

        this.progressBox = this.add.graphics();
        this.progressBar = this.add.graphics();

        this.state = 0;

        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(2*720/3 - 64, 480/3 - 8, 128, 16);
        this.progressBar.fillStyle(0xffffff, 1);
        this.progressBar.fillRect(2*720/3 - 60, 480/3 - 4, this.player.exp/this.player.maxExp * 120, 8);


        var header = { font: "32px manaspc", fill: "#00ff44" };
        var style = { font: "16px manaspc", fill: "#00ff44" };

        var gob = this.add.sprite(720/2, 480/2, 'gameover'); gob.setOrigin(0.5); gob.setScale(0.8);
        gob.visible = false;


        this.message = new HiraText(this, 720/2, 480/5, 'xxx', "header");
        this.add.existing(this.message);



        if(this.success) {
            this.message.setText(this.player.name + ' was victorious!');
        } else  if (this.flee) {
            this.message.setText('You fled!');
        } else {
            this.message.setText('You lose!');
            this.message.setInteractive().on('pointerdown', function () {
                console.log('oy wtf');
                gob.visible = gob.visible ? false : true;
            }, this, gob);
        }


        this.expMultiplier = this.flee ? 0.5 : 1;

        this.enemyNames = [];
        this.enemyExp = [];
        for(var i = 0; i < this.enemy.length; i++){
            this.enemyNames.push(new HiraText(this, 720/3, 480/3 + 50*(i+1), this.enemy[i].name, "basic"));
            this.add.existing(this.enemyNames[i]);

            this.enemyExp.push(new HiraText(this, 2*720/3, 480/3 + 50*(i+1), this.enemy[i].exp, "basic"));
            this.add.existing(this.enemyExp[i]);

        }


        this.playerName = new HiraText(this, 720/3, 480/3, this.player.name,  "basic");
        this.add.existing(this.playerName);

        this.levelUpMessage = this.add.text(720/3 - 100, 480/3, 'level up!', style);
        this.levelUpMessage.setOrigin(0.5);
        this.levelUpMessage.visible = false;

        this.input.keyboard.on('keydown', this.typedKeys, this);

        this.player.hp = this.player.maxHp; /* restore player health */

    }

    typedKeys (e) {
        if (e.keyCode === 32 || e.keyCode === 13) {
            this.state++;
        }
    }

    update () {
        this.progressBar.clear();
        this.progressBar.fillStyle(0xffffff, 1);
        this.progressBar.fillRect(2*720/3 - 60, 480/3 - 4, this.player.exp/this.player.maxExp * 120, 8);

        if(this.state === 1 && (this.success || this.enemyNames.length > 0)) {
            for(var i = 0; i < this.enemyNames.length; i++) {
                if(this.enemy[i].exp > 0) {
                    this.player.exp += 1 * this.expMultiplier;
                    this.enemy[i].exp--;
                    this.enemyExp[i].setText(this.enemy[i].exp);
                    if(this.player.levelUp()) {
                        this.levelUpMessage.visible = true;
                        console.log(this.player.level, ' exp:', this.player.exp, ' max:', this.player.maxExp);
                    }
                    console.log(this.player.exp,'/',this.player.maxExp, '=', this.player.exp/this.player.maxExp);
                }
            }

        } else if (this.state >= 1) {
            console.log('gising na bata');

            this.events.emit('finishedDungeon', {success: this.success, dataCapture: this.dataCapture, progress: this.progress, message : {title:  this.success ? "#1 Victory Royale!" : "Mission Failed", message: this.success ? "You have successfully finished this dungeon!" : "We'll get 'em next time."}});

            this.scene.wake('MainScene', {player: this.player});
            this.scene.stop('ResultScene');
        }
    }

}
