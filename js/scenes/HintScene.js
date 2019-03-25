class HintScene extends Phaser.Scene {

    constructor () {
        super('HintScene');
    }
    init (data) {
        this.player = data.player;
        this.characterPool = data.characterPool;
        this.inDungeon = data.inDungeon;
    }

    create () {
        this.isAlreadyPlaying = game.playing;
        game.playing = true;
        this.scene.bringToTop();
        this.move = 0;
        this.api = "api/review";
        this.payload = {total_time: new Date()};


        this.graphics = this.add.graphics();

        this.graphics.lineStyle(game.global.UI_THICKNESS, game.global.UI_COLOR, 1);

        this.graphics.fillGradientStyle(game.global.UI_FILL_A, game.global.UI_FILL_A, game.global.UI_FILL_B, game.global.UI_FILL_B, game.global.UI_ALPHA);
        this.graphics.fillRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);
        this.graphics.strokeRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);

        this.container = this.add.graphics();


        this.verticalCamera = this.cameras.add(720/2 - 680/2, 50, 680, 320);

        var cursors = this.input.keyboard.createCursorKeys();

        var controlConfig = {
            camera: this.verticalCamera,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            acceleration: 0.2,
            drag: 0.0005,
            maxSpeed: 0.2
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);


        var titleStyle = { font: "32px manaspc", fill: "#ffffff", align: "left" };
        var style = { font: "16px manaspc", fill: "#ffffff", align: "left", wordWrap: { width: 680 - 90, useAdvancedWrap: true} };
        this.titleDisplay = new HiraText(this,  640/2 + 20, 50, 'Cheat Sheet', "header");
        this.add.existing(this.titleDisplay);

        this.characterDisplay = [];
        this.romajiDisplay = [];
        // console.log(this.player.characterPool);
        var j = 0;
        var column = 0;
        var markN = false;
        for ( let i = 0; i < this.player.characterPool.length; i++ ) {


            // console.log(this.player.characterPool[i]);
            if(this.player.characterPool[i] !== "N"){
                if(column % 5 == 0) {
                    j++;
                    column = 0;
                }
                this.characterDisplay.push(this.add.bitmapText(680/(6) + column * 680/(6), 30+100*j, 'hira', Projectile.convertToHiragana(this.player.characterPool[i]), 48).setOrigin(0.5));
                this.romajiDisplay.push(new HiraText(this, 680/(6) + column * 680/(6), 70 + 100*j, this.player.characterPool[i], "basic"));

                this.add.existing(this.romajiDisplay[this.romajiDisplay.length - 1]);
                column++;
            } else {
                markN = true;
            }

        }
        if(markN) {
            column = 0;
            j++;
            this.characterDisplay.push(this.add.bitmapText(680/(6) + column * 680/(6), 30+100*j, 'hira', Projectile.convertToHiragana("N"), 48).setOrigin(0.5));
            this.romajiDisplay.push(new HiraText(this, 680/(6) + column * 680/(6), 70 + 100*j, "N", "basic"));

            this.add.existing(this.romajiDisplay[this.romajiDisplay.length - 1]);
        }

        this.cancelButton = new HiraButton(this, 720  - 60 - 30, 420, "Exit", style, () => {

            this.cancelButton.setText('Syncing');
            this.cancelButton.disable();

            if(!this.inDungeon){
                this.payload.total_time = (new Date() - this.payload.total_time)/1000;
            }
            this.postData();


        }, this);
        this.add.existing(this.cancelButton);


        this.downButton = new HiraPress(this, 90, 430, "Down", style, () => {
            this.move = 5;
        }, this, true);
        this.add.existing(this.downButton);
        this.downButton.visible = false;

        this.upButton = new HiraPress(this, 90, 400, "Up", style, () => {
            this.move = -5;
        }, this);
        this.add.existing(this.upButton);
        this.upButton.visible = false;

        // console.log(j* 100 + 5);
        this.cameras.main.ignore([this.characterDisplay, this.romajiDisplay, this.container, this.titleDisplay]);
        this.verticalCamera.ignore([this.cancelButton, this.downButton, this.upButton, this.graphics]);
        this.container.fillGradientStyle(game.global.UI_FILL_B, game.global.UI_FILL_A, game.global.UI_FILL_A, game.global.UI_FILL_B, 1);
        this.container.lineStyle(game.global.UI_THICKNESS + 2, game.global.UI_COLOR, 1);
        if(this.romajiDisplay.length > 0) {
            this.container.fillRect(720/2 - 680/2, 0, 640,  this.romajiDisplay[this.romajiDisplay.length - 1].y + 50);
            this.container.strokeRect(720/2 - 680/2, 0, 640,  this.romajiDisplay[this.romajiDisplay.length - 1].y + 50);
            this.verticalCamera.setBounds(0, 0, 680, this.romajiDisplay[this.romajiDisplay.length - 1].y + 50);

            this.upButton.visible = true;
            this.downButton.visible = true;
        } else {
            var warningDisplay = new HiraText(this,  720/2, 480/2, 'No data yet!', "header");
            this.add.existing(warningDisplay);
            this.verticalCamera.ignore([warningDisplay]);

        }

        this.sound.play('next');


        // console.log(this.world);
    }


    update (time, delta) {
        this.controls.update(delta);
        if(this.move > 0) {
            this.verticalCamera.scrollY += 5;
            this.move -= 1;
        } else if (this.move < 0) {
            this.verticalCamera.scrollY -= 5;
            this.move += 1;
        }
    }

    postData() {
        if(this.inDungeon){
            $.ajax({
                url: game.global.URL + this.api,
                type: "POST",
                async: true,
                contentType: "application/json",
                headers: {"Authorization": "Bearer " + game.token },
                context: this,
                retryLimit: 3,
                success: function (responseData) {
                    this.sound.play('success');

                    if(!this.isAlreadyPlaying) {
                        game.playing = false;
                    }
                    // console.log('fuck go back');
                    if(this.inDungeon){
                        this.scene.wake('DungeonScene');
                    } else {
                        this.scene.wake('MainScene');
                    }
                    this.scene.stop('HintScene');
                },
                error: function (xhr) {
                    setTimeout(() => {
                        this.titleDisplay.setTextUpper("Contacting server...");
                        this.postData();
                    }, 5000);

                }
            });
        } else {
            $.ajax({
                url: game.global.URL + this.api,
                type: "POST",
                async: true,
                contentType: "application/json",
                data: JSON.stringify(this.payload),
                headers: {"Authorization": "Bearer " + game.token },
                context: this,
                retryLimit: 3,
                success: function (responseData) {
                    this.sound.play('success');

                    if(!this.isAlreadyPlaying) {
                        game.playing = false;
                    }
                    // console.log('fuck go back');
                    if(this.inDungeon){
                        this.scene.wake('DungeonScene');
                    } else {
                        this.scene.wake('MainScene');
                    }
                    this.scene.stop('HintScene');
                },
                error: function (xhr) {
                    setTimeout(() => {
                        this.titleDisplay.setTextUpper("Contacting server...");
                        this.postData();
                    }, 5000);

                }
            });
        }

    }
}
