class TrainScene extends Phaser.Scene {

    constructor () {
        super('TrainScene');
    }

    init (data) {
        this.player = data.player;
        this.characterPool = data.characterPool;
    }

    preload () {

    }

    create () {

        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x003366 , 1);
        this.graphics.fillRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);
        var style = { font: "32px manaspc", fill: "#ffffff", align: "center" };
        this.display = this.add.text(720/2, 480/3, 'Training Room', style);
        this.display.setOrigin(0.5);

        var mulchoButton = new HiraButton(this, ((720 - 680)/2 + 680)/3, 480/2, "Multiple Choice!", style, () => {
            console.log('yeman');
            this.scene.pause('TrainScene');
            this.scene.launch('MultipleChoiceScene', {player: this.player, characterPool: this.characterPool});
        }, this);
        this.add.existing(mulchoButton);

        var matchingButton = new HiraButton(this, 2*((720 - 680)/2 + 680)/3, 480/2, "Matching Choice!", style, () => {
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
