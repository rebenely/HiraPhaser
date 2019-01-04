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
        this.anims.create({
            key: 'slash',
            frames: this.anims.generateFrameNumbers('kidlatslash', { frames: [ 0, 1, 2, 3, 4, 5, 6] }),
            frameRate: 20,
            repeat: 0
        });



        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x003366 , 1);
        this.graphics.fillRect(20, 480/2 - 440/2, 680, 440);

        this.targetChar = new Projectile(this, 720/2, 480/4, 'hira', this.characterPool);
        this.add.existing(this.targetChar);
        this.targetChar.visible = true;

        this.slash = this.add.sprite(720/2, 240, 'kidlatslash');
        this.slash.setScale(4);
        this.slash.setOrigin(0.5);
        this.slash.visible = false;
        this.slash.anims.play('slash');

        this.slash.on('animationcomplete', this.animCompleteSlash, this);

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
                        this.showSlash(720/2, 480/4, false);
                    } else {
                        this.cameras.main.shake(100);
                    }
                }
            )).setOrigin(0.5);
        }


    }

    update () {
        this.display.setText(this.counter.toString() + '/5');
        this.display.setOrigin(0.5);
        if(this.counter >= 5) {
            this.targetChar.visible = false;
        }
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
        if(this.counter >= 5) {
            this.scene.stop('MultipleChoiceScene');
            this.scene.wake('TrainScene', {player: this.player, characterPool: this.characterPool});
        }
    }
}
