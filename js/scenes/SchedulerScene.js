class SchedulerScene extends Phaser.Scene {

    constructor () {
        super('SchedulerScene');
    }
    init (data) {
        this.player = data.player;
        this.dungeon = data.dungeon;
    }
    preload() {
        this.container = this.add.graphics();


        this.container.lineStyle(game.global.UI_THICKNESS, game.global.UI_COLOR, 1);

        this.container.fillGradientStyle(game.global.UI_FILL_A, game.global.UI_FILL_A, game.global.UI_FILL_B, game.global.UI_FILL_B, game.global.UI_ALPHA);
        this.container.fillRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);
        this.container.strokeRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);

        this.messageTitle = new HiraText(this, 720/2, 90, "Set Schedule", "header");
        this.add.existing(this.messageTitle);


    }
    create () {



        var titleStyle = { font: "32px manaspc", fill: "#ffffff", align: "center" };
        var style = { font: "16px manaspc", fill: "#ffffff", align: "center", wordWrap: { width: 680 - 90, useAdvancedWrap: true} };
        // var caveName = this.add.text(58, 60, this.content.title , titleStyle);
        this.paunawa = new HiraText(this, 720/2, 1*480/4 + 50, "Please type in hours when do you plan on finishing the " + this.dungeon + ". Kindly type the earliest time you think you can finish this level. Minimum of 1, Maximum of 72.", "wordWrap", 400);
        this.add.existing(this.paunawa);

        this.timeInput = new HiraText(this, 720/2, 2*480/4, "_", "header");
        this.add.existing(this.timeInput);
        this.timeInputBottom = new HiraText(this, 720/2, 2*480/4 + 30, "hours", "basic");
        this.add.existing(this.timeInputBottom);

        this.input.keyboard.on('keydown', this.typedKeys, this);
        this.inputText = "";

        this.enterButton = new HiraButton(this, 720  - 60 - 30, 420, "Confirm", style, () => {
            var sched = new Date(game.timestamp());
            sched.setHours(sched.getHours() + parseInt(this.inputText));
            console.log(sched.toLocaleString("en-US", {timeZone: "Asia/Manila"}));
            var i = this.checkSchedExistence();
            if(i != -1){
                this.player.schedule[i].deadline = sched.toLocaleString("en-US", {timeZone: "Asia/Manila"});
            } else {
                this.player.schedule.push({deadline: sched.toLocaleString("en-US", {timeZone: "Asia/Manila"}), dungeon: this.dungeon});
            }
            console.log(this.player.schedule);
            this.events.emit('ScheduleMe', {deadline: sched.toLocaleString("en-US", {timeZone: "Asia/Manila"})});
            this.scene.stop('SchedulerScene');
        }, this);
        this.add.existing(this.enterButton);
        this.enterButton.disable();
        // var caveDesc = this.add.text(60, 130, this.content.desc, style);
        // var charSetDisplay = this.add.text(60, 90, this.content.subtitle, style);

    }
    checkSchedExistence() {

        for(let i = 0; i < this.player.schedule.length; i++) {
            if(this.player.schedule[i].dungeon === this.dungeon) {
                return i;
            }
        }
        return -1;
    }
    typedKeys (e) {
        this.parseText(e.keyCode, e.key);
        e.preventDefault();
    }
    parseText(keyCode, key) {
        if (keyCode >= 48 && keyCode <= 57)
        {
            if(this.inputText.length < 2) {
                this.sound.play('type');
                this.inputText += key
            } else {
                this.sound.play('disabled');
            }
            // console.log('you typed ', this.inputText);
        }
        else if (keyCode === 8) //backspace
        {
            if(this.inputText.length > 0) {
                this.sound.play('delete');
                this.inputText = this.inputText.slice(0, -1);
            } else {
                this.sound.play('disabled');
            }

        }
        if(this.inputText === "") {
            this.timeInput.setText("_");
        } else {
            this.timeInput.setText(this.inputText);
        }

        if(parseInt(this.inputText) > 0 && parseInt(this.inputText) <= 72) {
            this.enterButton.enable();
        } else {
            this.enterButton.disable();
        }
    }
}
