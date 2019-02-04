class MessageScene extends Phaser.Scene {

    constructor () {
        super('MessageScene');
    }
    init (data) {
        this.message = data.message;
    }
    create () {
        this.container = this.add.graphics();


        this.container.lineStyle(game.global.UI_THICKNESS, game.global.UI_COLOR, 1);

        this.container.fillGradientStyle(game.global.UI_FILL_A, game.global.UI_FILL_A, game.global.UI_FILL_B, game.global.UI_FILL_B, game.global.UI_ALPHA);
        this.container.fillRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);
        this.container.strokeRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);



        var titleStyle = { font: "32px manaspc", fill: "#ffffff", align: "left" };
        var style = { font: "16px manaspc", fill: "#ffffff", align: "left", wordWrap: { width: 680 - 90, useAdvancedWrap: true} };
        // var caveName = this.add.text(58, 60, this.content.title , titleStyle);
        var messageTitle = new HiraText(this, 720/2, 90, this.message.title, "header");
        this.add.existing(messageTitle);
        var messageContent = new HiraText(this, 720/2, 480/2, this.message.body, "wordWrap", 680 - 90);
        this.add.existing(messageContent);
        // var caveDesc = this.add.text(60, 130, this.content.desc, style);
        // var charSetDisplay = this.add.text(60, 90, this.content.subtitle, style);

        this.okayButton = new HiraButton(this, 720/2, 420, "Got it!", style, () => {
            // console.log('fuck go back');
            this.scene.wake('MainScene');
            this.scene.stop('MessageScene');

        }, this);
        this.add.existing(this.okayButton);


    }
}
