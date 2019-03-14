class StatsScene extends Phaser.Scene {

    constructor () {
        super('StatsScene');
    }
    init (data) {
        this.player = data.player;
    }
    preload() {
        this.container = this.add.graphics();


        this.container.lineStyle(game.global.UI_THICKNESS, game.global.UI_COLOR, 1);

        this.container.fillGradientStyle(game.global.UI_FILL_A, game.global.UI_FILL_A, game.global.UI_FILL_B, game.global.UI_FILL_B, game.global.UI_ALPHA);
        this.container.fillRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);
        this.container.strokeRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);

        this.messageTitle = new HiraText(this, 720/2, 90, "Player Stats", "header");
        this.add.existing(this.messageTitle);
    }
    create () {
        this.api = 'api/stats';
        this.getData();

        var titleStyle = { font: "32px manaspc", fill: "#ffffff", align: "center" };
        var style = { font: "16px manaspc", fill: "#ffffff", align: "center", wordWrap: { width: 680 - 90, useAdvancedWrap: true} };
        // var caveName = this.add.text(58, 60, this.content.title , titleStyle);
        this.loader = new HiraText(this, 720/2, 480/2, "** Loading **", "header");
        this.add.existing(this.loader);

        this.accuracyDisplay = new HiraText(this, 720/2, 160, "** Accuracy **", "header");
        this.add.existing(this.accuracyDisplay);
        this.accuracyDisplay.visible = false;

        this.trainDisplay = new HiraText(this, 720/4, 220, "Train --", "basic");
        this.add.existing(this.trainDisplay);
        this.trainDisplay.visible = false;

        this.practiceDisplay = new HiraText(this, 2*720/4, 220, "Practice --", "basic");
        this.add.existing(this.practiceDisplay);
        this.practiceDisplay.visible = false;

        this.dungeonDisplay = new HiraText(this, 3*720/4, 220, "Dungeon --", "basic");
        this.add.existing(this.dungeonDisplay);
        this.dungeonDisplay.visible = false;

        this.progressDisplay = new HiraText(this, 720/2, 280, "** Progress **", "header");
        this.add.existing(this.progressDisplay);
        this.progressDisplay.visible = false;

        this.completionDisplay = new HiraText(this, 720/3, 340, "Completion --", "basic");
        this.add.existing(this.completionDisplay);
        this.completionDisplay.visible = false;

        this.scoreDisplay = new HiraText(this, 2*720/3, 340, "Score 100", "basic");
        this.add.existing(this.scoreDisplay);
        this.scoreDisplay.visible = false;

        // var caveDesc = this.add.text(60, 130, this.content.desc, style);
        // var charSetDisplay = this.add.text(60, 90, this.content.subtitle, style);

        this.okayButton = new HiraButton(this, 720/2, 420, "Exit", style, () => {
            // console.log('fuck go back');
            this.scene.wake('MainScene');
            this.scene.stop('StatsScene');

        }, this);
        this.add.existing(this.okayButton);
        this.okayButton.visible = false;
    }
    getData() {
        $.ajax({
            url: game.global.URL + this.api,
            type: "GET",
            async: true,
            contentType: "application/json",
            headers: {"Authorization": "Bearer " + game.token },
            context: this,
            retryLimit: 3,
            success: function (responseData) {
                this.loader.visible = false;
                this.accuracyDisplay.visible = true;
                if(responseData.stats.train_ave){
                    this.trainDisplay.setText('Train ' + game.roundOff(responseData.stats.train_ave).toString() + '%');
                }
                this.trainDisplay.visible = true;
                if(responseData.stats.practice_ave){
                    this.practiceDisplay.setText('Practice ' + game.roundOff(responseData.stats.practice_ave).toString() + '%');
                }
                this.practiceDisplay.visible = true;
                if(responseData.stats.dungeon_ave){
                    this.dungeonDisplay.setText('Dungeon ' + game.roundOff(responseData.stats.dungeon_ave).toString() + '%');
                }
                this.dungeonDisplay.visible = true;
                this.completionDisplay.setText('Completion ' + game.roundOff(this.player.story / 10).toString() + '%');
                this.progressDisplay.visible = true;
                this.completionDisplay.visible = true;
                this.scoreDisplay.visible = true;
                console.log('success', responseData);
                this.okayButton.visible = true;
            },
            error: function (xhr) {
                setTimeout(() => {
                    console.log('Error contacting server');
                    this.getData();
                }, 5000);

            }
        });
    }
}
