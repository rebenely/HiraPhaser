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
        console.log(dungeonContent);
        this.name = dungeonContent.name;
        this.level = this.story = dungeonContent.level;
        this.world = dungeonContent.world;
        this.characterPool = dungeonContent.charSet;
        this.wordPool = dungeonContent.wordPool;
        this.description = dungeonContent.description;
        this.log = dungeonContent.log;

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
        var tweenie = this;
        this.alertTween = scene.tweens.addCounter({
            from: 255,
            to: 0,
            duration: 200,
            repeat: 5,
            yoyo: true,
            paused: true,
            ease: 'Sine.easeInOut',
            onUpdate: function (tween)  {
                var value = Math.floor(tween.getValue());

                tweenie.setTint(Phaser.Display.Color.GetColor(255, value, value));
            }
        });

        /* WorldNavScene handles name display */

        this.setInteractive().
        on('pointerup', () => {
            if(this.enabled){
                scene.input.setDefaultCursor('url(assets/images/cursor/normal.png), pointer');
                scene.sound.play('click');
                callback();
            } else {
                scene.sound.play('disabled');
            }
        }).
        on('pointerover', () => {
            if(this.enabled){
                scene.input.setDefaultCursor('url(assets/images/cursor/hover.png), pointer');
                scene.sound.play('hover');
            } else {
                scene.input.setDefaultCursor('url(assets/images/cursor/disabled.png), pointer');
            }
            scene.events.emit('sayName', {name: this.name});
        }).
        on('pointerout', () => {
            scene.input.setDefaultCursor('url(assets/images/cursor/normal.png), pointer');
            scene.events.emit('hoverOut');
        });

        this.enabled = false;
    }


    comparePlayerLevel(level) {
        // console.log('level',level,'this level',this.story);
        if (level >= this.story) {
            this.enabled = true;
            this.clearTint();
            return true;
        } else {
            this.enabled = false;
            this.setTint(0x585858);
            return false;
        }
    }

    alert(){
        this.alertTween.restart();
    }


}
