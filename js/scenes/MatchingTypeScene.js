class MatchingTypeScene extends Phaser.Scene {

    constructor () {
        super('MatchingTypeScene');
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
        this.graphics.lineStyle(2, 0xfffff00, 1);

        this.graphics.fillRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);

        var style = { font: "32px manaspc", fill: "#ffffff", align: "center" };
        this.ypos = [];
        this.hiragana = [];
        var shuffled = this.shuffle(this.characterPool);
        for ( let i = 0; i < this.characterPool.length; i++ ){
            var value = this.characterPool[i];
            console.log(value);

            this.ypos.push(i*460/(this.characterPool.length + 2) + (460/this.characterPool.length + 2));
            this.graphics.strokeRect(20, (460/this.characterPool.length + 2), 680,  i*460/(this.characterPool.length + 2) );


            this.add.existing(new HiraButton(this, 100, (460/this.characterPool.length + 2) +  i*460/(this.characterPool.length+2   ), value, style,
                () => {

                }
            )).setOrigin(0.5);

            this.hiragana.push(this.add.bitmapText(700/(this.characterPool.length + 1 ) + i * 700/(this.characterPool.length + 1), 440, 'hira', Projectile.convertToHiragana(shuffled[i]), 48));
            this.hiragana[i].setOrigin(0.5).setInteractive();
            this.input.setDraggable(this.hiragana[i]);
        }

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

            gameObject.x = dragX;
            gameObject.y = dragY;

        });

        this.input.on('dragstart', function (pointer, gameObject) {

            gameObject.setTint(0xff0000);

        });
        this.input.on('dragend', function (pointer, gameObject) {

            gameObject.clearTint();

        });


    }

    update () {

    }

    checkValue(e) {
        console.log(e);
    }
    shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
}
