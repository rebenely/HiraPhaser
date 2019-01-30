class MultipleChoiceScene extends Phaser.Scene {

    constructor () {
        super('MultipleChoiceScene');
    }

    init (data) {
        this.player = data.player;
        this.characterPool = data.characterPool.slice();
        this.characterDisplayPool = data.characterPool.slice();
        this.title = data.title;
        console.log(data);
    }

    preload () {

    }

    create () {
        this.stat = {
            answer: '',
            target: '',
            time: 0
        }


        this.dataCapture = {
            name: this.title,
            asked: 0,
            total_time: this.time.now/1000,
            questions: []
        };
        console.log(this.dataCapture);
        this.maxQuestions = 10;

        this.anims.remove('slash');
        this.anims.create({
            key: 'slash',
            frames: this.anims.generateFrameNumbers('kidlatslash', { frames: [ 0, 1, 2, 3, 4, 5, 6] }),
            frameRate: 20,
            repeat: 0
        });


        this.container = this.add.graphics();
        this.container.lineStyle(game.global.UI_THICKNESS, game.global.UI_COLOR, 1);

        this.container.fillGradientStyle(game.global.UI_FILL_A, game.global.UI_FILL_A, game.global.UI_FILL_B, game.global.UI_FILL_B, 1);
        this.container.fillRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);
        this.container.strokeRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);

        this.targetChar = new Projectile(this, 720/2, 480/4, 'hira', this.characterPool);
        this.add.existing(this.targetChar);
        this.targetChar.visible = false;

        this.slash = this.add.sprite(720/2, 240, 'kidlatslash');
        this.slash.setScale(4);
        this.slash.setOrigin(0.5);
        this.slash.visible = false;
        this.slash.anims.play('slash');

        this.slash.on('animationcomplete', this.animCompleteSlash, this);

        this.targetChar.getRandomCharacter();

        this.counter = 0;

        this.buttonArray = [];
        this.selected = '';
        var style = { font: "32px manaspc", fill: "#ffffff", align: "center" };

        // this.display = this.add.text(720/2, 2*480/3, '0/' + this.maxQuestions.toString(), style);
        this.display = new HiraText(this, 2*720/3, 2*480/3, '0/' + this.maxQuestions.toString(), "header");
        this.add.existing(this.display);
        this.helpMessage = new HiraText(this, 720/2, 1*480/3, 'Select the correct Hiragana character!', "basic");
        this.add.existing(this.helpMessage);
        this.display.visible = false;
        this.timeDisplay = new HiraText(this, 720/3, 2*480/3, 'time: 0', "header");
        this.add.existing(this.timeDisplay);
        this.timeDisplay.visible = false;

        for ( let i = 0; i < this.characterDisplayPool.length; i++ ){
            let value = this.characterDisplayPool[i];
            console.log(value);

            this.add.existing(new HiraButton(this, (700/this.characterDisplayPool.length + 1) +  i*700/(this.characterDisplayPool.length+1), 480/2, '[' + value + ']', style,
                () => {
                    console.log(value, i, 'vs', this.targetChar.currentChar);
                    this.dataCapture.questions.push({
                        answer: value,
                        target: this.targetChar.currentChar,
                        time: this.time.now/1000 - this.charTime
                    });
                    this.charTime = this.time.now/1000;
                    if(value === this.targetChar.currentChar && this.targetChar.visible === true) {
                        this.counter++;
                        console.log(this.counter);
                        this.targetChar.getRandomCharacter();
                        this.showSlash(720/2, 480/4, false);

                        if(this.counter >= this.maxQuestions) {
                            console.log(this.dataCapture);
                            this.targetChar.say("SA-SU-GA");
                            this.closeButton.visible = true;
                            this.display.visible = false;
                            this.timeDisplay.visible = false;
                            this.dataCapture.total_time = this.time.now/1000 - this.startTime;
                        }
                    } else {
                        this.cameras.main.shake(100);
                    }
                }
            )).setOrigin(0.5);
        }

        this.closeButton = new HiraButton(this, 720/2, 2*480/3, "Continue", style, () => {
            this.scene.stop('MultipleChoiceScene');
            this.scene.wake('TrainScene', {player: this.player, characterPool: this.characterPool});
        }, this);
        this.add.existing(this.closeButton);
        this.closeButton.visible = false;

        this.startButton = new HiraButton(this, 720/2, 2*480/3, "Start", style, () => {
            this.timeDisplay.visible = true;
            this.display.visible = true;
            this.startButton.visible = false;
            this.targetChar.visible = true;
            this.helpMessage.visible = false;
            this.startTime = this.time.now/1000;
            this.charTime =  this.time.now/1000;
            this.dataCapture.total_time = this.startTime;
            console.log(this.time.now/1000);
        }, this);
        this.add.existing(this.startButton);


    }

    update () {
        this.display.setText(this.counter.toString() + '/' + this.maxQuestions.toString());
        this.display.setOrigin(0.5);
        this.timeDisplay.setText('Time: ' + (this.time.now/1000 - this.startTime).toString().substr(0, 4));
    }

    checkValue(e) {
        console.log(e);
    }

    showSlash(posX, posY, flip) {
        this.slash.visible = true;
        this.slash.x = posX;
        this.slash.y = posY;
        this.slash.play('slash', false);
        this.slash.setFlipX(flip);
    }

    animCompleteSlash(animation, frame){
        this.slash.visible = false;
    }
}
