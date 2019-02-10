class WorldNavScene extends Phaser.Scene {

    constructor () {
        super('WorldNavScene');
    }

    init(data) {
        this.cam = data.camera;
    }
    create () {

        this.container = this.add.graphics();

        this.container.lineStyle(game.global.UI_THICKNESS, game.global.UI_COLOR, 1);

        this.container.fillGradientStyle(game.global.UI_FILL_A, game.global.UI_FILL_A, game.global.UI_FILL_B, game.global.UI_FILL_B, game.global.UI_ALPHA);
        this.container.fillRect(2, 430, 716, 48);
        this.container.strokeRect(2, 430, 716, 48);

        this.levelTitle = this.add.graphics();

        this.levelTitle.lineStyle(game.global.UI_THICKNESS, game.global.UI_COLOR, 1);

        this.levelTitle.fillGradientStyle(game.global.UI_FILL_A, game.global.UI_FILL_A, game.global.UI_FILL_B, game.global.UI_FILL_B, game.global.UI_ALPHA);
        this.levelTitle.visible = false;

        this.navEnable = false;
        this.coordinates = [{x:350, y:300, z: 1.1}, {x: 1000, y: 655, z: 1}, {x: 1565, y: 531, z: 0.9}, {x:1350, y:100, z: 2}];
        this.cam.pan(this.coordinates[0].x, this.coordinates[0].y, 2000, 'Sine.easeInOut');
        this.cam.zoomTo(this.coordinates[0].z, 2000);

        var style = { font: "16px manaspc", fill:  game.global.UI_TEXT_FILL, align: "left"};
        this.iterator = 0;
        this.prevButton = new HiraButton(this, 60, 430 + 24, "Prev", style, () => {
            if(this.navEnable === true){
                this.navEnable = false;
                if(this.iterator > 0){
                    this.iterator--;
                    this.nextButton.enable();
                }
                if (this.iterator === 0) {
                    this.prevButton.disable();
                }
                this.cam.pan(this.coordinates[this.iterator].x, this.coordinates[this.iterator].y, 2000, 'Sine.easeInOut');
                this.cam.zoomTo(this.coordinates[this.iterator].z, 2000);
            }
        }, this);
        this.add.existing(this.prevButton);

        this.nextButton = new HiraButton(this, 60*11, 430 + 24, "Next", style, () => {
            if(this.navEnable === true){
                this.navEnable = false;
                if(this.iterator < 3){
                    this.iterator++;
                    this.prevButton.enable();
                }
                if (this.iterator === 3) {
                    this.nextButton.disable();
                }
                this.cam.pan(this.coordinates[this.iterator].x, this.coordinates[this.iterator].y, 2000, 'Sine.easeInOut');
                this.cam.zoomTo(this.zoom[this.iterator], 2000);
            }
        }, this);
        this.add.existing(this.nextButton);

        this.cam.on('camerapancomplete', function() {
            this.navEnable = true;
        }, this);

        this.codexButton = new HiraButton(this, 60*8, 430 + 24, "Journal", style, () => {
            this.scene.launch('MessageScene', {message: { title : "Not yet implemented", body: "Under construction!"}});
            this.events.emit('disableLevels');
            this.scene.sleep('WorldNavScene');
        }, this);
        this.add.existing(this.codexButton);

        this.questButton = new HiraButton(this, 60*6, 430 + 24, "Quest", style, () => {
            this.scene.launch('MessageScene', {message: { title : "Not yet implemented", body: "Under construction!"}});
            this.events.emit('disableLevels');
            this.scene.sleep('WorldNavScene');
        }, this);
        this.add.existing(this.questButton);

        this.statsButton = new HiraButton(this, 60*4, 430 + 24, "Stats", style, () => {
            this.scene.launch('MessageScene', {message: { title : "Not yet implemented", body: "Under construction!"}});
            this.events.emit('disableLevels');
            this.scene.sleep('WorldNavScene');

        }, this);
        this.add.existing(this.statsButton);
        this.saveButton = new HiraButton(this, 60*11, 26, "Log out", style, () => {
            this.scene.launch('DialogBoxScene', { title: "Logging out", message: "Saving data", dataCapture: {}, api: 'logout' });
            this.events.emit('disableLevels');
            this.scene.sleep('WorldNavScene');

        }, this);
        this.add.existing(this.saveButton);

        this.prevButton.disable();

        let mainScene = this.scene.get('MainScene');
        mainScene.events.on('sayName', this.onSayName, this);
        mainScene.events.on('hoverOut', this.onHoverOut, this);

        this.caveName = new HiraText(this, 720/2, 25, "", "header");
        this.add.existing(this.caveName);
        this.caveName.visible = false;
    }

    onSayName(data) {
        this.levelTitle.fillRect(720/2 - data.name.length * 16, 2, data.name.length*32, 48);
        this.levelTitle.strokeRect(720/2 - data.name.length * 16, 2, data.name.length*32, 48);
        this.caveName.setTextUpper(data.name);
        this.caveName.visible = true;
        this.levelTitle.visible = true;
    }

    onHoverOut(data) {
        this.levelTitle.clear();
        this.caveName.visible = false;
        this.levelTitle.visible = false;
    }

    update () {


        if(this.navEnable === false) {
            this.container.visible = false;
            this.nextButton.visible = false;
            this.prevButton.visible = false;
            this.codexButton.visible = false;
            this.questButton.visible = false;
            this.statsButton.visible = false;
            this.saveButton.visible = false;
        } else {
            this.container.visible = true;
            this.prevButton.visible = true;
            this.nextButton.visible = true;
            this.codexButton.visible = true;
            this.questButton.visible = true;
            this.statsButton.visible = true;
            this.saveButton.visible = true;
        }


    }
}
