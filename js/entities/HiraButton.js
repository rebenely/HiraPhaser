class HiraButton extends Phaser.GameObjects.Text {

    constructor(scene, x, y, text, style, callback) {
        super(scene, x, y, text, style);
        this.setFontFamily(style.font.split(' ')[1]);
        this.clickable = true; // to prevent double clicking
        this.setInteractive().on('pointerup', () => {
            // cursor changes
            if(this.clickable){
                this.clickable = false;
                this.clearTint();
                this.setFontSize(16); /* unclick */
                callback();
            }
        })
        .on('pointerover', function () {
            if(this.clickable) {
                this.setTint(0x00ff44);
                this.setFontSize(16 * 1.25);
            }
        })
        .on('pointerout', function () {
            this.clickable = true;
            this.clearTint();
            this.setFontSize(16);
        });
        this.setOrigin(0.5);
    }

    getText() {
        return this.text;
    }

}
