class Dungeon extends Phaser.GameObjects.Sprite {

    constructor(scene, dungeonContent, dungeonSprite, enemies, optionals, callback) {
        /* initiate sprite */
        super(scene, dungeonSprite.x, dungeonSprite.y, dungeonSprite.spriteName);
        console.log(dungeonSprite.spriteName);
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
        this.minionSprite = enemies.minion.name;
        this.minionSpritePath = enemies.minion.path;

        this.bossSprite = enemies.boss.name;
        this.bossSpritePath = enemies.boss.path;

        this.minionFace = enemies.minion.face.name;
        this.minionFacePath = enemies.minion.face.path;

        this.bossFace = enemies.boss.face.name;
        this.bossFacePath = enemies.boss.face.path;

        this.background = dungeonSprite.dungeonBG.name;
        this.backgroundPath = dungeonSprite.dungeonBG.path;

        this.battleBackground = dungeonSprite.battleBG.name;
        this.battleBackgroundPath = dungeonSprite.battleBG.path;

        this.minionName = enemies.minion.name;
        this.bossName = enemies.boss.name;
        this.minionExp = enemies.minion.exp;
        this.bossExp = enemies.boss.exp;

        /* display name */
        var style = { font: "16px manaspc", fill: "#ffffff" };
        var caveName = scene.add.text(0, 0, this.name, style);
        caveName.visible = false;
        caveName.setOrigin(0.5);
        Phaser.Display.Align.To.TopCenter(caveName, this, 0, 0);



        this.setInteractive().
        on('pointerup', () => {
            if(this.enabled){
                caveName.visible = false;
                callback();
            }
        }).
        on('pointerover', () => {
            caveName.setDepth(1);
            caveName.visible = true;
        }, caveName).
        on('pointerout', () => {
            caveName.visible = false;
        }, caveName);

        console.log(this);
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
