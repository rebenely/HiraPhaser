class TrainScene extends Phaser.Scene {

    constructor () {
        super('TrainScene');
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
        this.graphics.fillRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);

        this.targetChar = new Projectile(this, 720/2, 480/4, 'hira', this.characterPool);
        this.add.existing(this.targetChar);
        this.targetChar.visible = true;

        this.targetChar.getRandomCharacter();
        this.targetChar.setText(this.targetChar.getHiragana());

        this.counter = 0;

        this.buttonArray = [];
        this.selected = '';
        var style = { font: "32px Courier", fill: "#00ff44", align: "center" };

        this.display = this.add.text(720/2, 2*480/3, '0/5', style);

        for ( let i = 0; i < this.characterPool.length; i++ ){
            var value = this.characterPool[i];
            console.log(value);

            this.add.existing(new HiraButton(this, 120 +  720/6*i, 480/2, value, style,
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
            this.scene.stop('TrainScene');
            this.scene.wake('MainScene', {player: this.player});
        }
    }

    checkValue(e) {
        console.log(e);
    }
}
