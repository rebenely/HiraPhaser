class HiraPress extends Phaser.GameObjects.Text {

    constructor(scene, x, y, text, style, callback) {
        super(scene, x, y, text, style);
        this.setFontFamily(style.font.split(' ')[1]);
        this.clickable = true; // to prevent double clicking
        this.enabled = true; // enable / disable
        this.setStroke(game.global.UI_TEXT_STROKE,3);
        this.setInteractive({ cursor: 'url(assets/images/cursor/link.cur), pointer' }).on('pointerdown', () => {
            // cursor changes
            scene.input.setDefaultCursor('url(assets/images/cursor/normal.cur), pointer');

            callback();

        })
        .on('pointerover', function (pointer) {

            if(this.clickable && this.enabled) {
                // console.log('aayy');
                if(pointer.isDown) {
                    callback();
                }
                this.setTint(game.global.UI_TEXT_HIGHLIGHT);
                this.setFontSize(16 * 1.25);
            }
        })
        .on('pointerout', function () {
            if(this.enabled) {
                this.clickable = true;
                this.clearTint();
                this.setFontSize(16);
            }
        });
        this.setOrigin(0.5);
    }

    getText() {
        return this.text;
    }

    disable() {
        this.setStroke('#686868', 3);
        this.setTint(0x686868);
        this.enabled = false;
    }

    enable() {
        this.setStroke('#0000000', 3);
        this.clearTint();
        this.enabled = true;
    }

}
