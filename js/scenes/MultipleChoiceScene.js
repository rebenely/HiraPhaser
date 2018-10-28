class MultipleChoiceScene extends Phaser.Scene {

    constructor () {
        super('MultipleChoiceScene');
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
        this.graphics.fillRect(20, 480/2 - 440/2, 680, 440);

        this.targetChar = new Projectile(this, 720/2, 480/4, 'hira', this.characterPool);
        this.add.existing(this.targetChar);
        this.targetChar.visible = true;

        this.targetChar.getRandomCharacter();
        this.targetChar.setText(this.targetChar.getHiragana());

        this.counter = 0;

        this.buttonArray = [];
        this.selected = '';
        var style = { font: "32px manaspc", fill: "#ffffff", align: "center" };

        this.display = this.add.text(720/2, 2*480/3, '0/' + this.characterPool.length.toString(), style);

        for ( let i = 0; i < this.characterPool.length; i++ ){
            var value = this.characterPool[i];
            console.log(value);

            this.add.existing(new HiraButton(this, (700/this.characterPool.length + 1) +  i*700/(this.characterPool.length+1), 480/2, value, style,
                () => {
                    if(this.characterPool[i] === this.targetChar.currentChar) {
                        this.counter++;
                        console.log(this.counter);
                        this.targetChar.getRandomCharacter();
                        this.targetChar.setText(this.targetChar.getHiragana());
                    }
                }
            )).setOrigin(0.5);
        }


    }

    update () {
        this.display.setText(this.counter.toString() + '/5');
        this.display.setOrigin(0.5);
        if(this.counter >= 5) {
            this.scene.stop('MultipleChoiceScene');
            this.scene.wake('TrainScene', {player: this.player, characterPool: this.characterPool});
        }
    }

    checkValue(e) {
        console.log(e);
    }
}
