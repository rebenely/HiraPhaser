class MatchingTypeScene extends Phaser.Scene {

    constructor () {
        super('MatchingTypeScene');
    }

    init (data) {
        this.player = data.player;
        this.characterPool = data.characterPool.slice();
    }

    preload () {

    }

    create () {

        this.dataCapture = {
            total_time: 0,
            answers: []
        }

        this.container = this.add.graphics();
        this.container.lineStyle(game.global.UI_THICKNESS, game.global.UI_COLOR, 1);

        this.container.fillGradientStyle(game.global.UI_FILL_A, game.global.UI_FILL_A, game.global.UI_FILL_B, game.global.UI_FILL_B, 1);
        this.container.fillRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);
        this.container.strokeRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);

        this.display = new HiraText(this, 720/2, 480/2, 'Match the Hiragana characters with their romaji!', "wordWrap", 2*720/3);
        this.add.existing(this.display);

        this.matchLines = this.add.graphics();
        this.matchLines.lineStyle(game.global.UI_THICKNESS, game.global.UI_COLOR, 1);
        this.matchLines.visible = false;

        this.style = { font: "32px manaspc", fill: "#ffffff", align: "center" };
        this.ypos = []; /* holder of HiraButtons */
        this.hiragana = []; /* holder of bitmapText */
        this.answer = []; /* holder of answers order */
        this.selectedLetter = null;
        this.shuffled = this.shuffle(this.characterPool.slice());

        this.characterPool = this.shuffle(this.characterPool);
        for ( let i = 0; i < this.characterPool.length; i++ ){
            let value = this.characterPool[i];
            // console.log(value);

            // this.ypos.push(i*460/(this.characterPool.length + 2) + (460/this.characterPool.length + 2));
            this.matchLines.strokeRect(20, (460/this.characterPool.length + 2), 680,  i*460/(this.characterPool.length + 2) );


            this.ypos.push(this.add.existing(new HiraButton(this, 100, (460/this.characterPool.length + 2) +  i*460/(this.characterPool.length+2   ), value, this.style,
                () => {
                    if (this.selectedLetter == null) {
                        this.selectedLetter = value;
                        this.ypos[i].setTint(game.global.UI_TEXT_HIGHLIGHT);
                        // console.log(this.selectedLetter);
                    } else if (this.selectedLetter === value) {
                        this.selectedLetter = null;
                        this.ypos[i].clearTint();
                    } else if (this.selectedLetter != value) {
                        let selected = null;
                        let swap = null;
                        let posswap = null;
                        let posselected = null;
                        for(let j = 0; j < this.ypos.length; j++){
                            // console.log(this.ypos[j].text);
                            if(this.answer[j] === value) {
                                swap = j;
                            }
                            if(this.answer[j] === this.selectedLetter){
                                selected = j;
                            }
                            if(this.ypos[j].text === value) {
                                posswap = j;
                            }
                            if(this.ypos[j].text === this.selectedLetter){
                                posselected = j;
                            }
                        }
                        // console.log('swap:',swap,'selected:',selected);

                        let swappang = this.answer[swap];
                        this.answer[swap] = this.answer[selected];
                        this.answer[selected] = swappang;
                        // console.log(this.answer);
                        this.selectedLetter = null;
                        let temp = this.ypos[posswap].y;
                        this.ypos[posswap].y = this.ypos[posselected].y;
                        this.ypos[posselected].y = temp;
                        this.ypos[posselected].clearTint();
                        this.ypos[posswap].clearTint();
                    }
                }
            )).setOrigin(0.5));

            this.hiragana.push(this.add.bitmapText(620, (460/this.characterPool.length + 2) +  i*460/(this.characterPool.length+2   ), 'hira', Projectile.convertToHiragana(this.shuffled[i]), 48));
            this.hiragana[i].setOrigin(0.5);
            this.hiragana[i].visible = false;
            this.ypos[i].setScale(1.5).setInteractive();
            this.ypos[i].longpress = true;
            this.ypos[i].visible = false;
            this.answer.push(this.ypos[i].text);

            // this.hiragana[i].setOrigin(0.5).setInteractive();
            // this.input.setDraggable(this.hiragana[i]);
        }
        // console.log(this.ypos);

        // this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        //
        //     gameObject.x = dragX;
        //     gameObject.y = dragY;
        //
        // });
        //
        // this.input.on('dragstart', function (pointer, gameObject) {
        //
        //     gameObject.setTint(0xff0000);
        //
        // });
        // this.input.on('dragend', function (pointer, gameObject) {
        //
        //     gameObject.clearTint();
        //
        // });

        this.exitButton = new HiraButton(this, 720/3, 5*480/6, "Exit", this.style, () => {
            // console.log('yeman', this.dataCapture);
            this.events.emit('matchFinish', {dataCapture: this.dataCapture});
            this.scene.stop('MatchingTypeScene');
            this.scene.wake('TrainScene', {player: this.player, characterPool: this.characterPool});
        }, this);
        this.add.existing(this.exitButton);
        this.results = [];
        this.playButton = new HiraButton(this, 2*720/3, 5*480/6, "Play", this.style, () => {
            // console.log('Play');

            if(this.matchLines.visible === true){
                this.playButton.visible = false;
                this.exitButton.visible = false;

                var correct = 0;
                for (let i = 0; i < this.ypos.length; i++){
                    this.ypos[i].disableInteractive();
                    this.tweens.add({
                       targets: this.ypos[i],
                       x: 550,
                       duration: 1000,
                       ease: 'Power2',
                       onComplete: () => {
                           this.exitButton.visible = true;
                          // console.log(this.answer[i], 'vs', this.shuffled[i]);
                          this.dataCapture.answers.push({target: this.shuffled[i], answer: this.answer[i]});
                          if(this.answer[i] === this.shuffled[i]){
                              correct++;
                              this.results.push(this.add.existing(new HiraText(this, 720/2, (460/this.characterPool.length + 2) +  i*460/(this.characterPool.length+2),  "Correct!" , "header")));
                          } else {
                              this.results.push(this.add.existing(new HiraText(this, 720/2, (460/this.characterPool.length + 2) +  i*460/(this.characterPool.length+2),  "Wrong!" , "header")));
                              this.ypos[i].disable();
                          }
                          if(correct > this.ypos.length/2) {
                              this.sound.play('success');
                          } else {
                              this.sound.play('fail');
                          }
                       }
                   });
                }

                this.dataCapture.total_time = this.time.now/1000 - this.timeStamp;

            } else {
                this.sound.play('start');
                this.display.visible = false;
                this.timeStamp = this.time.now/1000;
                // console.log(this.timeStamp);
                for(let i = 0; i < this.ypos.length; i++) {
                    this.ypos[i].visible = true;
                    this.hiragana[i].visible = true;
                }
                this.matchLines.visible = true;
            }
        }, this);

        this.add.existing(this.playButton);
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
