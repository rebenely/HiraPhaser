class ResultScene extends Phaser.Scene {

    constructor () {
        super('ResultScene');
    }

    init (data) {
        // console.log(data);
        this.enemy = data.enemy;
        this.player = data.player;
        this.cleared = data.cleared;
        this.success = data.success;
        this.flee = data.flee;
        this.story = data.story;
        this.log = data.log;
        this.dataCapture = data.dataCapture;
    }

    preload () {
        this.loading = new HiraText(this, 720/2, 480/2, "Loading", "header");
        this.add.existing(this.loading);
        this.load.image('gameover', 'assets/images/gameover.png');
    }

    create () {
        // console.log(this.dataCapture);
        // console.log('rsult scene log', this.log);
        this.scene.bringToTop();

        this.container = this.add.graphics();
        this.container.lineStyle(game.global.UI_THICKNESS, game.global.UI_COLOR, 1);

        this.container.fillGradientStyle(game.global.UI_FILL_A, game.global.UI_FILL_A, game.global.UI_FILL_B, game.global.UI_FILL_B, 1);
        this.container.fillRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);
        this.container.strokeRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);

        // this.progressBox = this.add.graphics();
        // this.progressBar = this.add.graphics();

        this.state = 0;
        //
        // this.progressBox.fillStyle(0x222222, 0.8);
        // this.progressBox.fillRect(2*720/3 - 64, 480/3 - 8, 128, 16);
        // this.progressBar.fillStyle(0xffffff, 1);
        // this.progressBar.fillRect(2*720/3 - 60, 480/3 - 4, this.player.exp/this.player.maxExp * 120, 8);


        var header = { font: "32px manaspc", fill: "#00ff44" };
        var style = { font: "16px manaspc", fill: "#00ff44" };

        var gob = this.add.sprite(720/2, 480/2, 'gameover'); gob.setOrigin(0.5); gob.setScale(0.8);
        gob.visible = false;


        this.message = new HiraText(this, 720/2, 480/5, 'xxx', "header");
        this.add.existing(this.message);



        if(this.success) {
            this.message.setTextUpper(this.player.name + ' was victorious!');
        } else  if (this.flee) {
            this.message.setTextUpper('You fled!');
        } else {
            this.message.setTextUpper('You lose!');
            this.message.setInteractive().on('pointerdown', function () {
                // console.log('oy wtf');
                gob.visible = gob.visible ? false : true;
            }, this, gob);
        }


        this.expMultiplier = this.flee ? 0.5 : 1;

        this.enemyNames = [];
        this.enemyExp = [];
        this.enemyAve = [];
        this.aveTime = [];
        this.diff = [];
        var equiv = ["Easy", "Normal", "Hard"];
        // console.log('this enemy', this.enemy.length);
        for(var i = 0; i < this.enemy.length; i++){
            this.enemyNames.push(new HiraText(this, 720/5, 480/3 + 50*(i+1), this.enemy[i].name, "basic"));
            this.add.existing(this.enemyNames[i]);

            this.enemyExp.push(new HiraText(this, 3*720/5, 480/3 + 50*(i+1), Math.round(this.dataCapture.battles[i].accuracy*100 * 10)/10 + '%', "basic"));
            this.add.existing(this.enemyExp[i]);

            this.enemyAve.push(new HiraText(this, 2*720/5, 480/3 + 50*(i+1),  Math.round(this.dataCapture.battles[i].time_answering/this.dataCapture.battles[i].asked * 10)/10 + 's', "basic"));
            this.add.existing(this.enemyAve[i]);

            this.diff.push(new HiraText(this, 4*720/5, 480/3 + 50*(i+1), equiv[this.dataCapture.battles[i].difficulty] , "basic"));
            this.add.existing(this.diff[i]);

            this.aveTime.push(this.dataCapture.battles[i].time_answering/this.dataCapture.battles[i].asked);
        }


        this.playerName = new HiraText(this, 720/5, 480/3, "Enemy",  "basic");
        this.add.existing(this.playerName);
        this.accuracyDisplay = new HiraText(this, 3*720/5,  480/3, "Accuracy",  "basic");
        this.add.existing(this.accuracyDisplay);
        this.aveTimeDisplay = new HiraText(this, 2*720/5,  480/3, "AveTime",  "basic");
        this.add.existing(this.aveTimeDisplay);
        this.difficultyDisplay = new HiraText(this, 4*720/5,  480/3, "Difficulty",  "basic");
        this.add.existing(this.difficultyDisplay);

        this.totalName = new HiraText(this, 720/5, 480/3 + 50*(this.enemy.length+1), "Total",  "basic");
        this.add.existing(this.totalName);
        this.totalAccuracy = new HiraText(this, 3*720/5,  480/3 + 50*(this.enemy.length+1), this.enemy.length > 0 ? Math.round(this.dataCapture.accuracy*100 * 10)/10 + '%' : "x",  "basic");
        this.add.existing(this.totalAccuracy);
        this.aveTimeVal = 0;
        for(let i = 0; i < this.aveTime.length; i++){
            this.aveTimeVal += this.aveTime[i];
        }
        this.aveTimeVal = this.aveTimeVal/this.aveTime.length;
        this.totalAveTime = new HiraText(this, 2*720/5,  480/3 + 50*(this.enemy.length+1), this.enemy.length > 0 ? Math.round(this.aveTimeVal * 10)/10 + 's' : "x",  "basic");
        this.add.existing(this.totalAveTime);
        this.totalDiff = new HiraText(this, 4*720/5,  480/3 + 50*(this.enemy.length+1), "x",  "basic");
        this.add.existing(this.totalDiff);

        this.input.keyboard.on('keydown', this.typedKeys, this);
        this.input.on('pointerup', this.nextPage, this);

        this.player.hp = this.player.maxHp; /* restore player health */


    }

    typedKeys (e) {
        e.preventDefault();
        if (e.keyCode === 32 || e.keyCode === 13) {
            this.state+= 2;
        }
    }
    nextPage() {
        this.state += 2;
    }

    update () {
        // this.progressBar.clear();
        // this.progressBar.fillStyle(0xffffff, 1);
        // this.progressBar.fillRect(2*720/3 - 60, 480/3 - 4, this.player.exp/this.player.maxExp * 120, 8);
        // if(this.state === 1 && (this.success || this.enemyNames.length > 0)) {
        //
        // } else
        if (this.state >= 1) {
            this.sound.play('next');
            // console.log('gising na bata');

            this.events.emit('finishedDungeon', {success: this.success, dataCapture: this.dataCapture, story: this.story, message : {title:  this.success ? "Dungeon Complete!" : "Dungeon Failed!", message: this.success ? "You have successfully finished this dungeon!" : "Just a little more training will fix this."}, log: this.log});

            this.scene.wake('MainScene', {player: this.player});
            this.scene.stop('ResultScene');
        }
    }

}
