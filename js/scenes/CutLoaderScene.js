class CutLoaderScene extends Phaser.Scene {

    constructor () {
        super('CutLoaderScene');
    }

    init (data) {
        this.fileName = data.jsonFile;
        this.story = data.story;
        this.log = data.log;
        this.player = data.player;
    }

    preload () {
        this.loading = new HiraText(this, 720/2, 480/2, "Loading", "header");
        this.add.existing(this.loading);

        this.cache.json.remove('dialog');
        this.load.json('dialog', 'assets/dialogs/'+this.fileName);

    }

    create() {
        var dialogJson = this.cache.json.get('dialog');
        // console.log(dialogJson);
        this.scene.start('CutScene', {jsonFile: dialogJson, story: this.story, log: this.log, player: this.player});
    }

}
