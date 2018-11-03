class CutLoaderScene extends Phaser.Scene {

    constructor () {
        super('CutLoaderScene');
    }

    init (data) {
        this.fileName = data.jsonFile;
    }

    preload () {
        this.cache.json.remove('dialog');
        this.load.json('dialog', 'assets/dialogs/'+this.fileName);

    }

    create() {
        var dialogJson = this.cache.json.get('dialog');
        console.log(dialogJson);
        this.scene.start('CutScene', {jsonFile: dialogJson});
    }

}
