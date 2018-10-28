class HiraButton extends Phaser.GameObjects.Text {

    constructor(scene, x, y, text, style, callback) {
        super(scene, x, y, text, style);
        this.setFontFamily('manaspc');
        this.setInteractive().on('pointerup', () => {
            // cursor changes
            callback();
        })
        .on('pointerover', function () { this.setColor('#00ff44'); this.setFontSize(16 * 1.25);})
        .on('pointerout', function () { this.setColor( "#ffffff"); this.setFontSize(16);});
        this.setOrigin(0.5);
    }

    getText() {
        return this.text;
    }
}
