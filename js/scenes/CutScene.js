class CutScene extends Phaser.Scene {

    constructor () {
        super('CutScene');
    }

    init (data) {
        this.jsonFile = data.jsonFile;
    }

    preload () {
        var titleStyle = { font: "32px Courier", fill: "#00ff44", align: "center" };
        var loadingText = this.add.text(720/2, 480/2, "Loading",titleStyle);
        loadingText.setOrigin(0.5);

        for (var property in this.jsonFile['images']) {
            if (this.jsonFile['images'].hasOwnProperty(property)) {
                this.load.image(property.toString(),  this.jsonFile['images'][property]);
                console.log(property.toString(), this.jsonFile['images'][property]);
            }
        }
    }

    create() {
        var bg = this.add.sprite(720/2, 480/2, 'bg');
        console.log(this.jsonFile.image.x, this.jsonFile.image.y);
        this.npc = this.add.sprite(parseInt(this.jsonFile.image.x, 10), parseInt(this.jsonFile.image.y, 10), this.jsonFile['dialog'][0].image);
        this.npc.setScale(Number(this.jsonFile.image.scale));
        this.npc.setOrigin(0.5);

        var style = { font: "16px Courier", fill: "#00ff44", align: "left", wordWrap: { width: 660, useAdvancedWrap: true} };

        this.hiraText = this.add.bitmapText(720/2, 480/2, 'hira', '');
        this.hiraText.setOrigin(0.5);
        this.hiraText.visible = false;

        this.dialogBox = this.add.graphics();
        this.dialogBox.fillStyle(0x003366 , 0.7);
        this.dialogBox.fillRect(10, 480 - 120, 700, 100);

        console.log(this.jsonFile['dialog'][0]['message']);
        this.dialogName = this.add.text(40, 480 - 105, this.jsonFile['dialog'][0]['name'], style);
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
                console.log(this.jsonFile['dialog'][this.dialogIterator]['message']);
                this.dialogName.setText(this.jsonFile['dialog'][this.dialogIterator]['name']);
                this.dialogText.setText(this.jsonFile['dialog'][this.dialogIterator]['message']);
                if (this.jsonFile['dialog'][this.dialogIterator]['image'] !== undefined) {
                    this.npc.setTexture(this.jsonFile['dialog'][this.dialogIterator]['image']);
                    this.hiraText.visible = false;
                    this.npc.visible = true;
                } else if (this.jsonFile['dialog'][this.dialogIterator]['text'] !== undefined) {
                    this.npc.visible = false;
                    this.hiraText.visible = true;
                    this.hiraText.setOrigin(0.5);
                    this.hiraText.setText([this.getHiragana(this.jsonFile['dialog'][this.dialogIterator]['text'])]);
                }
                console.log(this.dialogIterator, 'vs', this.maxIterator);
                this.dialogIterator++;
            } else {
                this.scene.stop('CutScene');
                this.scene.wake('MainScene');
            }
        }
    }

    update () {

    }

    getHiragana (charInput) {
        var charString = '';

        for( var i = 0; i < charInput.length; i++ ){
            switch(charInput[i]) {
                case 'A':
                    charString = charString.concat(String.fromCharCode(12354));
                break;
                case 'I':
                    charString = charString.concat(String.fromCharCode(12356));
                break;
                case 'U':
                    charString = charString.concat(String.fromCharCode(12358));
                break;
                case 'E':
                    charString = charString.concat(String.fromCharCode(12360));
                break;
                case 'O':
                    charString = charString.concat(String.fromCharCode(12362));
                break;
                case 'KA':
                    charString = charString.concat(String.fromCharCode(12363));
                break;
                case 'KI':
                    charString = charString.concat(String.fromCharCode(12365));
                break;
                case 'KU':
                    charString = charString.concat(String.fromCharCode(12367));
                break;
                case 'KE':
                    charString = charString.concat(String.fromCharCode(12369));
                break;
                case 'KO':
                    charString = charString.concat(String.fromCharCode(12371));
                break;
            }
        }
        console.log('yikes ', charString);
        return charString;
    }
}
