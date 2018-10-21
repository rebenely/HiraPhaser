class HiraButton extends Phaser.GameObjects.Text {

    constructor(scene, x, y, text, style, callback) {
        super(scene, x, y, text, style);
        this.setInteractive().on('pointerup', () => {
            // cursor changes
            callback();
        })
        .on('pointerover', function () { this.setColor('#F00');})
        .on('pointerout', function () { this.setColor( "#00ff44");} );
        this.setOrigin(0.5);
    }

    getText() {
        return this.text;
    }
}
