class BattleScene extends Phaser.Scene {

    constructor () {
        super('BattleScene');
        this.STATE_VALUE = {"idle":0, "attack":1, "animate":2, "hit":3}
        Object.freeze(this.STATE_VALUE);
    }

    preload () {
        /* initialized once in the main game, to be reused by all scenes */
        /* to keep the attributes in between scenes */

        this.load.image('BG', this.dungeon.battleBackground);
        this.load.spritesheet('minion', this.dungeon.minionSprite, { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('boss', this.dungeon.bossSprite, { frameWidth: 32, frameHeight: 32 });
    }

    init (data) {
        this.dungeon = data.dungeon;
        this.difficulty = data.difficulty;
        this.player = data.player;
        this.boss = data.boss;
    }

    typedKeys (e) {
        if(this.state === this.STATE_VALUE.attack)
        {
            if (e.keyCode >= 65 && e.keyCode <= 90)
            {
                e.preventDefault();
                this.inputText += e.key;
                console.log('you typed ', this.inputText);
            }
            else if (e.keyCode === 8) //backspace
            {
                e.preventDefault();
                this.inputText = this.inputText.slice(0, -1);
            }
            else if (e.keyCode === 13) //enter
            {
                e.preventDefault();
                if(this.inputText === this.projectile.currentChar)
                {
                    this.cameras.main.flash(300);
                    this.state = this.STATE_VALUE.idle;
                    var hearts = this.enemyHealthDisplay.getChildren();
                    hearts[hearts.length - 1].destroy();
                    this.enemy.hp -=1;
                    this.timedEvent.remove(false);

                }
                else
                {
                    this.timedEvent.remove(this.answerFailed());

                }
            }
        }
    }

    create () {
        this.scene.bringToTop();
        /* remove existing anims since this scene will be reused */
        this.anims.remove('idle');
        this.anims.remove('minionidle');

        /* initalize enemy */
        this.enemy = new Unit(this,720 - 120, 480 - 480/3, "EnemyBoi", this.boss ? 4 : 2, 1);
        this.enemy.maxExp = this.boss ? this.dungeon.bossExp : this.dungeon.minionExp;
        this.enemy.hp += this.difficulty;

        /* set default state */
        this.state = this.STATE_VALUE.idle;

        /* draw bg */
        var bg = this.add.sprite(720/2, 480/2, 'BG');
        bg.setScale(1);
        bg.setOrigin(0.5);

        /* draw hud */
        var style = { font: "16px Courier", fill: "#00ff44" };

        this.playerHealthDisplay =  this.add.group({ key: 'heart', frame: 0, repeat: this.player.hp - 1, setXY: { x: 720/2 - 680/2, y:  480/2 - 440/2, stepX: 32 } });
        this.enemyHealthDisplay =  this.add.group({ key: 'heart', frame: 0, repeat: (this.boss ? 3 : 1) + this.difficulty, setXY: { x: 720 - (720/2 - 680/2), y:  480/2 - 440/2, stepX: -32 } });

        /* draw 'inputbox' */
        this.inputText = '';
        this.inputTextDisplay = this.add.text(720/2, 480/2, this.inputText, style);
        this.inputTextDisplay.setOrigin(0.5);

        /* add attack button */
        this.attackButton = new HiraButton(this, 720/2, 480/2, "Attack!", style, () =>  {
            if(this.state === this.STATE_VALUE.idle) {
                this.timedEvent = this.time.addEvent({ delay: 5000, callback: this.answerFailed, callbackScope: this }, this);
                console.log('state has been changed');
                this.projectile.getRandomCharacter();
                this.projectile.getHiragana();
                this.projectile.setText(this.projectile.getHiragana());
                this.state = this.STATE_VALUE.attack
            }
        }, this);
        this.add.existing(this.attackButton);

        /* create anims */
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 1 ] }),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'minionidle',
            frames: this.anims.generateFrameNumbers(this.boss ? 'boss' : 'minion' , { frames: [ 0, 1 ] }),
            frameRate: 2,
            repeat: -1
        });

        this.player.createSprite(this, 'player', 'idle', 120, 320, 2);

        this.enemy.createSprite(this, 'minion', 'idle', 720 - 120, 480 - 480/3, 2);
        this.enemy.sprite.setFlipX(true);

        /* projectile */
        this.projectile = new Projectile(this, 720/2, 480/2, 'hira', this.dungeon.wordPool);
        this.add.existing(this.projectile);

        this.input.keyboard.on('keydown', this.typedKeys, this);
        this.input.keyboard.addKey(8);
        this.input.keyboard.on('keydown_ESC', function (event) {
            this.scene.wake('MainScene');
            this.scene.stop('BattleScene');
        }, this);

        this.timedEvent = null;
        this.timerDisplay = this.add.text(720/2, 10, 'ayy lmao', style);
        this.timerDisplay.setOrigin(0.5);
        this.timerDisplay.visible = false;

        /* projectile path */
        this.path = this.add.path();
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        var line1 = new Phaser.Curves.Line([  720/2, 480/3, 120, 320 ]);
        this.path.add(line1);

    }

    update () {
        /* if player died or enemy died,  probably will add animations later */
        if(this.player.hp <= 0) {
            this.scene.stop('BattleScene');
            this.scene.wake('DungeonScene');
        } else if (this.enemy.hp <= 0) {
            this.events.emit('battleFinish');
            this.scene.stop('BattleScene');
            this.scene.wake('DungeonScene');
        }

        /* game state */
        if (this.state === this.STATE_VALUE.idle) {
            this.player.sprite.anims.play('idle', true);
            this.inputText = '';
            this.inputTextDisplay.visible = false;
            this.attackButton.visible = true;
            this.projectile.visible = false;
            this.timerDisplay.visible = false;
            this.follower.t = 0;
            this.follower.vec.x = 720/2;
            this.follower.vec.y = 480/3;
        } else if (this.state === this.STATE_VALUE.attack) {
            this.inputTextDisplay.setText(this.inputText);
            this.inputTextDisplay.visible = true;
            this.projectile.visible = true;

            this.projectile.setPosition(this.follower.vec.x, this.follower.vec.y);

            this.attackButton.visible = false;
            this.timerDisplay.visible = true;
            this.timerDisplay.setText(this.timedEvent.getElapsedSeconds().toString().substr(0, 4));
        } else if (this.state === this.STATE_VALUE.animate) {

            this.path.getPoint(this.follower.t, this.follower.vec);
            this.projectile.setPosition(this.follower.vec.x, this.follower.vec.y);
        }
    }

    answerFailed () {
        /* failed, time's up or wrong anser */
        console.log('time ends');
        this.timedEvent.remove(false);
        this.timerDisplay.setText('Times up!');

        /* change state while animating */
        this.state = this.STATE_VALUE.animate;

        /* move projectile */
        this.tweens.add({
           targets: this.follower,
           t: 1,
           ease: 'Cubic.easeIn',
           duration: 1000,
           yoyo: false,
           repeat: 0,
           onComplete: () => {
               /* duplicate */
               this.cameras.main.shake(300);
               this.state = this.STATE_VALUE.idle;
               console.log('burado');
               var hearts = this.playerHealthDisplay.getChildren();
               hearts[hearts.length - 1].destroy();
               this.player.hp -=1;
           }
       }, this);
   }

}
