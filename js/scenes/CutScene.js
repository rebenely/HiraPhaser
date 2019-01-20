class CutScene extends Phaser.Scene {

    constructor () {
        super('CutScene');
    }

    init (data) {
        this.jsonFile = data.jsonFile;
    }

    preload () {
        var titleStyle = { font: "32px manaspc", fill: "#00ff44", align: "center" };
        var loadingText = this.add.text(720/2, 480/2, "Loading",titleStyle);
        loadingText.setOrigin(0.5);

        for (var property in this.jsonFile['images']) {
            if (this.jsonFile['images'].hasOwnProperty(property)) {
                this.load.image(property.toString(),  this.jsonFile['images'][property]);
                console.log(property.toString(), this.jsonFile['images'][property]);
                if(property.toString().search("_bg") != -1) {
                    console.log(property.toString());
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
        var bg = this.add.sprite(720/2, 480/2, this.bgKey);
        console.log('image resize', this.jsonFile.image.x, this.jsonFile.image.y, this.jsonFile.image.scale);
        this.npc = this.add.sprite(parseInt(this.jsonFile.image.x, 10), parseInt(this.jsonFile.image.y, 10), this.jsonFile['dialog'][0].image);
        this.npc.setScale(Number(this.jsonFile.image.scale));
        this.npc.setOrigin(0.5);

        var style = { font: "16px manaspc", fill: game.global.UI_TEXT_FILL, align: "left", wordWrap: { width: 660, useAdvancedWrap: true} };
        var titleStyle = { font: "32px manaspc", fill:  game.global.UI_TEXT_FILL, align: "center" };


        this.hiraText = this.add.bitmapText(720/2, 480/2, 'hira', '');
        this.hiraText.setOrigin(0.5);
        this.hiraText.visible = false;

        this.dialogBox = this.add.graphics();
        this.dialogBox.fillStyle(game.global.UI_FILL_A , 0.7);
        this.dialogBox.fillRect(10, 480 - 120, 700, 100);

        this.nameBox = this.add.graphics();
        this.nameBox.fillStyle(game.global.UI_FILL_B , 0.3);
        this.nameBox.fillRect(10, 480 - 145, 100, 48);

        console.log(this.jsonFile['dialog'][0]['message']);
        this.dialogName = this.add.text(60, 480 -120, this.jsonFile['dialog'][0]['name'], titleStyle);
        this.dialogName.setOrigin(0.5);

        this.dialogText = this.add.text(40, 480 - 80, this.jsonFile['dialog'][0]['message'], style);
        this.dialogIterator = 1; this.maxIterator = this.jsonFile['dialog'].length;

        this.input.keyboard.on('keyup', this.typedKeys, this);


    }

    typedKeys (e) {
        if (e.keyCode === 8) { //back
            e.preventDefault();
        } else if (e.keyCode === 13 || e.keyCode === 32) { //enter
            e.preventDefault();
            if(this.dialogIterator < this.maxIterator) {
                this.dialogName.setText(this.messageArray[this.dialogIterator].name);
                this.dialogText.setText(this.messageArray[this.dialogIterator].message);
                if (this.messageArray[this.dialogIterator].image !== undefined) {
                    console.log('start ', this.messageArray[this.dialogIterator].image);

                    this.npc.setTexture(this.messageArray[this.dialogIterator].image);
                    this.hiraText.visible = false;
                    this.npc.visible = true;
                } else if (this.messageArray[this.dialogIterator].text !== undefined) {
                    console.log('start ', this.messageArray[this.dialogIterator].text);

                    this.npc.visible = false;
                    this.hiraText.visible = true;
                    this.hiraText.setOrigin(0.5);
                    this.hiraText.setText([Projectile.convertToHiragana(this.messageArray[this.dialogIterator].text)]);
                }
                this.dialogName.setOrigin(0.5);
                console.log(this.dialogIterator, 'vs', this.maxIterator);
                this.dialogIterator++;
            } else {
                console.log(this.jsonFile);
                this.events.emit('learnedNewCharacters', {charSet: this.jsonFile.teach, message: this.jsonFile.message});
                this.scene.stop('CutScene');
                this.scene.wake('MainScene');
            }
        }
    }

    update () {

    }

}
