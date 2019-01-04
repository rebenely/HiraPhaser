class WorldNavScene extends Phaser.Scene {

    constructor () {
        super('WorldNavScene');
    }

    init(data) {
        this.cam = data.camera;
    }
    create () {
        this.navEnable = false;
        this.coordinates = [{x:643, y:292}, {x: 705, y: 655}, {x: 1397, y: 531}, {x:1350, y:230}];
        this.zoom = [1.2, 1, 0.9, 2]
        this.cam.pan(this.coordinates[0].x, this.coordinates[0].y, 2000, 'Sine.easeInOut');
        this.cam.zoomTo(this.zoom[0], 2000);

        var style = { font: "16px manaspc", fill: "#ffffff", align: "left", wordWrap: { width: 680 - 90, useAdvancedWrap: true} };
        this.iterator = 0;
        this.prevButton = new HiraButton(this, 60, 440, "Prev", style, () => {
            if(this.navEnable === true){
                this.navEnable = false;
                if(this.iterator > 0){
                    this.iterator--;
                }
                this.cam.pan(this.coordinates[this.iterator].x, this.coordinates[this.iterator].y, 2000, 'Sine.easeInOut');
                this.cam.zoomTo(this.zoom[this.iterator], 2000);
            }
        }, this);
        this.add.existing(this.prevButton);

        this.nextButton = new HiraButton(this, 720 - 60, 440, "Next", style, () => {
            if(this.navEnable === true){
                this.navEnable = false;
                if(this.iterator < 3){
                    this.iterator++;
                }
                this.cam.pan(this.coordinates[this.iterator].x, this.coordinates[this.iterator].y, 2000, 'Sine.easeInOut');
                this.cam.zoomTo(this.zoom[this.iterator], 2000);
            }
        }, this);
        this.add.existing(this.nextButton);

        this.cam.on('camerapancomplete', function() {
            this.navEnable = true;
        }, this);
    }

    update () {

        if(this.iterator === 0 || this.navEnable === false) {
            this.prevButton.visible = false;
        } else {
            this.prevButton.visible = true;
        }

        if(this.iterator === 3 || this.navEnable === false){
            this.nextButton.visible = false;
        } else {
            this.nextButton.visible = true;
        }
    }
}
