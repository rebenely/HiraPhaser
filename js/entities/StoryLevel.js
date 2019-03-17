class StoryLevel extends Phaser.GameObjects.Sprite {

    constructor(scene, name, sprite, levelContent, optionals, callback, logs, world) {
        super(scene, sprite.x, sprite.y, sprite.name);
        this.fileName = levelContent;
        this.name = name;
        this.story = this.level = optionals.level;
        this.log = logs;
        this.world = world;
        this.setOrigin(0.5);
        this.setDepth(4);
        this.setDisplaySize(optionals.sizeX, optionals.sizeY);
        this.setSize(optionals.sizeX, optionals.sizeY);
        var tweenie = this;
        this.alertTween =  scene.tweens.addCounter({
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
            scene.input.setDefaultCursor('url(assets/images/cursor/normal.png), pointer')
            scene.events.emit('hoverOut');
        });
        if(sprite.name === 'learn' || sprite.name === 'practice' || sprite.name === 'train') {
            this.input.hitArea.setTo(0, 0, 20, 20);
        } else {
            this.input.hitArea.setTo(0, 0, 60, 35);
        }

        this.enabled = false;
    }

    comparePlayerLevel(level) {
        // console.log('level',level,'this level',this.level);

        if (level >= this.level) {
            this.enabled = true;
            this.clearTint();
            return true;
        } else {
            this.enabled = false;
            this.setTint(0x4c4c4c);
            return false;
        }
    }

    alert(){
        this.alertTween.restart();
    }

}
