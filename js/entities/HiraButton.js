class HiraButton extends Phaser.GameObjects.Text {

    constructor(scene, x, y, text, style, callback) {
        super(scene, x, y, text, style);
        this.setInteractive().on('pointerup', () => {
            // cursor changes
            callback();
        })
        .on('pointerover', function () { this.setStyle({ fill: '#F00'});})
        .on('pointerout', function () { this.setStyle({  fill: "#00ff44"});} );
        this.setOrigin(0.5);
    }
}
