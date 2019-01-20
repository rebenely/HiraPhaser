class StoryLevel extends Phaser.GameObjects.Sprite {

    constructor(scene, name, sprite, levelContent, optionals, callback) {
        super(scene, sprite.x, sprite.y, sprite.name);
        this.fileName = levelContent;
        this.name = name;
        this.level = optionals.level;
        this.setOrigin(0.5);

        this.setDisplaySize(optionals.sizeX, optionals.sizeY);
        this.setSize(optionals.sizeX, optionals.sizeY);

        /* display name : change this to bitmaptext */
        // var style = { font: "32px manaspc", fill: "#ffffff" };
        // var levelName = scene.add.text(0, 0, this.name, style);
        // levelName.visible = false;
        // levelName.setOrigin(0.5);
        // levelName.setStroke('#0000000',3);
        // Phaser.Display.Align.To.TopCenter(levelName, this, 0, 0);

        var levelName = scene.add.bitmapText(720/2, 480/2, 'mnspc', this.name, 32);
        levelName.visible = false ;
        levelName.setOrigin(0.5);
        Phaser.Display.Align.To.TopCenter(levelName, this, 0, 0);


        this.setInteractive({ cursor: 'url(assets/images/cursor/help.cur), pointer' }).
        on('pointerup', () => {
            scene.input.setDefaultCursor('url(assets/images/cursor/normal.cur), pointer');
            if(this.enabled){
                levelName.visible = false;
                callback();
            }
        }).
        on('pointerover', () => {
            levelName.visible = true;
            levelName.setDepth(1);

        }, levelName).
        on('pointerout', () => {
            levelName.visible = false;
        }, levelName);

        this.enabled = false;
    }

    comparePlayerLevel(level) {
        console.log('level',level,'this level',this.level);

        if (level >= this.level) {
            this.enabled = true;
            this.clearTint();
        } else {
            this.enabled = false;
            this.setTint(0x585858);
        }
    }

}
