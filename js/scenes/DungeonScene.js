class DungeonScene extends Phaser.Scene {

    constructor () {
        super('DungeonScene');
    }

    preload () {
        var titleStyle = { font: "32px manaspc", fill: "#00ff44", align: "center" };
        var loadingText = this.add.text(720/2, 480/2, "Loading",titleStyle);
        loadingText.setOrigin(0.5);
        console.log(this.dungeon.background, this.dungeon.backgroundPath);

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
    }

    create () {
        this.enemyCleared = [];
        this.dataCapture = {
            player: this.player.name,
            name: this.dungeon.name,
            timestamp: new Date(),
            accuracy: 0,
            battles: []
        }
        this.hintChecked = false;
        console.log('recreate boii', this.dataCapture);
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
            this.scene.start('ResultScene', {player: this.player, enemy: enemyCleared, success: this.cleared >= 4, flee: true, dataCapture: this.dataCapture});
        }, this);
        this.add.existing(this.cancelButton);

        this.battleButton = new HiraButton(this, 720 - 60 - 30 , 420, "To Battle!", style, () => {
            this.scene.sleep('DungeonScene');

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
        this.easyButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 3);


        this.normalButton = new HiraButton(this, 2*720/4, 480/5, 'Normal', style, () => {
            this.difficulty = game.global.NORMAL;
            this.normalButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 3);
            this.easyButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 0);
            this.hardButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 0);


        }, this);
        this.add.existing(this.normalButton);

        this.hardButton = new HiraButton(this, 3*720/4, 480/5, 'Hard', style, () => {
            this.difficulty = game.global.HARD;
            this.hardButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 3);
            this.easyButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 0);
            this.normalButton.setStroke(game.global.UI_TEXT_STROKE_HIGHLIGHT, 0);

        }, this);
        this.add.existing(this.hardButton);

        this.hintButton = new HiraButton(this, 720/2 , 420, 'Hint!', style, () => {
            this.hintChecked = true;
            this.scene.pause('DungeonScene');
            this.scene.launch('HintScene', {player: this.player, characterPool: this.player.characterPool});
        }, this);
        this.add.existing(this.hintButton);

        this.cameras.main.once('camerafadeoutcomplete', function (camera) {
            this.scene.stop();
            this.scene.start('ResultScene', {player: this.player, enemy: this.enemyCleared, success: this.cleared === 4, dataCapture: this.dataCapture});
        }, this);

        this.events.once('closeScreen', function () {
            this.cameras.main.fadeOut(1000);
        }, this);
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
        if(this.player.hp <= 0) {
            this.packCapturedData(false, false);

            for(var i = 0; i < this.cleared; i++) {
                if(i === 3) {
                    this.enemyCleared.push({name: this.dungeon.bossName, exp: 50});
                } else {
                    this.enemyCleared.push({name: this.dungeon.minionName, exp: 10});
                }
            }
            /* some anim before starting next scene */

            this.events.emit('closeScreen');
            this.cleared = 0;
        }

        /* if dungeon is cleared, no anims for now but will probably add later */
        if(this.cleared >= 4) {
            this.packCapturedData(true, false);
            for(var i = 0; i < this.cleared; i++) {
                if(i === 3) {
                    this.enemyCleared.push({name: this.dungeon.bossName, exp: 50});
                } else {
                    this.enemyCleared.push({name: this.dungeon.minionName, exp: 10});
                }
            }

            this.events.emit('closeScreen');
            this.cleared = 0; /* this is a solution to a bug, maybe due to timing? if i remove this, dungeon will be cleared before it is even loaded */
        }
    }

    onBattleFinish (data) {
        if(data.success){
            console.log('tapos');
            this.cleared += 1;
        }
        data.dataCapture.hint_checked = this.hintChecked;
        this.dataCapture.battles.push(data.dataCapture);
        this.hintChecked = false;
    }

    packCapturedData(success, flee){
        this.dataCapture.success = success;

        this.dataCapture.flee = flee;

        console.log('tapos na', this.dataCapture);
        for(let i = 0; i < this.dataCapture.battles.length; i++){
            this.dataCapture.accuracy += this.dataCapture.battles[i].accuracy;
        }
        this.dataCapture.accuracy /= this.dataCapture.battles.length;
    }
}
