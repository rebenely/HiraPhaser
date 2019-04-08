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
        this.paunawa = new HiraText(this, 720/2, 1*480/4 + 50, "Please type in hours when do you plan on finishing the " + this.dungeon + ". Kindly type how much time you think you will spend on finishing this family of hiragana syllables. Minimum of 1 minute, Maximum of 72 hours.", "wordWrap", 400);
        this.add.existing(this.paunawa);
        this.hoursSelected = true;
        this.timeInput = new HiraText(this, 7*720/16, 2*480/4, "_", "header");
        this.add.existing(this.timeInput);
        this.timeInput1 = new HiraText(this, 9*720/16, 2*480/4, "_", "header");
        this.add.existing(this.timeInput1);
        this.timeInputBottom = new HiraButton(this, 7*720/16, 2*480/4 + 30, "hours", style, () => {
            this.hoursSelected = true;
            this.timeInputBottom.setTint(game.global.UI_TEXT_HIGHLIGHT);
            this.timeInputBottom1.clearTint();
        }, this);
        this.add.existing(this.timeInputBottom);
        this.timeInputBottom.setTint(game.global.UI_TEXT_HIGHLIGHT);
        this.timeInputBottom.longpress = true;
        this.timeInputBottom1 = new HiraButton(this, 9*720/16, 2*480/4 + 30, "mins", style, () => {
            this.hoursSelected = false;
            this.timeInputBottom1.setTint(game.global.UI_TEXT_HIGHLIGHT);
            this.timeInputBottom.clearTint();
        }, this);
        this.add.existing(this.timeInputBottom1);
        this.timeInputBottom1.longpress = true;
        this.compute = new HiraText(this, 720/2, 2*480/3,  '', "header");
        this.add.existing(this.compute);
        this.compute.visible = false;

        this.input.keyboard.on('keydown', this.typedKeys, this);
        this.inputText = "";
        this.inputText1 = "";

        this.enterButton = new HiraButton(this, 720  - 60 - 30, 420, "Confirm", style, () => {
            // console.log(sched.toLocaleString("en-US", {timeZone: "Asia/Manila"}));
            this.submitConfirm();
        }, this);
        this.add.existing(this.enterButton);
        this.enterButton.disable();

        this.input.keyboard.addKey(8);
        this.egg = new HiraText(this, 60, 428, "nice", "basic");
        this.add.existing(this.egg);
        this.egg.visible = false;
        // var caveDesc = this.add.text(60, 130, this.content.desc, style);
        // var charSetDisplay = this.add.text(60, 90, this.content.subtitle, style);

    }
    submitConfirm () {
        var i = this.checkSchedExistence();
        if(i != -1){
            this.player.schedule[i].deadline = this.sched.format('MM/DD/YYYY, hh:mm:ss A');
        } else {
            this.player.schedule.push({deadline: this.sched.format('MM/DD/YYYY, hh:mm:ss A'), dungeon: this.dungeon});
        }
        // console.log(this.player.schedule);
        this.events.emit('ScheduleMe', {deadline: this.sched.format('MM/DD/YYYY, hh:mm:ss A')});
        this.scene.stop('SchedulerScene');
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
        e.preventDefault();
        this.parseText(e.keyCode, e.key);
        return false;

    }
    parseText(keyCode, key) {
        if (keyCode === 13) {
            if(this.enterButton.enabled) {
                this.submitConfirm();
            } else {
                this.sound.play('disabled');
            }
        } //enter
        if (keyCode >= 48 && keyCode <= 57)
        {
            if(this.hoursSelected){
                if(this.inputText.length < 2) {
                    this.sound.play('type');
                    this.inputText += key
                } else {
                    this.sound.play('disabled');
                }
            } else {
                if(this.inputText1.length < 2) {
                    this.sound.play('type');
                    this.inputText1 += key
                } else {
                    this.sound.play('disabled');
                }
            }

            // console.log('you typed ', this.inputText);
        }
        else if (keyCode === 8) //backspace
        {
            if(this.hoursSelected){
                if(this.inputText.length > 0) {
                    this.sound.play('delete');
                    this.inputText = this.inputText.slice(0, -1);
                } else {
                    this.sound.play('disabled');
                }

            } else {
                if(this.inputText1.length > 0) {
                    this.sound.play('delete');
                    this.inputText1 = this.inputText1.slice(0, -1);
                } else {
                    this.sound.play('disabled');
                }

            }

        }
        if(this.inputText === "") {
            this.timeInput.setText("_");
        } else {
            this.timeInput.setText(this.inputText);
        }

        if(this.inputText1 === "") {
            this.timeInput1.setText("_");
        } else {
            this.timeInput1.setText(this.inputText1);
        }

        if(parseInt(this.inputText) >= 0 && parseInt(this.inputText) <= 72) {
            if(parseInt(this.inputText1) > 0 && parseInt(this.inputText1) <= 59 || (parseInt(this.inputText1) == 0 && parseInt(this.inputText) != 0)) {
                if(parseInt(this.inputText) == 72 && parseInt(this.inputText1) != 0) {
                    this.enterButton.disable();
                    this.compute.visible = false;
                } else {
                    this.enterButton.enable();
                    this.sched = moment().add(parseInt(this.inputText), 'hours').add(parseInt(this.inputText1), 'minutes');

                    this.compute.setText("from now would be on\n" + this.sched.format('MM/DD/YYYY, hh:mm:ss A'));
                    this.compute.visible = true;
                    if((parseInt(this.inputText) == 4 && parseInt(this.inputText1) == 20 || (parseInt(this.inputText) == 6 && parseInt(this.inputText1) == 9))) {
                        this.egg.visible = true;
                    } else {
                        this.egg.visible = false;
                    }
                }

            } else {
                this.enterButton.disable();
                this.compute.visible = false;
            }
        } else {
            this.enterButton.disable();
            this.compute.visible = false;
        }
    }
}
