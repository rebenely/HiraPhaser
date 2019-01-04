class HintScene extends Phaser.Scene {

    constructor () {
        super('HintScene');
    }
    init (data) {
        this.player = data.player;
        this.characterPool = data.characterPool;
    }

    create () {
        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x003366 , 1);
        this.graphics.fillRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);

        this.container = this.add.graphics();


        this.verticalCamera = this.cameras.add(720/2 - 680/2, 50, 680, 320);

        var cursors = this.input.keyboard.createCursorKeys();

        var controlConfig = {
            camera: this.verticalCamera,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            acceleration: 0.04,
            drag: 0.00025,
            maxSpeed: 1.0
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);


        var titleStyle = { font: "32px manaspc", fill: "#ffffff", align: "left" };
        var style = { font: "16px manaspc", fill: "#ffffff", align: "left", wordWrap: { width: 680 - 90, useAdvancedWrap: true} };
        var titleDisplay = this.add.text( 640/2 + 20, 50, 'Cheat Sheet', style).setOrigin(0.5);

        this.characterDisplay = [];
        this.romajiDisplay = [];
        console.log(this.player.characterPool);
        var j = 0;
        var column = 0;
        for ( let i = 0; i < this.player.characterPool.length; i++ ) {

            if(i % 5 == 0) {
                j++;
                column = 0;
            }
            this.characterDisplay.push(this.add.bitmapText(680/(6) + column * 680/(6), 100*j, 'hira', Projectile.convertToHiragana(this.player.characterPool[i]), 48).setOrigin(0.5));
            this.characterDisplay.push(this.add.text(680/(6) + column * 680/(6), 50 + 100*j, this.player.characterPool[i], style).setOrigin(0.5));
            column++;
        }

        this.cancelButton = new HiraButton(this, 720  - 60 - 30, 420, "Cancel", style, () => {
            // console.log('fuck go back');
            this.scene.wake('DungeonScene');
            this.scene.stop('HintScene');
        }, this);
        this.add.existing(this.cancelButton);
        console.log(j* 100 + 5);
        this.cameras.main.ignore([this.characterDisplay, this.romajiDisplay, this.container, titleDisplay]);
        this.verticalCamera.ignore([this.cancelButton]);
        this.container.fillStyle(0x000d1a, 1);
        this.container.fillRect(720/2 - 680/2, 0, 640,  j*100 + 100);
        this.verticalCamera.setBounds(0, 0, 680, j*100 + 100);

    }


    update (time, delta) {
        this.controls.update(delta);
    }
}
