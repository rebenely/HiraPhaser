class LogScene extends Phaser.Scene {

    constructor () {
        super('LogScene');
    }
    init (data) {
        this.player = data.player;
    }

    create () {
        this.scene.bringToTop();
        this.move = 0;

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
        var titleDisplay = new HiraText(this,  640/2 + 20, 50, 'Story so far', "header");
        this.add.existing(titleDisplay);

        this.characterDisplay = [];
        this.romajiDisplay = [];
        // console.log(this.player.characterPool);
        var j = 0;
        var column = 0;
        this.borders = this.add.graphics();
        this.borders.lineStyle(game.global.UI_THICKNESS + 2, game.global.UI_COLOR, 1);
        var currentHeight = 100;
        for ( let i = 0; i < this.player.logs.length; i++ ) {

            this.romajiDisplay.push(new HiraText(this, 65, currentHeight + 25, this.player.logs[i].log, "wordWrapL", 600));
            currentHeight = this.romajiDisplay[i].y - 10 + this.romajiDisplay[i].height + 24;
            this.romajiDisplay[i].setOrigin(0);
            this.borders.strokeRect(50, this.romajiDisplay[i].y - 10, 580, this.romajiDisplay[i].height + 24);
            this.add.existing(this.romajiDisplay[i]);
        }

        this.cancelButton = new HiraButton(this, 720  - 60 - 30, 420, "Back", style, () => {
            // console.log('fuck go back');
            this.scene.wake('JournalScene');
            this.scene.stop('LogScene');
        }, this);
        this.add.existing(this.cancelButton);

        this.downButton = new HiraPress(this, 90, 430, "Down", style, () => {
            this.move = 5;
        }, this, true);
        this.add.existing(this.downButton);

        this.upButton = new HiraPress(this, 90, 400, "Up", style, () => {
            this.move = -5;
        }, this);
        this.add.existing(this.upButton);
        var warningDisplay = new HiraText(this,  720/2, 480/2, 'No data yet!', "header");

        // console.log(j* 100 + 5);
        this.cameras.main.ignore([this.characterDisplay, this.romajiDisplay, this.container, titleDisplay, this.borders]);
        this.verticalCamera.ignore([this.cancelButton, this.downButton, this.upButton, this.graphics, warningDisplay]);
        this.container.fillGradientStyle(game.global.UI_FILL_B, game.global.UI_FILL_A, game.global.UI_FILL_A, game.global.UI_FILL_B, 1);
        this.container.lineStyle(game.global.UI_THICKNESS + 2, game.global.UI_COLOR, 1);

        if(this.romajiDisplay.length > 0) {
            this.container.fillRect(720/2 - 680/2, 0, 640, this.romajiDisplay[this.romajiDisplay.length - 1].y + this.romajiDisplay[this.romajiDisplay.length - 1].height + 36);
            this.container.strokeRect(720/2 - 680/2, 0, 640,  this.romajiDisplay[this.romajiDisplay.length - 1].y + this.romajiDisplay[this.romajiDisplay.length - 1].height + 36);
            this.verticalCamera.setBounds(0, 0, 680, this.romajiDisplay[this.romajiDisplay.length - 1].y + this.romajiDisplay[this.romajiDisplay.length - 1].height + 36);
        } else {
            this.controls.stop();
            this.add.existing(warningDisplay);
            this.downButton.visible = false;
            this.upButton.visible = false;
        }

        this.sound.play('next');
        this.borders.setDepth(3);
        // console.log(this.world);
    }


    update (time, delta) {
        this.controls.update(delta);
        if(this.move > 0) {
            this.verticalCamera.scrollY += 10;
            this.move -= 1;
        } else if (this.move < 0) {
            this.verticalCamera.scrollY -= 10;
            this.move += 1;
        }
    }
}
