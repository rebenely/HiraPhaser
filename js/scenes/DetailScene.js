class DetailScene extends Phaser.Scene {

    constructor () {
        super('DetailScene');
    }
    init (data) {
        this.player = data.player;

        if(data.dungeon != null && data.dungeon instanceof Dungeon){
            this.dungeon = data.dungeon;
            this.content = {
                title: data.dungeon.name,
                desc: data.dungeon.description,
                subtitle: data.dungeon.characterPool.toString(),
                onCancel: data.onCancel,
                onAccept: data.onAccept
            }
        } else {
            this.content = data.content;
            console.log(data.dungeon);

        }
        this.startScene = data.startScene;
        this.passData = data.passData;

    }
    create () {
        this.container = this.add.graphics();


        this.container.lineStyle(game.global.UI_THICKNESS, game.global.UI_COLOR, 1);

        this.container.fillGradientStyle(game.global.UI_FILL_A, game.global.UI_FILL_A, game.global.UI_FILL_B, game.global.UI_FILL_B, game.global.UI_ALPHA);
        this.container.fillRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);
        this.container.strokeRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);



        var titleStyle = { font: "32px manaspc", fill: "#ffffff", align: "left" };
        var style = { font: "16px manaspc", fill: "#ffffff", align: "left", wordWrap: { width: 680 - 90, useAdvancedWrap: true} };
        // var caveName = this.add.text(58, 60, this.content.title , titleStyle);
        var caveName = new HiraText(this, 720/2, 90, this.content.title, "header");
        this.add.existing(caveName);
        var caveDesc = new HiraText(this, 720/2, 480/2, this.content.desc, "wordWrap", 680 - 90);
        this.add.existing(caveDesc);
        if(this.startScene === 'DungeonScene') {
            var found = -1;
            for(let i = 0; i < this.player.schedule.length && found == -1; i++) {
                if(this.player.schedule[i].dungeon === this.dungeon.name) {
                    found = i;
                }
            }
            if(found != -1) {
                var deadline = new HiraText(this, 720/2, 120,"Deadline: " + this.player.schedule[found].deadline, "wordWrap", 680 - 90);
                this.add.existing(deadline);
            }
        }
        this.input.keyboard.on('keydown_ESC', function (event) {
            this.scene.wake('MainScene');
            this.scene.stop('DetailScene');
            this.sound.play('click');
        }, this);
        this.input.keyboard.on('keydown_ENTER', function (event) {
            if(this.dungeon != null || this.content != null){
                // console.log('upgrade');
                this.sound.play('click');
                this.scene.sleep('MainScene');
                this.scene.stop('DetailScene');
                this.scene.start(this.startScene, this.passData);
            }
        }, this);
        // var caveDesc = this.add.text(60, 130, this.content.desc, style);
        // var charSetDisplay = this.add.text(60, 90, this.content.subtitle, style);

        this.cancelButton = new HiraButton(this, 720 - 60 - 30 - 60 - 30, 420, "Cancel", style, () => {
            // console.log('fuck go back');
            this.scene.wake('MainScene');
            this.scene.stop('DetailScene');
        }, this);
        this.add.existing(this.cancelButton);

        this.enterButton = new HiraButton(this, 720  - 60 - 30, 420, "Enter", style, () => {
            if(this.dungeon != null || this.content != null){
                // console.log('upgrade');
                this.scene.sleep('MainScene');
                this.scene.stop('DetailScene');
                this.scene.start(this.startScene, this.passData);
            }
        }, this);
        this.add.existing(this.enterButton);
    }
}
