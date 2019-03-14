class DungeonScene extends Phaser.Scene {

    constructor () {
        super('DungeonScene');
    }

    preload () {
        this.loading = new HiraText(this, 720/2, 480/2, "Loading", "header");
        this.add.existing(this.loading);
        // console.log(this.dungeon.background, this.dungeon.backgroundPath);

        /* load images and spritesheets */
        this.load.image(this.dungeon.background, this.dungeon.backgroundPath);
        this.load.image(this.dungeon.minionFace, this.dungeon.minionFacePath);
        this.load.image(this.dungeon.bossFace, this.dungeon.bossFacePath);
        this.load.image('crosshair', 'assets/images/globals/target.png');

    }

    init (data) {
        this.dungeon = data.dungeon;
        this.difficulty = data.difficulty;
        this.player = data.player;
        this.log = data.log;
    }

    create () {
        this.enemyCleared = [];
        this.dataCapture = {
            username: this.player.name,
            name: this.dungeon.name,
            timestamp: game.timestamp(),
            total_time: new Date(),
            accuracy: 0,
            battles: []
        }
        this.hintChecked = false;
        // console.log('recreate boii', this.dungeon);
        var bg = this.add.sprite(720/2, 480/2, this.dungeon.background);
        this.playerHP = this.player.hp;
        this.playerHealthDisplay =  this.add.group({ key: 'heart', frame: 0, repeat: this.player.hp - 1, setXY: { x: 720/2 - 680/2, y:  480/2 - 440/2, stepX: 32 } });

        this.cleared = 0;
        this.crosshair = this.add.sprite(720/5, 480/2, 'crosshair');
        this.crosshair.setOrigin(0.5);

        /* display, to be changed since positions are hardcoded */
        this.minionGroup = this.add.group([ { key: this.dungeon.minionFace, frame: 0, repeat: 2, setXY: { x: 720/5 + 1 , y:  480/2, stepX: 720/5 }, setScale: { x: 3, y: 3}, setOrigin: {x: 0.5, y: 0.5}  },
         { key: this.dungeon.bossFace, frame: 0, setXY: { x: 4*720/5 + 1 , y:  480/2 }, setScale: { x: 3, y: 3}, setAnchor: 0.5 } ]);


         /* buttons */

        var style = { font: "16px manaspc", fill: game.global.UI_TEXT_FILL, align: "left", wordWrap: { width: 680 - 90, useAdvancedWrap: true} };

        this.cancelButton = new HiraButton(this, 60 + 30 , 420, "Run away", style, () => {
            // console.log('fuck go back');
            this.packCapturedData(false, true);
            var enemyCleared = [];
            for(var i = 0; i < this.cleared; i++) {
                if(i === 3) {
                    enemyCleared.push({name: this.dungeon.bossName, exp: 50});
                } else {
                    enemyCleared.push({name: this.dungeon.minionName, exp: 10});
                }
            }
            this.scene.stop();
            this.sound.play('fail');
            this.scene.start('ResultScene', {player: this.player, enemy: enemyCleared, success: this.cleared >= 4, flee: true, dataCapture: this.dataCapture, log: this.log});
        }, this);
        this.add.existing(this.cancelButton);

        this.battleButton = new HiraButton(this, 720 - 60 - 30 , 420, "To Battle!", style, () => {
            this.scene.sleep('DungeonScene');
            this.sound.play('start');

            this.scene.launch('BattleScene', {player: this.player, dungeon: this.dungeon, difficulty: this.difficulty, boss: this.cleared === 3, simulate: false });
        }, this);
        this.add.existing(this.battleButton);

        /* listen events from BattleScene */

        let battle = this.scene.get('BattleScene');
        battle.events.removeListener('battleFinish');
        battle.events.on('battleFinish', this.onBattleFinish, this);

        this.easyButton = new HiraButton(this, 720/4, 480/5, 'Easy', style, () => {
            this.difficulty = game.global.EASY;
            this.easyButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 3);
            this.normalButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 0);
            this.hardButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 0);

        }, this);
        this.add.existing(this.easyButton);
        if(this.difficulty === game.global.EASY) {
            this.easyButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 3);
        }

        this.normalButton = new HiraButton(this, 2*720/4, 480/5, 'Normal', style, () => {
            this.difficulty = game.global.NORMAL;
            this.normalButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 3);
            this.easyButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 0);
            this.hardButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 0);


        }, this);
        this.add.existing(this.normalButton);
        if(this.difficulty === game.global.NORMAL) {
            this.normalButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 3);
        }


        this.hardButton = new HiraButton(this, 3*720/4, 480/5, 'Hard', style, () => {
            this.difficulty = game.global.HARD;
            this.hardButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 3);
            this.easyButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 0);
            this.normalButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 0);

        }, this);
        this.add.existing(this.hardButton);
        if(this.difficulty === game.global.HARD) {
            this.hardButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 3);
        }

        this.hintButton = new HiraButton(this, 720/2 , 420, 'Hint!', style, () => {
            this.hintChecked = true;
            this.scene.pause('DungeonScene');
            this.scene.launch('HintScene', {player: this.player, characterPool: this.player.characterPool});
        }, this);
        this.add.existing(this.hintButton);

        this.events.removeListener('camerafadeoutcomplete');
        this.cameras.main.once('camerafadeoutcomplete', function (camera) {
            this.scene.stop();
            this.scene.start('ResultScene', {player: this.player, enemy: this.enemyCleared, success: this.cleared === 4, dataCapture: this.dataCapture, story: this.dungeon.story});
        }, this);

        this.events.removeListener('closeScreen');
        this.events.once('closeScreen', function (success, flee) {
            this.packCapturedData(success, flee);
            if(success){
                this.sound.play('success');
            } else {
                this.sound.play('fail');
            }
            this.hintButton.visible = false;
            this.easyButton.visible = false;
            this.hardButton.visible = false;
            this.normalButton.visible = false;

            this.battleButton.visible = false;
            this.cancelButton.visible = false;

            // console.log('look what i did', this.cleared);
            for(var i = 0; i < this.cleared; i++) {
                if(i === 3) {
                    this.enemyCleared.push({name: this.dungeon.bossName, exp: 50});
                } else {
                    this.enemyCleared.push({name: this.dungeon.minionName, exp: 10});
                }
            }
            this.cameras.main.fadeOut(1000);
        }, this);
        game.screenWipe(this);
    }

    update () {
        // if player is damaged from battle
        if(this.playerHP > this.player.hp) {
            var hearts = this.playerHealthDisplay.getChildren();
            hearts[hearts.length - 1].destroy();
            this.playerHP -=1;
        }
        /* move crosshar */
        switch(this.cleared) {
            case 0:
                this.crosshair.setPosition(720/5, 480/2);
            break;
            case 1:
                this.crosshair.setPosition(2*720/5, 480/2);
            break;
            case 2:
                this.crosshair.setPosition(3*720/5, 480/2);
            break;
            case 3:
                this.crosshair.setPosition(4*720/5, 480/2);
            break;
            default:
                this.crosshair.setPosition(4*720/5, 480/2);
            break;
        }

        /* if player died, no anims for now but will probably add later */
        /* note: added fade out on finish */

        if(this.player.hp <= 0) {
            this.events.emit('closeScreen', false, false);
        }

        /* if dungeon is cleared, no anims for now but will probably add later */
        /* note: added fade out on finish */
        if(this.cleared >= 4) {
            this.events.emit('closeScreen', true, false);
        }
    }

    onBattleFinish (data) {
        if(data.success){
            this.cleared += 1;
            // console.log('tapos ', this.cleared);
        }
        data.dataCapture.hint_checked = this.hintChecked;
        this.dataCapture.battles.push(data.dataCapture);
        this.hintChecked = false;
    }

    packCapturedData(success, flee){
        this.dataCapture.success = success;

        this.dataCapture.flee = flee;
        this.dataCapture.total_time = (new Date() - this.dataCapture.total_time)/1000;

        // console.log('tapos na', this.dataCapture);
        for(let i = 0; i < this.dataCapture.battles.length; i++){
            this.dataCapture.accuracy += this.dataCapture.battles[i].accuracy;
        }
        if(this.dataCapture.accuracy === null) {
            this.dataCapture.accuracy = 0;
        }
        this.dataCapture.accuracy /= this.dataCapture.battles.length;
    }
}
