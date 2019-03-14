class HiraText extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, type, wordWrapWidth) {
        var style = {};
        switch(type) {
            case "basic":
                style = { font: "24px manaspc", fill:  game.global.UI_TEXT_FILL };
            break;
            case "header":
                style = { font: "44px manaspc", fill: game.global.UI_TEXT_FILL, align: "center" };
            break;
            case "wordWrap":
                style = { font: "24px manaspc", fill: game.global.UI_TEXT_FILL, align: "center", wordWrap: { width: wordWrapWidth, useAdvancedWrap: true} };
            break;
            case "wordWrapL":
                style = { font: "24px manaspc", fill: game.global.UI_TEXT_FILL, align: "left", wordWrap: { width: wordWrapWidth, useAdvancedWrap: true} };
            break;
        }
        super(scene, x, y, text, style);
        this.strokeThiccness = 3;
        this.setLineSpacing(-10);
        this.setFontFamily(style.font.split(' ')[1]);
        this.setFontSize(style.font.split(' ')[0]);
        this.setStroke( game.global.UI_TEXT_STROKE, this.strokeThiccness);
        this.setOrigin(0.5);
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
    }

    setTextUpper(string){
        this.setText(string);
        this.setOrigin(0.5);
    }

}
