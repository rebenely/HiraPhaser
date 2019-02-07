class StoryLevel extends Phaser.GameObjects.Sprite {

    constructor(scene, name, sprite, levelContent, optionals, callback) {
        super(scene, sprite.x, sprite.y, sprite.name);
        this.fileName = levelContent;
        this.name = name;
        this.level = optionals.level;
        this.setOrigin(0.5);
        this.setDepth(4);
        this.setDisplaySize(optionals.sizeX, optionals.sizeY);
        this.setSize(optionals.sizeX, optionals.sizeY);

        /* WorldNavScene handles name display */

        this.setInteractive({ cursor: 'url(assets/images/cursor/help.cur), pointer' }).
        on('pointerup', () => {
            scene.input.setDefaultCursor('url(assets/images/cursor/normal.cur), pointer');
            if(this.enabled){
                scene.sound.play('click');
                callback();
            } else {
                scene.sound.play('disabled');
            }
        }).
        on('pointerover', () => {

            scene.sound.play('hover');
            scene.events.emit('sayName', {name: this.name});
        }).
        on('pointerout', () => {
            scene.events.emit('hoverOut');
        });

        this.enabled = false;
    }

    comparePlayerLevel(level) {
        // console.log('level',level,'this level',this.level);

        if (level >= this.level) {
            this.enabled = true;
            this.clearTint();
        } else {
            this.enabled = false;
            this.setTint(0x4c4c4c);
        }
    }


}
