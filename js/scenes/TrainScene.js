class TrainScene extends Phaser.Scene {

    constructor () {
        super('TrainScene');
    }

    init (data) {
        this.player = data.player;
        this.characterPool = data.characterPool;
        this.title = data.title;
        this.level = data.level;
        this.log = data.log;
        // console.log("ayyy ", this.characterPool);
    }

    preload () {

    }

    create () {
        game.playing = true;
        this.first = true;
        this.dataCapture = {
            name: this.title,
            accuracy: 0,
            timestamp: game.timestamp(),
            total_time: new Date(),
            mulcho: [],
            match: [],
            username: this.player.name
        }

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
            // console.log('yeman');
            this.scene.pause('TrainScene');
            this.scene.launch('MatchingTypeScene', {player: this.player, characterPool: this.characterPool});
        }, this);
        this.add.existing(matchingButton);

        var exitButton = new HiraButton(this, 720/2, 3*480/4, "Exit", style, () => {
            this.dataCapture.total_time = (new Date() - this.dataCapture.total_time)/1000;
            console.log(this.dataCapture.total_time);
            if(this.dataCapture.mulcho.length > 0 || this.dataCapture.match.length > 0){
                this.events.emit('finishedTraining', {success: true, dataCapture: this.dataCapture, message: { title: "Saving progress", message : "Please do not exit."}, story: this.level, log: this.log } );
            }

            // console.log('yeman');
            game.playing = false;
            this.scene.stop('TrainScene');
            this.scene.wake('MainScene', {player: this.player});
        }, this);
        this.add.existing(exitButton);

        let mulcho = this.scene.get('MultipleChoiceScene');
        mulcho.events.removeListener('mulchoFinish');
        mulcho.events.on('mulchoFinish', this.onMulchoFinish, this);

        let match = this.scene.get('MatchingTypeScene');
        match.events.removeListener('matchFinish');
        match.events.on('matchFinish', this.onMatchFinish, this);
    }
    update () {

    }
    onMulchoFinish (data) {
        if(data.played){
            if(this.first){
                this.first = false;
                this.dataCapture.accuracy = data.dataCapture.accuracy;
            } else {
                this.dataCapture.accuracy = (this.dataCapture.accuracy + data.dataCapture.accuracy)/2;
            }

            this.dataCapture.mulcho.push(data.dataCapture);
        }

        // console.log(this.dataCapture);
    }
    onMatchFinish (data) {
        if(data.played){
            if(this.first){
                this.first = false;
                this.dataCapture.accuracy = data.dataCapture.accuracy;
            } else {
                this.dataCapture.accuracy = (this.dataCapture.accuracy + data.dataCapture.accuracy)/2;
            }
            this.dataCapture.match.push(data.dataCapture);
        }

        // console.log(this.dataCapture);
    }
}
