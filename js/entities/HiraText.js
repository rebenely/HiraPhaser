class HiraText extends Phaser.GameObjects.Text {

    constructor(scene, x, y, text, type, wordWrapWidth) {
        var style = {};
        switch(type) {
            case "basic":
                style = { font: "16px manaspc", fill:  game.global.UI_TEXT_FILL };
            break;
            case "header":
                style = { font: "32px manaspc", fill: game.global.UI_TEXT_FILL, align: "center" };
            break;
            case "wordWrap":
                style = { font: "16px manaspc", fill: game.global.UI_TEXT_FILL, align: "center", wordWrap: { width: wordWrapWidth, useAdvancedWrap: true} };
            break;
        }
        super(scene, x, y, text, style);
        this.setFontFamily(style.font.split(' ')[1]);
        this.setFontSize(style.font.split(' ')[0]);
        this.setStroke( game.global.UI_TEXT_STROKE, 3);
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
