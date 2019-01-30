class BattleScene extends Phaser.Scene {

    constructor () {
        super('BattleScene');
        this.STATE_VALUE = {"idle":0, "attack":1, "animate":2, "hit":3, "death": 4, "close": 5}
        Object.freeze(this.STATE_VALUE);
    }

    preload () {
        /* initialized once in the main game, to be reused by all scenes */
        /* to keep the attributes in between scenes */
        console.log(this.dungeon);
        this.load.image(this.dungeon.battleBackground, this.dungeon.battleBackgroundPath);
        console.log(this.dungeon.minionName, this.dungeon.minionSpritePath);
        this.load.spritesheet(this.dungeon.minionName, this.dungeon.minionSpritePath, { frameWidth: 32, frameHeight: 32 });
        if(this.dungeon.bossName != undefined){
            this.load.spritesheet(this.dungeon.bossName, this.dungeon.bossSpritePath, { frameWidth: 32, frameHeight: 32 });
        }

    }

    init (data) {
        if(data.dungeon !== undefined) {
            this.dungeon = data.dungeon;
            this.boss = data.boss;
            this.difficulty = data.difficulty;
        } else if (data.simulate) {
            this.dungeon = {
                minionName: 'trainingdummy',
                minionSpritePath: 'assets/spritesheets/enemies/trainingdummy.png',
                battleBackgroundPath: 'assets/images/globals/dojo.jpg',
                battleBackground: 'dojo',
                minionExp: 0,
                wordPool: data.wordPool
            };
            this.boss = false;
            this.difficulty = 0;
        }
        this.simulate = data.simulate;

        this.player = data.player;
    }

    typedKeys (e) {
        if(this.state === this.STATE_VALUE.attack)
        {
            if (e.keyCode >= 65 && e.keyCode <= 90)
            {
                e.preventDefault();
                this.inputText += e.key.toUpperCase();
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
                this.skipButton.visible = false;
                let stats = {
                    word: this.projectile.currentChar,
                    answer: this.inputText,
                    time: parseFloat(this.timerDisplay.text)
                };

                if(this.inputText === this.projectile.currentChar)
                {
                    stats.correct = true;
                    this.cameras.main.flash(100);
                    this.state = this.STATE_VALUE.idle;
                    if(!this.simulate){ /* can be refactored similar to when wrong answer, timing on animation before damage */
                        var hearts = this.enemyHealthDisplay.getChildren();
                        hearts[hearts.length - 1].destroy();

                        this.enemy.hp -=1;
                    }
                    this.timedEvent.remove(false);
                    this.player.sprite.play('player_attack', false);
                    this.showSlash(this.enemy.sprite.x, this.enemy.sprite.y, true);

                }
                else
                {
                    stats.correct = false;
                    this.timedEvent.remove(this.answerFailed(true));

                }
                this.battleCapture.questions.push(stats);
            }
        }
    }

    create () {
        this.battleCapture = {
            difficulty: this.difficulty,
            enemy_health: this.boss ? 4 : 2 + this.difficulty,
            asked: 0,
            total_time: this.time.now/1000,
            questions: []
        };

        console.log('ayo mark time', this.battleCapture.total_time);

        this.scene.bringToTop();
        /* remove existing anims since this scene will be reused */
        this.anims.remove('idle');
        this.anims.remove('enemyidle');
        this.anims.remove('player_attack');
        this.anims.remove('player_hurt');
        this.anims.remove('slash');


        /* initalize enemy */
        this.enemy = new Unit(this,720 - 120, 480 - 480/3, "EnemyBoi", this.boss ? 4 : 2, 1);
        this.enemy.maxExp = this.boss ? this.dungeon.bossExp : this.dungeon.minionExp;
        this.enemy.hp += this.difficulty;

        /* set default state */
        this.state = this.STATE_VALUE.idle;

        /* draw bg */
        var bg = this.add.sprite(720/2, 480/2, this.dungeon.battleBackground);
        bg.setScale(1);
        bg.setOrigin(0.5);

        /* draw hud */
        var style = { font: "16px manaspc", fill: game.global.UI_TEXT_FILL };

        this.playerHealthDisplay =  this.add.group({ key: 'heart', frame: 0, repeat: this.player.hp - 1, setXY: { x: 720/2 - 680/2, y:  480/2 - 440/2, stepX: 32 } });
        if(!this.simulate){
            this.enemyHealthDisplay =  this.add.group({ key: 'heart', frame: 0, repeat: (this.boss ? 3 : 1) + this.difficulty, setXY: { x: 720 - (720/2 - 680/2), y:  480/2 - 440/2, stepX: -32 } });
        }

        /* draw 'inputbox' */
        this.inputText = '';
        this.inputTextDisplay =  new HiraText(this,720/2, 480/2, this.inputText, "header");
        this.add.existing(this.inputTextDisplay);

        /* add attack button */
        this.attackButton = new HiraButton(this, 720/2, 480/2, "Attack!", style, () =>  {
            if(this.state === this.STATE_VALUE.idle) {
                this.timedEvent = this.time.addEvent({ delay: 5000, callback: this.answerFailed, callbackScope: this }, this);
                console.log('state has been changed');
                this.projectile.getRandomCharacter();
                this.projectile.getHiragana();
                this.projectile.setText(this.projectile.getHiragana());
                this.state = this.STATE_VALUE.attack;
                console.log(this.projectile);
                this.battleCapture.asked++;

            }
        }, this);
        this.add.existing(this.attackButton);

        /* add attack button */
        this.skipButton = new HiraButton(this, 720/2, 3*480/4, "Skip", style, () =>  {
            if(this.state === this.STATE_VALUE.attack) {

                let stats = {
                    word: this.projectile.currentChar,
                    answer: '$SKIP$',
                    time: parseFloat(this.timerDisplay.text)
                };

                stats.correct = false;
                this.cameras.main.flash(100);
                this.state = this.STATE_VALUE.idle;

                this.timedEvent.remove(false);

                this.battleCapture.questions.push(stats);

            }
        }, this);
        this.add.existing(this.skipButton);

        /* create anims */
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 1 ] }),
            frameRate: 2,
            repeat: -1
        });
        console.log(this.boss ? this.dungeon.bossName : this.dungeon.minionName );
        this.anims.create({
            key: 'enemyidle',
            frames: this.anims.generateFrameNumbers(this.boss ? this.dungeon.bossName : this.dungeon.minionName , { frames: [ 0, 1 ] }),
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: 'player_hurt',
            frames: this.anims.generateFrameNumbers('player_hurt', { frames: [ 0, 1, 2] }),
            frameRate: 14,
            repeat: 0
        });

        var player_attack = {
            key: 'player_attack',
            frames: this.anims.generateFrameNumbers('player_attack', { frames: [ 0, 1, 2, 3, 4, 5, 6 ] }),
            frameRate: 7,
            repeat: 0
        };
        this.anims.create(player_attack);

        this.anims.create({
            key: 'slash',
            frames: this.anims.generateFrameNumbers('kidlatslash', { frames: [ 0, 1, 2, 3, 4, 5, 6] }),
            frameRate: 20,
            repeat: 0
        });

        this.player.createSprite(this, 'player', 'idle', 120, 320, 2);
        this.enemy.createSprite(this, this.boss ? this.dungeon.bossName : this.dungeon.minionName  , 'enemyidle', 720 - 120, 480 - 480/3, 2);
        this.enemy.sprite.setFlipX(true);
        this.slash = this.add.sprite(0,0, 'kidlatslash');
        this.slash.setScale(2);
        this.slash.setOrigin(0.5);
        this.slash.visible = false;
        this.slash.anims.play('slash');


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

        /* back button */
        this.backButton = new HiraButton(this, 720/2, 480/2 + 100, "Back", style, () =>  {
            if(this.state === this.STATE_VALUE.idle) {
                this.scene.wake('MainScene');
                this.scene.stop('BattleScene');
            }
        }, this);
        this.backButton.visible = false;
        this.add.existing(this.backButton);
        console.log('quingina');

        this.player.sprite.on('animationcomplete', this.animComplete, this);
        this.slash.on('animationcomplete', this.animCompleteSlash, this);

        this.cameras.main.once('camerafadeoutcomplete', function (camera) {
            console.log('yow');
            this.battleCapture.total_time = this.time.now/1000 - this.battleCapture.total_time;
            let correct = 0;
            let time_answer = 0;
            for(let i = 0; i < this.battleCapture.questions.length; i++){
                if(this.battleCapture.questions[i].correct) {
                    correct++;
                }
                time_answer += this.battleCapture.questions[i].time;
            }
            this.battleCapture.accuracy = correct/this.battleCapture.asked;
            this.battleCapture.time_answering = time_answer;

            this.events.emit('battleFinish', {success: this.player.hp > 0, dataCapture: this.battleCapture});
            this.scene.stop('BattleScene');
            this.scene.wake('DungeonScene');

            console.log('return this my nibba', this.battleCapture);
        }, this);

        this.events.once('closeScreen', this.closeScreen, this);

    }

    animCompleteSlash(animation, frame){
        this.slash.visible = false;
    }

    animComplete(animation, frame){
        console.log(animation.key);
        if(animation.key === 'player_attack' || animation.key === 'player_hurt'){
            console.log('finish anim');
            this.player.sprite.play('idle', true);
        }
        /* handle death anim to change scene */
    }

    closeScreen() {
        if(this.enemy.hp <= 0){
            this.tweens.add({
              targets: this.enemy.sprite,
              ease: 'Sine.easeInOut',
              duration: 1000,
              delay: 0,
              alpha: 0,
              onComplete: () => {
                  this.cameras.main.fadeOut(1000);

              }
            }, this);
        } else {
            this.tweens.add({
              targets: this.player.sprite,
              ease: 'Sine.easeInOut',
              duration: 1000,
              delay: 0,
              alpha: 0,
              onComplete: () => {
                  this.cameras.main.fadeOut(1000);

              }
            }, this);
        }
    }

    update () {

        /* if player died or enemy died,  probably will add animations later */
        if(this.player.hp <= 0 || this.enemy.hp <= 0) {
            /* play death anim here */
            console.log('fade out');
            this.events.emit('closeScreen');
            this.state = this.STATE_VALUE.close;

        }

        /* game state */
        if (this.state === this.STATE_VALUE.idle) {
            // this.player.sprite.play('idle', true);   //why does this run first before create?
            this.inputText = '';
            this.inputTextDisplay.visible = false;
            this.attackButton.visible = true;
            this.projectile.visible = false;
            this.timerDisplay.visible = false;
            this.skipButton.visible = false;
            this.follower.t = 0;
            this.follower.vec.x = 720/2;
            this.follower.vec.y = 480/3;
            if(this.simulate){
                this.backButton.visible = true;
            }
        } else if (this.state === this.STATE_VALUE.attack) {
            this.inputTextDisplay.setText(this.inputText);
            this.inputTextDisplay.visible = true;
            this.projectile.visible = true;
            this.backButton.visible = false;
            this.projectile.setPosition(this.follower.vec.x, this.follower.vec.y);

            if(!this.simulate){
                this.skipButton.visible = true;
            }
            this.attackButton.visible = false;
            this.timerDisplay.visible = true;
            this.timerDisplay.setText(this.timedEvent.getElapsedSeconds().toString().substr(0, 4));
        } else if (this.state === this.STATE_VALUE.animate) {
            this.path.getPoint(this.follower.t, this.follower.vec);
            this.projectile.setPosition(this.follower.vec.x, this.follower.vec.y);
        }
    }

    answerFailed (wrong) {
        /* failed, time's up or wrong anser */
        console.log('time ends');
        this.timedEvent.remove(false);
        if(!wrong){
            this.timerDisplay.setText('Times up!');
            let stats = {
                word: this.projectile.currentChar,
                answer: this.inputText,
                time: parseFloat(5.0)
            };
            this.battleCapture.questions.push(stats);
        } else {
            this.timerDisplay.setText('Wrong!');
        }

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
               this.cameras.main.shake(100);
               this.state = this.STATE_VALUE.idle;
               console.log('burado');
               if(!this.simulate){
                   var hearts = this.playerHealthDisplay.getChildren();
                   hearts[hearts.length - 1].destroy();
                   this.player.hp -=1;
               }
               this.player.sprite.play('player_hurt', false);
               this.showSlash(this.player.sprite.x, this.player.sprite.y, false);
           }
       }, this);
   }

   showSlash(posX, posY, flip) {
       this.slash.visible = true;
       this.slash.x = posX;
       this.slash.y = posY;
       this.slash.play('slash', false);
       this.slash.setFlipX(flip);
   }
}
