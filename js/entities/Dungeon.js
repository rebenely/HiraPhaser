class Dungeon extends Phaser.GameObjects.Sprite {

    constructor(scene, dungeonContent, dungeonSprite, enemies, optionals, callback) {
        /* initiate sprite */
        super(scene, dungeonSprite.x, dungeonSprite.y, dungeonSprite.spriteName);
        this.setOrigin(0.5);
        this.setDisplaySize(optionals.sizeX, optionals.sizeY);
        this.setSize(optionals.sizeX, optionals.sizeY);


        /* set values */
        this.name = dungeonContent.name;
        this.level = dungeonContent.level;
        this.characterPool = dungeonContent.charSet;
        this.wordPool = dungeonContent.wordPool;
        this.description = dungeonContent.description;

        /* other sprite values */
        this.minionSprite = 'assets/spritesheets/' + enemies.minion + 'idle.png'
        this.bossSprite = 'assets/spritesheets/' + enemies.boss + 'idle.png'
        this.minionFace = 'assets/images/' + enemies.minion + 'face.png';
        this.bossFace = 'assets/images/' + enemies.boss + 'face.png';
        this.background = 'assets/images/' + dungeonSprite.dungeonBG;
        this.battleBackground = 'assets/images/' + dungeonSprite.battleBG;
        this.minionName = enemies.minion;
        this.bossName = enemies.boss;

        /* display name */
        var style = { font: "16px Courier", fill: "#00ff44" };
        var caveName = scene.add.text(0, 0, "Kweba", style);
        caveName.visible = false;
        caveName.setOrigin(0.5);
        Phaser.Display.Align.To.TopCenter(caveName, this, 0, 0);



        this.setInteractive().
        on('pointerup', () => {
            caveName.visible = false;
            callback();
        }).
        on('pointerover', () => {
            caveName.visible = true;
        }, caveName).
        on('pointerout', () => {
            caveName.visible = false;
        }, caveName);


    }
}
