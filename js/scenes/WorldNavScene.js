class WorldNavScene extends Phaser.Scene {

    constructor () {
        super('WorldNavScene');
    }

    init(data) {
        this.cam = data.camera;
        this.player = data.player;

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
        this.coordinates = [{x:350, y:300, z: 1.1}, {x: 920, y: 795, z: 1.2}, {x: 1635, y: 310, z: 0.9}, {x:1800, y:910, z: 1.8}];
        this.cam.pan(this.coordinates[0].x, this.coordinates[0].y, 2000, 'Sine.easeInOut');
        this.cam.zoomTo(this.coordinates[0].z, 2000);

        var style = { font: "16px manaspc", fill:  game.global.UI_TEXT_FILL, align: "left"};
        this.iterator = 0;
        this.prevButton = new HiraButton(this, 60, 430 + 20, "Prev", style, () => {
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

        this.nextButton = new HiraButton(this, 60*11, 430 + 20, "Next", style, () => {
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
                this.cam.zoomTo(this.coordinates[this.iterator].z, 2000);
            }
        }, this);
        this.add.existing(this.nextButton);

        this.cam.on('camerapancomplete', function() {
            this.navEnable = true;
        }, this);

        this.codexButton = new HiraButton(this, 60*8, 430 + 20, "Review", style, () => {
            this.scene.launch('HintScene', {player: this.player, characterPool: this.player.characterPool, inDungeon: false});
            this.events.emit('disableLevels');
            this.scene.sleep('WorldNavScene');
        }, this);
        this.add.existing(this.codexButton);

        this.questButton = new HiraButton(this, 60*6, 430 + 20, "Story", style, () => {
            this.events.emit('quest');
        }, this);
        this.add.existing(this.questButton);
        this.questButton.alertBoi();
        var loggerOut = {
            title: 'Dashboard',
            desc: 'You have to be logged out before checking the dashboard.\nDo you want to logout?'
        };

        this.statsButton = new HiraButton(this, 60*4, 430 + 20, "Stats", style, () => {
            this.scene.launch('DetailScene', {player: this.player, content: loggerOut,  startScene: 'DialogBoxScene', passData: {openDash: true, title: "Logging out", message: "Saving data", dataCapture: {distracted: game.distracted, idle: game.idle}, api: 'logout' }});
            this.events.emit('disableLevels');
            this.scene.sleep('WorldNavScene');
        }, this);

        this.add.existing(this.statsButton);

        // this.sched = new HiraButton(this, 100, 430 + 20, "scheduler", style, () => {
        //     this.scene.launch('SchedulerScene', { player: this.player} );
        //     this.events.emit('disableLevels');
        //     this.scene.sleep('WorldNavScene');
        // }, this);
        //
        // this.add.existing(this.sched);
        this.saveButton = new HiraButton(this, 60*11, 26, "Log out", style, () => {
            this.scene.launch('DialogBoxScene', { title: "Logging out", message: "Saving data", dataCapture: {distracted: game.distracted, idle: game.idle}, api: 'logout' });
            this.events.emit('disableLevels');
            this.scene.sleep('WorldNavScene');

        }, this);
        this.add.existing(this.saveButton);


        this.prevButton.disable();

        let mainScene = this.scene.get('MainScene');
        mainScene.events.on('sayName', this.onSayName, this);
        mainScene.events.on('hoverOut', this.onHoverOut, this);
        mainScene.events.on('updateNextStory', this.onUpdateNextStory, this);

        this.caveName = new HiraText(this, 720/2, 25, "", "header");
        this.add.existing(this.caveName);

        this.subtitle = new HiraText(this, 720/2, 55, "", "basic");
        this.add.existing(this.subtitle);
        this.subtitle.visible = false;
        // this.onUpdateNextStory({level: { story_hack: this.player.story }});
    }

    onUpdateNextStory(data) {
        if(data.level.story_hack !== undefined) {
            data.level.world = Math.floor(data.level.story_hack/12);
        }
        // console.log(data.level.world, 'vs', this.iterator)

        if(this.iterator !== data.level.world) {
            this.iterator = data.level.world;
            this.navEnable = false;
            // console.log('iterator is ', this.iterator);

            if (this.iterator === 3) {
                this.nextButton.disable();
                this.prevButton.enable();
            }
            if(this.iterator < 3){
                this.prevButton.enable();
                this.nextButton.enable();
            }
            if (this.iterator === 0) {
                this.prevButton.disable();
                this.nextButton.enable();
            }



            this.cam.pan(this.coordinates[this.iterator].x, this.coordinates[this.iterator].y, 2000, 'Sine.easeInOut');
            this.cam.zoomTo(this.coordinates[this.iterator].z, 2000);
        }
    }

    onSayName(data) {
        data.deadline = data.deadline != undefined ? data.deadline : false;
        if(!data.deadline){
            this.levelTitle.fillRect(720/2 - data.name.length * 12, 4, data.name.length*24, 48);
            this.levelTitle.strokeRect(720/2 - data.name.length * 12, 4, data.name.length*24, 48);
            this.caveName.setTextUpper(data.name);
            this.caveName.visible = true;
            this.levelTitle.visible = true;
        } else {


            var found = -1;
            for(let i = 0; i < this.player.schedule.length && found == -1; i++) {
                // console.log(data.name, 'vs', this.player.schedule[i]);

                if(this.player.schedule[i].dungeon === data.name) {
                    found = i;
                }
            }
            if(found != -1) {
                this.levelTitle.fillRect(720/2 - data.name.length * 12, 4, data.name.length*24, 70);
                this.levelTitle.strokeRect(720/2 - data.name.length * 12, 4, data.name.length*24, 70);
                this.caveName.setTextUpper(data.name);
                this.subtitle.setTextUpper(this.player.schedule[found].deadline);
                this.caveName.visible = true;
                this.levelTitle.visible = true;
                this.subtitle.visible = true;
            } else {
                this.levelTitle.fillRect(720/2 - data.name.length * 12, 4, data.name.length*24, 48);
                this.levelTitle.strokeRect(720/2 - data.name.length * 12, 4, data.name.length*24, 48);
                this.caveName.setTextUpper(data.name);
                this.caveName.visible = true;
                this.levelTitle.visible = true;
            }

        }

    }

    onHoverOut(data) {
        this.levelTitle.clear();
        this.caveName.visible = false;
        this.levelTitle.visible = false;
        this.subtitle.visible = false;
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
