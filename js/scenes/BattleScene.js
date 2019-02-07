class BattleScene extends Phaser.Scene {

    constructor () {
        super('BattleScene');
        this.STATE_VALUE = {"idle":0, "attack":1, "animate":2, "hit":3, "death": 4, "close": 5}
        Object.freeze(this.STATE_VALUE);
    }

    preload () {
        /* initialized once in the main game, to be reused by all scenes */
        /* to keep the attributes in between scenes */
        this.loading = new HiraText(this, 720/2, 480/2, "Loading", "header");
        this.add.existing(this.loading);

        // console.log(this.dungeon);
        this.load.image(this.dungeon.battleBackground, this.dungeon.battleBackgroundPath);
        // console.log(this.dungeon.minionName + "_idle", this.dungeon.minionSpritePath);
        this.load.spritesheet(this.dungeon.minionName + "_idle", this.dungeon.minionSpritePath, { frameWidth: 64, frameHeight: 64 });
        this.load.spritesheet(this.dungeon.minionName + "_attack", this.dungeon.minionAttackSpritePath, { frameWidth: 64, frameHeight: 64 });
        if(this.dungeon.bossName != undefined){
            // console.log(this.dungeon.bossSpritePath);
            this.load.spritesheet(this.dungeon.bossName + "_idle", this.dungeon.bossSpritePath, { frameWidth: 64, frameHeight: 64 });
            this.load.spritesheet(this.dungeon.bossName + "_attack", this.dungeon.bossAttackSpritePath, { frameWidth: 64, frameHeight: 64 });
        }

    }

    init (data) {
        // console.log(data);
        if(data.dungeon !== undefined) {
            this.dungeon = data.dungeon;
            this.boss = data.boss;
            this.difficulty = data.difficulty;
        } else if (data.simulate) {
            this.dungeon = {
                minionName: 'Mentor',
                minionSpritePath: data.mentor.idle,
                minionAttackSpritePath: data.mentor.attack,
                battleBackgroundPath: 'assets/images/globals/grassland.png',
                battleBackground: 'dojo',
                minionExp: 0,
                wordPool: data.wordPool
            };
            this.boss = false;
            this.difficulty = 0;
            this.level = data.level;
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
                this.sound.play('type');
                this.inputText += e.key.toUpperCase();
                // console.log('you typed ', this.inputText);
            }
            else if (e.keyCode === 8) //backspace
            {
                this.sound.play('delete');
                e.preventDefault();
                this.inputText = this.inputText.slice(0, -1);
            }
            else if (e.keyCode === 13) //enter
            {
                this.sound.play('next');
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
                    this.state = this.STATE_VALUE.idle;

                    this.timedEvent.remove(false);
                    // this.player.sprite.play('player_attack', false);
                    this.playerAttack();
                    this.state = this.STATE_VALUE.animate;

                }
                else
                {
                    stats.correct = false;
                    this.enemy.sprite.play('enemy_attack', false);
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



        // console.log('ayo mark time', this.battleCapture.total_time);

        this.scene.bringToTop();
        /* remove existing anims since this scene will be reused */
        this.anims.remove('idle');
        this.anims.remove('enemy_idle');
        this.anims.remove('enemy_attack');
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
                // console.log('state has been changed');
                this.projectile.getRandomCharacter();
                this.projectile.getHiragana();
                this.projectile.setText(this.projectile.getHiragana());
                this.state = this.STATE_VALUE.attack;
                // console.log(this.projectile);
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
        // console.log((this.boss ? this.dungeon.bossName : this.dungeon.minionName) + "_idle" );
        this.anims.create({
            key: 'enemy_idle',
            frames: this.anims.generateFrameNumbers((this.boss ? this.dungeon.bossName : this.dungeon.minionName) + "_idle" , { frames: [ 0, 1 ] }),
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: 'enemy_attack',
            frames: this.anims.generateFrameNumbers((this.boss ? this.dungeon.bossName : this.dungeon.minionName) + "_attack"),
            frameRate: 14,
            repeat: 0
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
            frameRate: 14,
            repeat: 0
        };
        this.anims.create(player_attack);

        this.anims.create({
            key: 'slash',
            frames: this.anims.generateFrameNumbers('kidlatslash', { frames: [ 0, 1, 2, 3, 4, 5, 6] }),
            frameRate: 20,
            repeat: 0
        });


        this.enemyShadow = this.add.sprite(120, 300 + 58, 'shadow');
        this.playerShadow = this.add.sprite(720 - 120, 300 + 58, 'shadow');


        this.player.createSprite(this, 'player', 'idle', 120, 300, 2);
        this.enemy.createSprite(this, this.boss ? this.dungeon.bossName : this.dungeon.minionName + "_idle"  , 'enemy_idle', 720 - 120, 300, 2);
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
                if(this.simulate){
                    this.packData();
                    // console.log(this.battleCapture);
                    if(this.battleCapture.questions.length > 0){
                        this.events.emit('finishedPractice', {success: true, dataCapture: this.battleCapture, message: { title: "Saving progress", message : "Please do not exit."}, story: this.level } );
                    }
                }
                this.scene.wake('MainScene');
                this.scene.stop('BattleScene');
            }
        }, this);
        this.backButton.visible = false;
        this.add.existing(this.backButton);
        // console.log('quingina');

        this.player.sprite.on('animationcomplete', this.animComplete, this);
        this.enemy.sprite.on('animationcomplete', this.animCompleteEnemy, this);
        this.slash.on('animationcomplete', this.animCompleteSlash, this);

        this.cameras.main.once('camerafadeoutcomplete', function (camera) {
            // console.log('yow');
            this.packData();
            if(!this.simulate){
                this.events.emit('battleFinish', {success: this.player.hp > 0, dataCapture: this.battleCapture});
                this.scene.stop('BattleScene');
                this.scene.wake('DungeonScene');
            }


            // console.log('return this my nibba', this.battleCapture);
        }, this);

        this.events.once('closeScreen', this.closeScreen, this);

        this.enemyShake = this.tweens.add({
             targets: this.enemy.sprite,
             x: '-=16',
             duration: 50,
             ease: 'Sine.easeInOut',
             yoyo: true,
             repeat: 2,
             paused: true
         });

         this.playerShake = this.tweens.add({
              targets: this.player.sprite,
              x: '-=16',
              duration: 50,
              ease: 'Sine.easeInOut',
              yoyo: true,
              repeat: 2,
              paused: true
          });

          this.playerFlicker = this.tweens.add({
               targets: this.player.sprite,
               alpha: 0,
               duration: 50,
               ease: 'Sine.easeInOut',
               yoyo: true,
               repeat: 2,
               paused: true
           });

           this.enemyFlicker = this.tweens.add({
                targets: this.enemy.sprite,
                alpha: 0,
                duration: 50,
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: 2,
                paused: true
            });

            this.hitEnemy = this.tweens.add({
                targets: this.enemy.sprite,
                x: "-=50",
                duration: 500,
                ease: 'Power2',
                yoyo: true,
                paused: true
            });

            this.hitPlayer = this.tweens.add({
                targets: this.player.sprite,
                x: "+=50",
                duration: 500,
                ease: 'Power2',
                yoyo: true,
                paused: true
            });

            this.enemyShadow.setScale(2);
            this.playerShadow.setScale(2);
            this.enemyShadow.alpha = 0.5;
            this.playerShadow.alpha = 0.5;
            this.loading.visible = false;
    }

    hurtEnemy(){
        this.enemyFlicker.restart();
        this.enemyShake.restart();
        this.showSlash(this.enemy.sprite.x, this.enemy.sprite.y, true);
        this.cameras.main.flash(100);
        if(!this.simulate){ /* can be refactored similar to when wrong answer, timing on animation before damage */
            var hearts = this.enemyHealthDisplay.getChildren();
            hearts[hearts.length - 1].destroy();

            this.enemy.hp -=1;
        }
        this.sound.play('punch');
        this.sound.play('flicker');
        this.sound.play('unga');
    }
    hurtPlayer(){
        this.playerFlicker.restart();
        this.playerShake.restart();
        this.showSlash(this.player.sprite.x, this.player.sprite.y, false);
        this.sound.play('shake');
        this.sound.play('ugh');
        this.sound.play('minus');
    }
    enemyAttack(){
        this.hitEnemy.restart();
        this.enemy.sprite.play('enemy_attack', false);
    }
    playerAttack(){
        this.hitPlayer.restart();
        this.player.sprite.play('player_attack', false);
    }


    packData(){
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
    }

    animCompleteSlash(animation, frame){
        this.slash.visible = false;
        if(this.player.hp <= 0 || this.enemy.hp <= 0) {
            /* play death anim here */
            // console.log('fade out');
            this.events.emit('closeScreen');
            this.state = this.STATE_VALUE.close;

        }

    }

    animComplete(animation, frame){
        // console.log(animation.key);
        if(animation.key === 'player_attack' || animation.key === 'player_hurt'){
            // console.log('finish anim');
            this.player.sprite.play('idle', true);
            this.state = this.STATE_VALUE.idle;
        }
        if(animation.key === 'player_attack') {
            this.hurtEnemy();
        }

        /* handle death anim to change scene */
    }


    animCompleteEnemy(animation, frame){
        // console.log(animation.key);
        if(animation.key === 'enemy_attack' || animation.key === 'player_hurt'){
            // console.log('finish anim');
            this.enemy.sprite.play('enemy_idle', true);
        }

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
        this.playerShadow.x = this.player.sprite.x;
        this.enemyShadow.x = this.enemy.sprite.x;
        /* if player died or enemy died,  probably will add animations later */
        if(this.player.hp <= 0 || this.enemy.hp <= 0) {
            /* play death anim here */
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
        // console.log('time ends');
        this.timedEvent.remove(false);
        this.enemyAttack();
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
           duration: 500,
           yoyo: false,
           repeat: 0,
           onComplete: () => {
               /* duplicate */
               this.hurtPlayer();
               this.cameras.main.shake(100);
               this.state = this.STATE_VALUE.idle;
               // console.log('burado');
               if(!this.simulate){
                   var hearts = this.playerHealthDisplay.getChildren();
                   hearts[hearts.length - 1].destroy();
                   this.player.hp -=1;
               }
           }
       }, this);
   }

   showSlash(posX, posY, flip) {
       this.slash.visible = true;
       this.slash.x = posX;
       this.slash.y = posY;
       this.slash.play('slash', false);
       this.slash.setFlipX(flip);
       this.sound.play('slash');
   }
}
