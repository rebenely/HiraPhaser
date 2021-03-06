class HiraButton extends Phaser.GameObjects.Text {

    constructor(scene, x, y, text, style, callback) {
        super(scene, x, y, text, { fontFamily: 'manaspc', fontSize: 24, color: game.global.UI_TEXT_FILL, align: 'center' });
        // this.setFontFamily(style.font.split(' ')[1]);
        this.clickable = true; // to prevent double clicking
        this.enabled = true; // enable / disable
        this.longpress = false;
        this.strokeThiccness = 3;
        this.setShadow(1, 1, '#333333', 2, true, false);
        this.setStroke( game.global.UI_TEXT_STROKE, this.strokeThiccness);
        this.setInteractive({ cursor: 'url(assets/images/cursor/hover.png), pointer' }).on('pointerup', () => {
            // cursor changes
            scene.input.setDefaultCursor('url(assets/images/cursor/normal.png), pointer');
            if(this.enabled){
                scene.sound.play('click');
                this.clickable = false;
                // this.clearTint();
                // this.setFontSize(16); /* unclick */
                callback();
            } else {
                scene.sound.play('disabled');
            }
        })
        .on('pointerover', function () {
            if(this.enabled) {
                scene.sound.play('hover');
                if(!this.longpress){
                    this.setTint(game.global.UI_TEXT_HIGHLIGHT);
                }
                // this.setFontSize(16 * 1.25);
            }

        })
        .on('pointerout', function () {
            scene.input.setDefaultCursor('url(assets/images/cursor/normal.png), pointer');
            if(this.enabled) {
                this.clickable = true;
                if(!this.longpress){
                    this.clearTint();
                }
                // this.setFontSize(16);
            }
        });
        this.setOrigin(0.5);
        var tweenie = this;
        this.alertMe = scene.tweens.addCounter({
            from: 255,
            to: 0,
            duration: 1500,
            repeat: -1,
            yoyo: true,
            paused: true,
            ease: 'Sine.easeInOut',
            onUpdate: function (tween)  {
                var value = Math.floor(tween.getValue());

                tweenie.setTint(Phaser.Display.Color.GetColor(255, 255, 255 - value));
            }
        });
    }

    getText() {
        return this.text;
    }

    disable() {
        this.setStroke('#686868', this.strokeThiccness);
        this.setTint(0x686868);
        this.enabled = false;
    }

    enable() {
        this.setStroke('#0000000', this.strokeThiccness);
        this.clearTint();
        this.enabled = true;
        this.clickable = true;
    }

    setTextUpper(string){
        this.setText(string.toUpperCase());
    }

    alertBoi(){
        this.alertMe.restart();
    }

}
