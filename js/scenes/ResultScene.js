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
    }

    preload () {
        this.load.image('gameover', 'assets/images/gameover.png');
    }

    create () {
        this.scene.bringToTop();

        let graphics = this.add.graphics();
        graphics.fillStyle(0x003366 , 1);
        graphics.fillRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);

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

        this.message = this.add.text(720/2, 480/5, 'xxx', header);
        this.message.setOrigin(0.5);



        if(this.success) {
            this.message.setText(this.player.type + ' was victorious!');
        } else  if (this.flee) {
            this.message.setText('You fleed!');
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
            this.enemyNames.push(this.add.text(720/3, 480/3 + 50*(i+1), this.enemy[i].name, style));
            this.enemyNames[i].setOrigin(0.5);
            this.enemyExp.push(this.add.text(2*720/3, 480/3 + 50*(i+1), this.enemy[i].exp, style));
            this.enemyExp[i].setOrigin(0.5);
        }

        this.playerName = this.add.text(720/3, 480/3, this.player.type, style);
        this.playerName.setOrigin(0.5);

        this.levelUpMessage = this.add.text(720/3 - 100, 480/3, 'level up!', style);
        this.levelUpMessage.setOrigin(0.5);
        this.levelUpMessage.visible = false;

        this.input.keyboard.on('keydown', this.typedKeys, this);

        this.player.hp = this.player.maxHp; /* restore player health */

    }

    typedKeys (e) {
        this.state++;
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
            if(this.success) { /* update story level */
                this.events.emit('finishedDungeon');
            }
            this.scene.wake('MainScene', {player: this.player});
            this.scene.stop('ResultScene');
        }
    }

}
