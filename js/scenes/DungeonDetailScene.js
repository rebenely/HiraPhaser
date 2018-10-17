class DungeonDetailScene extends Phaser.Scene {

    constructor () {
        super('DungeonDetailScene');
    }
    init (data) {
        this.player = data.player;
        this.dungeon = data.dungeon;
    }
    create () {
        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x003366 , 1);
        this.graphics.fillRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);

        var titleStyle = { font: "32px Courier", fill: "#00ff44", align: "left" };
        var style = { font: "16px Courier", fill: "#00ff44", align: "left", wordWrap: { width: 680 - 90, useAdvancedWrap: true} };
        var caveName = this.add.text(60, 60, this.dungeon.name , titleStyle);
        var caveDesc = this.add.text(60, 130, this.dungeon.description, style);
        var charSetDisplay = this.add.text(60, 90, this.dungeon.characterPool.toString(), style);

        this.cancelButton = new HiraButton(this, 720 - 60 - 30 - 60 - 30, 420, "Cancel", style, () => {
            console.log('fuck go back');
            this.scene.wake('MainScene');
            this.scene.stop('DungeonDetailScene');
        }, this);
        this.add.existing(this.cancelButton);

        this.enterButton = new HiraButton(this, 720  - 60 - 30, 420, "Enter", style, () => {
            console.log('upgrade');
            this.scene.sleep('MainScene');
            this.scene.start('DungeonScene', {player: this.player, dungeon: this.dungeon, difficulty: 'easy'})
        }, this);
        this.add.existing(this.enterButton);


    }
}
