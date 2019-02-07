class Dungeon extends Phaser.GameObjects.Sprite {

    constructor(scene, dungeonContent, dungeonSprite, enemies, optionals, callback) {
        /* initiate sprite */
        super(scene, dungeonSprite.x, dungeonSprite.y, dungeonSprite.spriteName);
        // console.log(dungeonSprite.spriteName);
        this.setOrigin(0.5);
        this.setDisplaySize(optionals.sizeX, optionals.sizeY);
        this.setSize(optionals.sizeX, optionals.sizeY);
        this.setDepth(2);

        /* set values */
        this.name = dungeonContent.name;
        this.story = dungeonContent.level;
        this.characterPool = dungeonContent.charSet;
        this.wordPool = dungeonContent.wordPool;
        this.description = dungeonContent.description;

        /* other sprite values */
        this.minionSprite = enemies.minion.name;
        this.minionSpritePath = enemies.minion.path;
        this.minionAttackSpritePath = enemies.minion.attack;

        this.bossSprite = enemies.boss.name;
        this.bossSpritePath = enemies.boss.path;
        this.bossAttackSpritePath = enemies.boss.attack;

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

        /* display name : change this to bitmaptext */
        // var caveName = new HiraText(this, 0, 0, this.name, "basic");
        // scene.add.existing(caveName);
        // caveName.visible = false;
        // Phaser.Display.Align.To.TopCenter(caveName, this, 0, 0);

        var caveName = scene.add.bitmapText(720/2, 480/2, 'mnspc', this.name, 32);
        caveName.visible = false ;
        caveName.setOrigin(0.5).setDepth(5);
        Phaser.Display.Align.To.TopCenter(caveName, this, 0, 0);




        this.setInteractive({ cursor: 'url(assets/images/cursor/text.cur), pointer' }).
        on('pointerup', () => {
            scene.input.setDefaultCursor('url(assets/images/cursor/normal.cur), pointer');
            if(this.enabled){
                scene.sound.play('click');

                caveName.visible = false;
                callback();
            } else {
                scene.sound.play('disabled');
            }
        }).
        on('pointerover', () => {
            caveName.setDepth(5);
            scene.sound.play('hover');

            // caveName.visible = true;

            scene.events.emit('sayName', {name: this.name});
        }, caveName).
        on('pointerout', () => {
            // caveName.visible = false;
            scene.events.emit('hoverOut');
        }, caveName);

        // console.log(this);
        this.enabled = false;
    }


    comparePlayerLevel(level) {
        // console.log('level',level,'this level',this.story);
        if (level >= this.story) {
            this.enabled = true;
            this.clearTint();
        } else {
            this.enabled = false;
            this.setTint(0x585858);
        }
    }


}
