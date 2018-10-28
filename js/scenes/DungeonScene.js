class DungeonScene extends Phaser.Scene {

    constructor () {
        super('DungeonScene');
    }

    preload () {
        var titleStyle = { font: "32px manaspc", fill: "#00ff44", align: "center" };
        var loadingText = this.add.text(720/2, 480/2, "Loading",titleStyle);
        loadingText.setOrigin(0.5);
        console.log(this.dungeon.background);

        /* load images and spritesheets */
        this.load.image('dungeonBG', this.dungeon.background);
        this.load.image('minionFace', this.dungeon.minionFace);
        this.load.image('bossFace', this.dungeon.bossFace);
        this.load.image('crosshair', 'assets/images/target.png');

    }

    init (data) {
        this.dungeon = data.dungeon;
        this.difficulty = data.difficulty;
        this.player = data.player;
    }

    create () {

        var bg = this.add.sprite(720/2, 480/2, 'dungeonBG');
        this.playerHP = this.player.hp;
        this.playerHealthDisplay =  this.add.group({ key: 'heart', frame: 0, repeat: this.player.hp - 1, setXY: { x: 720/2 - 680/2, y:  480/2 - 440/2, stepX: 32 } });

        this.cleared = 0;
        this.crosshair = this.add.sprite(720/5, 480/2, 'crosshair');
        this.crosshair.setOrigin(0.5);

        /* display, to be changed since positions are hardcoded */
        this.minionGroup = this.add.group([ { key: 'minionFace', frame: 0, repeat: 2, setXY: { x: 720/5 + 1 , y:  480/2, stepX: 720/5 }, setScale: { x: 3, y: 3}, setOrigin: {x: 0.5, y: 0.5}  },
         { key: 'bossFace', frame: 0, setXY: { x: 4*720/5 + 1 , y:  480/2 }, setScale: { x: 3, y: 3}, setAnchor: 0.5 } ]);


         /* buttons */

        var style = { font: "16px manaspc", fill: "#ffffff", align: "left", wordWrap: { width: 680 - 90, useAdvancedWrap: true} };

        this.cancelButton = new HiraButton(this, 60 + 30 , 420, "Run away", style, () => {
            console.log('fuck go back');
            var enemyCleared = [];
            for(var i = 0; i < this.cleared; i++) {
                if(i === 3) {
                    enemyCleared.push({name: this.dungeon.bossName, exp: 50});
                } else {
                    enemyCleared.push({name: this.dungeon.minionName, exp: 10});
                }
            }
            this.scene.start('ResultScene', {player: this.player, enemy: enemyCleared, success: this.cleared >= 4, flee: true});
        }, this);
        this.add.existing(this.cancelButton);

        this.battleButton = new HiraButton(this, 720 - 60 - 30 , 420, "To Battle!", style, () => {
            this.scene.sleep('DungeonScene');

            this.scene.launch('BattleScene', {player: this.player, dungeon: this.dungeon, difficulty: this.difficulty, boss: this.cleared === 3, simulate: false });
        }, this);
        this.add.existing(this.battleButton);

        /* listen events from BattleScene */
        this.events.on('BattleFinish', this.onBattleFinish, this);

        let battle = this.scene.get('BattleScene');
        battle.events.removeListener('battleFinish');
        battle.events.on('battleFinish', this.onBattleFinish, this);

        this.difficultyButton = new HiraButton(this, 720/2, 480/5, 'Easy', style, () => {
            if (this.difficultyButton.text === 'Easy') {
                this.difficultyButton.setText('Normal');
                this.difficulty = game.global.NORMAL;
            } else if (this.difficultyButton.text === 'Normal') {
                this.difficultyButton.setText('Hard');
                this.difficulty = game.global.HARD;
            } else if (this.difficultyButton.text === 'Hard') {
                this.difficultyButton.setText('Easy');
                this.difficulty = game.global.EASY;
            }
        }, this);
        this.add.existing(this.difficultyButton);


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
        }

        /* if player died, no anims for now but will probably add later */
        if(this.player.hp <= 0) {
            var enemyCleared = [];
            for(var i = 0; i < this.cleared; i++) {
                if(i === 3) {
                    enemyCleared.push({name: this.dungeon.bossName, exp: 50});
                } else {
                    enemyCleared.push({name: this.dungeon.minionName, exp: 10});
                }
            }
            /* some anim before starting next scene */
            this.scene.start('ResultScene', {player: this.player, enemy: enemyCleared, success: this.cleared === 4});
        }

        /* if dungeon is cleared, no anims for now but will probably add later */
        if(this.cleared >= 4) {
            var enemyCleared = [];
            for(var i = 0; i < this.cleared; i++) {
                if(i === 3) {
                    enemyCleared.push({name: this.dungeon.bossName, exp: 50});
                } else {
                    enemyCleared.push({name: this.dungeon.minionName, exp: 10});
                }
            }
            /* success screen, related to story probably cutscene */
            this.scene.start('ResultScene', {player: this.player, enemy: enemyCleared, success: this.cleared >= 4});
        }
    }

    onBattleFinish () {
        console.log('tapos');
        this.cleared += 1;
    }
}
