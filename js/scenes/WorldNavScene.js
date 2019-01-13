class WorldNavScene extends Phaser.Scene {

    constructor () {
        super('WorldNavScene');
    }

    init(data) {
        this.cam = data.camera;
    }
    create () {

        this.container = this.add.graphics();

        var color = 0x909090;
        var thickness = 2;
        var alpha = 1;

        this.container.lineStyle(thickness, color, alpha);

        this.container.fillGradientStyle(0x404040, 0x404040,0x202020, 0x202020, 0.8);
        this.container.fillRect(0, 430, 720, 48);
        this.container.strokeRect(0, 430, 720, 48);

        this.navEnable = false;
        this.coordinates = [{x:643, y:292}, {x: 705, y: 655}, {x: 1397, y: 531}, {x:1350, y:230}];
        this.zoom = [1.2, 1, 0.9, 2]
        this.cam.pan(this.coordinates[0].x, this.coordinates[0].y, 2000, 'Sine.easeInOut');
        this.cam.zoomTo(this.zoom[0], 2000);

        var style = { font: "16px manaspc", fill: "#ffffff", align: "left", wordWrap: { width: 680 - 90, useAdvancedWrap: true} };
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
                this.cam.zoomTo(this.zoom[this.iterator], 2000);
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

        }, this);
        this.add.existing(this.codexButton);

        this.questButton = new HiraButton(this, 60*6, 430 + 24, "Quest", style, () => {

        }, this);
        this.add.existing(this.questButton);

        this.statsButton = new HiraButton(this, 60*4, 430 + 24, "Stats", style, () => {

        }, this);
        this.add.existing(this.statsButton);

        this.prevButton.disable();

    }

    update () {


        if(this.navEnable === false) {
            this.container.visible = false;
            this.nextButton.visible = false;
            this.prevButton.visible = false;
            this.codexButton.visible = false;
            this.questButton.visible = false;
            this.statsButton.visible = false;
        } else {
            this.container.visible = true;
            this.prevButton.visible = true;
            this.nextButton.visible = true;
            this.codexButton.visible = true;
            this.questButton.visible = true;
            this.statsButton.visible = true;
        }


    }
}
