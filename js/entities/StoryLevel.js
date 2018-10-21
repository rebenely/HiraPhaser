class StoryLevel extends Phaser.GameObjects.Sprite {

    constructor(scene, name, sprite, levelContent, optionals, callback) {
        super(scene, sprite.x, sprite.y, sprite.name);
        this.fileName = levelContent;
        this.name = name;

        this.setDisplaySize(optionals.sizeX, optionals.sizeY);
        this.setSize(optionals.sizeX, optionals.sizeY);

        /* display name */
        var style = { font: "16px Courier", fill: "#00ff44" };
        var levelName = scene.add.text(0, 0, this.name, style);
        levelName.visible = false;
        levelName.setOrigin(0.5);
        Phaser.Display.Align.To.TopCenter(levelName, this, 0, 0);

        this.setInteractive().
        on('pointerup', () => {
            levelName.visible = false;
            callback();
        }).
        on('pointerover', () => {
            levelName.visible = true;
        }, levelName).
        on('pointerout', () => {
            levelName.visible = false;
        }, levelName);
    }

}
