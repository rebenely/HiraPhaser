class DialogBoxScene extends Phaser.Scene {

    constructor () {
        super('DialogBoxScene');
    }

    init (data) {
        this.message = data.message;
        this.title = data.title;
        this.api = data.api;
        // if(this.api !== undefined) {
        //     this.url = data.api.url;
        //     this.payload = data.api.payload;
        // }

        if(data.dataCapture !== undefined){
            this.payload = data.dataCapture;
            this.payload.story = data.story;
            this.apiRequest = true;
        } else {
            this.apiRequest = false;
        }
    }
    create () {
        this.scene.pause('MainScene');
        console.log(this.api);
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(game.global.UI_THICKNESS, game.global.UI_COLOR, 1);

        this.graphics.fillGradientStyle(game.global.UI_FILL_A, game.global.UI_FILL_A, game.global.UI_FILL_B, game.global.UI_FILL_B,  game.global.UI_ALPHA);
        this.graphics.fillRect(90, 160, 540, 150);
        this.graphics.strokeRect(90, 160, 540, 150);


        var titleStyle = { font: "32px manaspc", fill: "#ffffff", align: "left" };
        var style = { font: "16px manaspc", fill: "#ffffff", align: "left", wordWrap: { width: 680 - 180, useAdvancedWrap: true} };


        this.dialogTitle = new HiraText(this, 90 + 30, 160 + 30, this.title, "header");
        this.dialogTitle.setOrigin(0);
        this.add.existing(this.dialogTitle);
        this.dialogMessage = new HiraText(this, 90 + 30, 160 + 80, this.message, "basic");
        this.dialogMessage.setOrigin(0);
        this.add.existing(this.dialogMessage);

        // this.cancelButton = new HiraButton(this, 720 - 60 - 30 - 60 - 30, 420, "Cancel", style, () => {
        //     console.log('fuck go back');
        //     this.scene.wake('MainScene');
        //     this.scene.stop('DetailScene');
        // }, this);
        // this.add.existing(this.cancelButton);
        //
        if(this.apiRequest){
            console.log(this.payload);
            this.postData();
        }

    }


    postData() {
        $.ajax({
            url: game.global.URL + this.api,
            type: "POST",
            async: true,
            data: JSON.stringify(this.payload),
            contentType: "application/json",
            context: this,
            retryLimit: 3,
            success: function (responseData) {
                console.log('ahahah', JSON.stringify(this.payload));
                var style = { font: "16px manaspc", fill: "#ffffff", align: "left", wordWrap: { width: 680 - 180, useAdvancedWrap: true} };
                this.okayButton = new HiraButton(this, 90 + 540 - 80, 160 + 150 - 30, "Continue", style, () => {
                    this.scene.wake('MainScene');
                    this.scene.stop('DialogBoxScene');
                }, this);
                this.add.existing(this.okayButton);
            },
            error: function (xhr) {
                setTimeout(() => {
                    this.dialogTitle.setText("Retrying");
                    this.dialogMessage.setText("Unable to connect to server...");
                    this.postData();
                }, 5000);

            }
        });
    }
}
