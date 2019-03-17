class CutScene extends Phaser.Scene {

    constructor () {
        super('CutScene');
    }

    init (data) {
        this.jsonFile = data.jsonFile;
        this.story = data.story;
        this.log = data.log;
    }

    preload () {
        this.loading = new HiraText(this, 720/2, 480/2, "Loading", "header");
        this.add.existing(this.loading);
        this.timeIn = new Date();
        this.timestampIn = game.timestamp();

        for (var property in this.jsonFile['images']) {
            if (this.jsonFile['images'].hasOwnProperty(property)) {
                this.load.image(property.toString(),  this.jsonFile['images'][property]);
                // console.log(property.toString(), this.jsonFile['images'][property]);
                if(property.toString().search("_bg") != -1) {
                    // console.log(property.toString());
                    this.bgKey = property.toString(); /* what if multiple bg */
                }
            }
        }

        this.dialogIterator = 1; this.maxIterator = this.jsonFile['dialog'].length;

        this.messageArray = [];
        for(let i = 0; i < this.maxIterator; i++){
            this.messageArray.push(this.jsonFile['dialog'][i]);
        }
    }

    create() {
        // var bg = this.add.sprite(720/2, 480/2, this.bgKey);
        // console.log('image resize', this.jsonFile.image.x, this.jsonFile.image.y, this.jsonFile.image.scale);
        this.npc = this.add.sprite(parseInt(this.jsonFile.image.x, 10), parseInt(this.jsonFile.image.y, 10), this.jsonFile['dialog'][0].image);
        this.npc.setScale(Number(this.jsonFile.image.scale));
        this.npc.setOrigin(0.5);
        this.npc.setDepth(3);

        var style = { font: "16px manaspc", fill: game.global.UI_TEXT_FILL, align: "left", wordWrap: { width: 660, useAdvancedWrap: true} };
        var titleStyle = { font: "32px manaspc", fill:  game.global.UI_TEXT_FILL, align: "center" };


        this.hiraText = this.add.bitmapText(720/2, 480/2, 'hira', '');
        this.hiraText.setOrigin(0.5);
        this.hiraText.visible = false;
        this.hiraText.setDepth(7);

        this.dialogBox = this.add.graphics();
        this.dialogBox.setDepth(4);
        this.dialogBox.lineStyle(game.global.UI_THICKNESS, game.global.UI_COLOR, 1);
        this.dialogBox.fillStyle(game.global.UI_FILL_A , 0.7);
        this.dialogBox.fillRect(10, 480 - 120, 700, 100);
        this.dialogBox.strokeRect(10, 480 - 120, 700, 100);

        // this.nameBox = this.add.graphics();
        // this.nameBox.lineStyle(game.global.UI_THICKNESS, game.global.UI_COLOR, 1);
        // this.nameBox.fillStyle(game.global.UI_FILL_B , 1);
        // this.nameBox.fillRect(10, 480 - 145, 100, 48);
        // this.nameBox.strokeRect(10, 480 - 145, 100, 48);

        this.dialogName = new HiraText(this, 30, 480 - 120, this.jsonFile['dialog'][0]['name'], "header");
        this.dialogName.setDepth(5);
        this.add.existing(this.dialogName);

        // console.log(this.jsonFile['dialog'][0]['message']);
        // this.dialogName = this.add.text(60, 480 -120, this.jsonFile['dialog'][0]['name'], titleStyle);
        // this.dialogName.setOrigin(0.5);

        this.dialogText = new HiraText(this, 40, 480 - 75, this.jsonFile['dialog'][0]['message'], "wordWrapL", 660);
        this.dialogText.setDepth(5);
        this.add.existing(this.dialogText);
        this.dialogName.setOrigin(0);
        this.dialogText.setOrigin(0);

        // this.dialogText = this.add.text(40, 480 - 80, this.jsonFile['dialog'][0]['message'], style);

        this.dialogIterator = 1; this.maxIterator = this.jsonFile['dialog'].length;

        this.input.keyboard.on('keyup', this.typedKeys, this);
        this.input.on('pointerup', this.nextPage, this);
        this.cameras.main.setBackgroundColor(0x28ccdf);

        this.clouds3 = this.add.group();

        for (var i = 0; i < 20; i++) {
            var x = Phaser.Math.RND.between(-2048, 2048);
            var y = Phaser.Math.RND.between(0, 981);

            var newObj = this.clouds3.create(x, y, 'clouds').setScale(Phaser.Math.RND.between(3, 5));
            newObj.alpha = Math.random() + 0.2;
            newObj.setDepth(2);
        }

        game.screenWipe(this);
        this.loading.visible = false;
    }

    typedKeys (e) {
        e.preventDefault();
        this.parseInput(e.keyCode, e.key);
    }

    nextPage(){
        this.parseInput(13, 13);
    }

    parseInput(keyCode, key){
         if (keyCode === 13 || keyCode === 32) { //enter
            if(this.dialogIterator < this.maxIterator) {
                this.dialogName.setTextUpper(this.messageArray[this.dialogIterator].name);
                this.dialogText.setTextUpper(this.messageArray[this.dialogIterator].message);
                if (this.messageArray[this.dialogIterator].narrate !== undefined) {
                    this.npc.visible = false;
                    this.hiraText.visible = false;
                } else if (this.messageArray[this.dialogIterator].image !== undefined) {
                    if(this.npc.flipX){
                        this.npc.setFlipX(false);
                    }
                    // console.log('start ', this.messageArray[this.dialogIterator].image);
                    if(this.messageArray[this.dialogIterator].flip !== undefined) {
                        this.npc.setFlipX(true);
                    }
                    this.npc.setTexture(this.messageArray[this.dialogIterator].image);
                    this.hiraText.visible = false;
                    this.npc.visible = true;

                } else if (this.messageArray[this.dialogIterator].text !== undefined) {
                    // console.log('start ', this.messageArray[this.dialogIterator].text);

                    this.npc.visible = false;
                    this.hiraText.visible = true;
                    this.hiraText.setOrigin(0.5);
                    this.hiraText.setText([Projectile.convertToHiragana(this.messageArray[this.dialogIterator].text)]);
                }
                this.dialogName.setOrigin(0);
                this.dialogText.setOrigin(0);
                // console.log(this.dialogIterator, 'vs', this.maxIterator);
                this.dialogIterator++;
                this.sound.play('next');

            } else {
                // console.log(this.jsonFile);
                this.events.emit('learnedNewCharacters', {charSet: this.jsonFile.teach, message: this.jsonFile.message, story: this.story, log: this.log, timestamp: this.timestampIn, total_time: (new Date() - this.timeIn)/1000});
                this.scene.stop('CutScene');
                this.scene.wake('MainScene');
            }
        }
    }

    update () {

        this.clouds3.getChildren().forEach(function (child) {﻿
            if(child.x > 2048 + child.width + 200) {
                child.x = -1024;
            }
            child.x += 4;
            // tween child

        });
    }

}
