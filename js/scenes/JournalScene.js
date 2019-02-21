class JournalScene extends Phaser.Scene {

    constructor () {
        super('JournalScene');
    }
    init (data) {
        this.player = data.player;
    }
    preload() {
        this.container = this.add.graphics();


        this.container.lineStyle(game.global.UI_THICKNESS, game.global.UI_COLOR, 1);

        this.container.fillGradientStyle(game.global.UI_FILL_A, game.global.UI_FILL_A, game.global.UI_FILL_B, game.global.UI_FILL_B, game.global.UI_ALPHA);
        this.container.fillRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);
        this.container.strokeRect(720/2 - 680/2, 480/2 - 440/2, 680, 440);

        this.messageTitle = new HiraText(this, 720/2, 90, "Journal", "header");
        this.add.existing(this.messageTitle);
    }
    create () {



        var titleStyle = { font: "32px manaspc", fill: "#ffffff", align: "center" };
        var style = { font: "16px manaspc", fill: "#ffffff", align: "center", wordWrap: { width: 680 - 90, useAdvancedWrap: true} };
        // var caveName = this.add.text(58, 60, this.content.title , titleStyle);


        // var caveDesc = this.add.text(60, 130, this.content.desc, style);
        // var charSetDisplay = this.add.text(60, 90, this.content.subtitle, style);

        this.okayButton = new HiraButton(this, 720/2, 420, "Exit", style, () => {
            // console.log('fuck go back');
            this.scene.wake('MainScene');
            this.scene.stop('JournalScene');

        }, this);
        this.add.existing(this.okayButton);

        this.charactersLearned = new HiraButton(this, 720/3, 480/2, "Hiragana\nLearned", style, () => {
            // console.log('fuck go back');
            this.scene.launch('HintScene', {player: this.player});
            this.scene.pause('JournalScene');

        }, this);
        this.add.existing(this.charactersLearned);

        this.storyLogs = new HiraButton(this, 2*720/3, 480/2, "Story\nLogs", style, () => {
            // console.log('fuck go back');
            this.scene.launch('LogScene', {player: this.player});
            this.scene.pause('JournalScene');

        }, this);
        this.add.existing(this.storyLogs);


    }
}
