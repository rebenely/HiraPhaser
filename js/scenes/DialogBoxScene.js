class DialogBoxScene extends Phaser.Scene {

    constructor () {
        super('DialogBoxScene');
    }

    init (data) {
        this.message = data.message;
        this.title = data.title;
        this.api = data.api;
        if(this.api !== undefined) {
            this.url = data.api.url;
            this.payload = data.api.payload;
        }
    }
    create () {
        this.scene.pause('MainScene');

        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x003366 , 1);
        this.graphics.fillRect(90, 160, 540, 150);

        var titleStyle = { font: "32px manaspc", fill: "#ffffff", align: "left" };
        var style = { font: "16px manaspc", fill: "#ffffff", align: "left", wordWrap: { width: 680 - 180, useAdvancedWrap: true} };
        var caveName = this.add.text(90 + 30, 160 + 30, this.title, titleStyle);
        var caveDesc = this.add.text(90 + 30, 160 + 80, this.message, style);

        // this.cancelButton = new HiraButton(this, 720 - 60 - 30 - 60 - 30, 420, "Cancel", style, () => {
        //     console.log('fuck go back');
        //     this.scene.wake('MainScene');
        //     this.scene.stop('DetailScene');
        // }, this);
        // this.add.existing(this.cancelButton);
        //
        this.okayButton = new HiraButton(this, 90 + 540 - 80, 160 + 150 - 30, "Continue", style, () => {
            this.scene.wake('MainScene');
            this.scene.stop('DialogBoxScene');
        }, this);
        this.add.existing(this.okayButton);
    }
}
