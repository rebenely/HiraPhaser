class TrainScene extends Phaser.Scene {

    constructor () {
        super('TrainScene');
    }

    init (data) {
        this.player = data.player;
        this.characterPool = data.characterPool;
        this.title = data.title;
        console.log("ayyy ", this.characterPool);
    }

    preload () {

    }

    create () {

        this.container = this.add.graphics();
        this.container.lineStyle(game.global.UI_THICKNESS, game.global.UI_COLOR, 1);

        this.container.fillGradientStyle(game.global.UI_FILL_A, game.global.UI_FILL_A, game.global.UI_FILL_B, game.global.UI_FILL_B, game.global.UI_ALPHA);
        this.container.fillRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);
        this.container.strokeRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);

        var style = { font: "32px manaspc", fill: "#ffffff", align: "center" };
        // this.display = this.add.text(720/2, 480/3, 'Training Room', style);
        // this.display.setOrigin(0.5);

        this.display = new HiraText(this, 720/2, 480/3,  'Training Room', "header");
        this.add.existing(this.display);

        var mulchoButton = new HiraButton(this, (720)/3, 480/2, "Multiple Choice!", style, () => {
            console.log('yeman');
            this.scene.pause('TrainScene');
            this.scene.launch('MultipleChoiceScene', {player: this.player, characterPool: this.characterPool, title: this.title});
        }, this);
        this.add.existing(mulchoButton);

        var matchingButton = new HiraButton(this, 2*720/3, 480/2, "Matching Type!", style, () => {
            console.log('yeman');
            this.scene.pause('TrainScene');
            this.scene.launch('MatchingTypeScene', {player: this.player, characterPool: this.characterPool});
        }, this);
        this.add.existing(matchingButton);

        var exitButton = new HiraButton(this, 720/2, 3*480/4, "Exit", style, () => {
            console.log('yeman');
            this.scene.stop('TrainScene');
            this.scene.wake('MainScene', {player: this.player});
        }, this);
        this.add.existing(exitButton);
    }
    update () {

    }

}
