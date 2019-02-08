class MainScene extends Phaser.Scene {

    constructor () {
        super('MainScene');
    }

    init (data) {
        this.player = data.player;
        this.world = data.world;
        this.announcement = data.announcement;
    }

    preload () {

    }

    create () {
        this.input.setDefaultCursor('url(assets/images/cursor/normal.cur), pointer');

        this.scene.launch('WorldNavScene', {camera: this.cameras.main});
        this.scene.sleep('WorldNavScene');
        this.scene.launch('MessageScene', {message: { title : this.announcement.title, body: this.announcement.body}});

        this.events.on('pause', function(){
            this.scene.sleep('WorldNavScene');
        }, this);
        this.events.on('wake', function(){
            this.scene.wake('WorldNavScene');
            this.enableInteractiveLevels();
        }, this);

        /* background */
        var grassland = this.add.sprite(0, 0, 'world_map').setOrigin(0).setScale(1.75).setDepth(3);

        this.clouds = this.add.group();
        this.clouds2 = this.add.group();
        this.clouds3 = this.add.group();

    	for (var i = 0; i < 50; i++) {
    		var x = Phaser.Math.RND.between(0, 2048);
    		var y = Phaser.Math.RND.between(0, 981);

    		var newObj = this.clouds.create(x, y, 'clouds').setScale(Phaser.Math.RND.between(1, 3));
            newObj.alpha = Math.random() + 0.2;
    	}
        for (var i = 0; i < 50; i++) {
            var x = Phaser.Math.RND.between(-2048, 0);
            var y = Phaser.Math.RND.between(0, 981);

            var newObj = this.clouds2.create(x, y, 'clouds').setScale(Phaser.Math.RND.between(1, 3));
            newObj.alpha = Math.random() + 0.2;
        }
        for (var i = 0; i < 20; i++) {
            var x = Phaser.Math.RND.between(-2048, 2048);
            var y = Phaser.Math.RND.between(0, 981);

            var newObj = this.clouds2.create(x, y, 'clouds').setScale(Phaser.Math.RND.between(3, 5));
            newObj.alpha = Math.random() + 0.2;
            newObj.setDepth(5);
        }

        this.cameras.main.setBounds(0, 0, 2048, 981);
        this.cameras.main.setBackgroundColor(0x28ccdf);


        this.dungeons = [];
        this.cutSceneLevels = [];
        this.trainLevels = [];
        this.practiceLevels = [];
        for(let i = 0; i < this.world.dungeons.length; i++){
            // this.dungeons.push();
            let currentDungeon =  this.world.dungeons[i];
            // console.log(this.world.dungeons[i]);
            this.dungeons.push( new Dungeon(this,
                { name: currentDungeon.name, level: currentDungeon.level, description:  currentDungeon.description, charSet: currentDungeon.charSet, wordPool: currentDungeon.wordPool },
                { x: currentDungeon.sprites.x, y: currentDungeon.sprites.y, spriteName: currentDungeon.sprites.name, dungeonBG: {name: currentDungeon.sprites.dungeonBG.name, path: currentDungeon.sprites.dungeonBG.path}, battleBG: {name: currentDungeon.sprites.battleBG.name, path: currentDungeon.sprites.battleBG.path}},
                {
                    minion: {
                        name: currentDungeon.enemies.minion.name, path: currentDungeon.enemies.minion.path, exp: currentDungeon.enemies.minion.exp,
                        face: { name: currentDungeon.enemies.minion.face.name, path: currentDungeon.enemies.minion.face.path},
                        attack: currentDungeon.enemies.minion.attack
                    },
                    boss: {
                        name: currentDungeon.enemies.boss.name, path: currentDungeon.enemies.boss.path, exp: currentDungeon.enemies.boss.exp,
                        face: { name: currentDungeon.enemies.boss.face.name, path: currentDungeon.enemies.boss.face.path},
                        attack: currentDungeon.enemies.boss.attack
                    }
                },
                {sizeX: currentDungeon.optionals.sizeX, sizeY: currentDungeon.optionals.sizeY},
                () => {
                    //this.scene.pause('MainScene');
                    this.scene.sleep('WorldNavScene');
                    this.disableInteractiveLevels();
                    this.scene.launch('DetailScene', {player: this.player, dungeon: this.dungeons[i], startScene: 'DungeonScene', passData: {player: this.player, dungeon: this.dungeons[i], difficulty: game.global.EASY}});
                }
            ));
            this.dungeons[i].comparePlayerLevel(this.player.story);
            this.add.existing(this.dungeons[i]);
        }
        for(let i = 0; i < this.world.storyLevels.length; i++){
            // this.dungeons.push();
            let currentLevel =  this.world.storyLevels[i];
            if(currentLevel.type === 'CutScene') {
                this.cutSceneLevels.push(new StoryLevel(this,
                     currentLevel.name,
                     {name: currentLevel.sprite.name, x: currentLevel.sprite.x, y: currentLevel.sprite.y},
                     currentLevel.json,
                     {sizeX: currentLevel.optionals.sizeX, sizeY: currentLevel.optionals.sizeY, level: currentLevel.level},
                     () => {
                         //this.scene.pause('MainScene');
                         this.scene.sleep('WorldNavScene');
                         this.disableInteractiveLevels();

                         this.scene.launch('DetailScene', {player: this.player, content: {
                             title: currentLevel.details.title,
                             subtitle:  currentLevel.details.subtitle,
                             desc:  currentLevel.details.desc
                         }, startScene: 'CutLoaderScene', passData: {jsonFile: currentLevel.json, story: currentLevel.level}});
                     }
                 ));
                 this.add.existing(this.cutSceneLevels[this.cutSceneLevels.length - 1]);
                 this.cutSceneLevels[this.cutSceneLevels.length - 1].comparePlayerLevel(this.player.story);

            }

            if(currentLevel.type === 'TrainScene') {
                this.trainLevels.push(new StoryLevel(this,
                     currentLevel.name,
                     {name: currentLevel.sprite.name, x: currentLevel.sprite.x, y: currentLevel.sprite.y},
                     '',
                     {sizeX: currentLevel.optionals.sizeX, sizeY: currentLevel.optionals.sizeY, level: currentLevel.level},
                     () => {
                     //this.scene.pause('MainScene');
                     this.scene.sleep('WorldNavScene');
                     this.disableInteractiveLevels();

                     this.scene.launch('DetailScene', {player: this.player, content: {
                         title: currentLevel.details.title,
                         subtitle:  currentLevel.details.subtitle,
                         desc:  currentLevel.details.desc
                     }, startScene: 'TrainScene', passData: {player: this.player, characterPool: currentLevel.characterPool, title: currentLevel.name, level: currentLevel.level} });
                     }
                 ));
                 this.add.existing(this.trainLevels[this.trainLevels.length - 1]);
                 this.trainLevels[this.trainLevels.length - 1].comparePlayerLevel(this.player.story);
            }

            if(currentLevel.type === 'BattleScene') {
                this.practiceLevels.push(new StoryLevel(this,
                     currentLevel.name,
                     {name: currentLevel.sprite.name, x: currentLevel.sprite.x, y: currentLevel.sprite.y},
                     '',
                     {sizeX: currentLevel.optionals.sizeX, sizeY: currentLevel.optionals.sizeY, level: currentLevel.level},
                     () => {
                     //this.scene.pause('MainScene');
                     this.scene.sleep('WorldNavScene');
                     this.disableInteractiveLevels();

                     this.scene.launch('DetailScene', {player: this.player, content: {
                         title: currentLevel.details.title,
                         subtitle:  currentLevel.details.subtitle,
                         desc:  currentLevel.details.desc
                     },startScene: 'BattleScene', passData: {player: this.player, simulate: true, wordPool: currentLevel.wordPool, mentor: currentLevel.mentor, level: currentLevel.level}});
                     }
                 ));
                 this.add.existing(this.practiceLevels[this.practiceLevels.length - 1]);
                 this.practiceLevels[this.practiceLevels.length - 1].comparePlayerLevel(this.player.story);
            }
            // console.log(this.world.storyLevels[i]);
        }

        /* emit events */
        let learn = this.scene.get('CutScene');
        learn.events.removeListener('learnedNewCharacters');
        learn.events.on('learnedNewCharacters', this.onLearnedNewCharacters, this);

        let finishedDungeon = this.scene.get('ResultScene');
        finishedDungeon.events.removeListener('finishedDungeon');
        finishedDungeon.events.on('finishedDungeon', this.onFinishedDungeon, this);

        let gameUI = this.scene.get('WorldNavScene');
        gameUI.events.removeListener('disableLevels');
        gameUI.events.on('disableLevels', this.disableInteractiveLevels, this);

        let trainScene = this.scene.get('TrainScene');
        trainScene.events.removeListener('finishedTraining');
        trainScene.events.on('finishedTraining', this.onTrainFinish, this);

        let practiceScene = this.scene.get('BattleScene');
        practiceScene.events.removeListener('finishedPractice');
        practiceScene.events.on('finishedPractice', this.onPracticeFinish, this);

        /* debug */
        this.input.on('pointerup', function (pointer) {
            console.log(pointer.worldX, pointer.worldY);
        });

        var cursors = this.input.keyboard.createCursorKeys();

        var controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            acceleration: 0.02,
          drag: 0.0005,
          maxSpeed: 1.0
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        /* ------------------------------------ */

        /* for objects that do not follow the conventions, aka mga di ko agad naisip pano kapag ganito */

        /* inn story level */
        this.cutSceneLevels[0].setDepth(2);

        /* ------------------------------------- */

        /* para di tumagos ung pindot sa main kapag may nakabukas na iba */
        this.disableInteractiveLevels();

        var style = { font: "16px manaspc", fill:  game.global.UI_TEXT_FILL, align: "center"}; /* itong style dapat ginlobal ko na lang eh hahaha */

        /* for alpha, mga kagaguhan ko lang */
        var nextArea0 = new HiraButton(this, 1000, 655, "Area not yet available!", style, () => {
            this.scene.launch('MessageScene', {message: { title : "Not yet implemented", body: "Will be available for next versions."}});
            this.events.emit('disableLevels');
            this.scene.sleep('WorldNavScene');
        }, this);
        this.add.existing(nextArea0);

        var nextArea1 = new HiraButton(this, 1565, 531, "Wala pa nga di ba?", style, () => {
            this.scene.launch('MessageScene', {message: { title : "Kulit mo rin eh", body: "Isa pang next mo ..."}});
            this.events.emit('disableLevels');
            this.scene.sleep('WorldNavScene');
        }, this);
        this.add.existing(nextArea1);

        var nextArea1 = new HiraButton(this, 1350, 100, "Ligma", style, () => {
            this.scene.launch('MessageScene', {message: { title : "Pindot pa", body: "Type mo konami code"}});
            this.events.emit('disableLevels');
            this.scene.sleep('WorldNavScene');
        }, this);
        this.add.existing(nextArea1);

        var secret = new HiraButton(this, 2035, 980, "Huli ka", style, () => {
            this.scene.launch('MessageScene', {message: { title : "Tanong", body: "Bakit madaling utuin ang mga nakababatang kapatid na lalake ng mga hapon? Kasi otouto."}});
            this.events.emit('disableLevels');
            this.scene.sleep('WorldNavScene');
        }, this);
        this.add.existing(secret);
    }

    update (time, delta) {
        this.controls.update(delta);

        this.clouds.getChildren().forEach(function (child) {﻿
            if(child.x > 2048 + child.width + 200) {
                child.x = -1024;
            }
            child.x += 2;
            // tween child

        });

        this.clouds2.getChildren().forEach(function (child) {﻿
            if(child.x > 2048 + child.width + 200) {
                child.x = -1024;
            }
            child.x += 3;
            // tween child

        });

        this.clouds3.getChildren().forEach(function (child) {﻿
            if(child.x > 2048 + child.width + 200) {
                child.x = -1024;
            }
            child.x += 4;
            // tween child

        });
    }

    /* emitted event from cutscene */
    onLearnedNewCharacters(data){
         // console.log(data.story);
        var updateCharset = false;

        if(!this.player.checkSubsetArray(data.charSet, data.story)){
            this.player.learnNewCharacters(data.charSet);
            this.player.story++;
            updateCharset = true;
        } else {
            data.message.title = "Saving Progress";
            data.message.message = "Please do not exit.";
        }

        this.compareStoryLevels(); /* for special case of learning nothing, player adds to story in its own function */

        // if(this.player.story <= data.story) { // check if player story is lower than dungeon story level
        //     this.player.story++;
        //     this.compareStoryLevels();
        //     updateCharset = true;
        // }

        this.scene.launch('DialogBoxScene', { story: this.player.story, title: data.message.title, message: data.message.message, dataCapture: {'username' : this.player.name, characters: data.charSet, timestamp: new Date(), updateCharset: updateCharset}, api: 'api/learn'});
        // console.log('received', data);
    }

    /* emmitted event from dungeon */
    onFinishedDungeon(data){
        // console.log(data);
        if(data.success && this.player.story <= data.story) { // check if player story is lower than dungeon story level
            this.player.story++;
            this.compareStoryLevels();
        }

        this.scene.launch('DialogBoxScene', {story: this.player.story, title: data.message.title, message: data.message.message, dataCapture: data.dataCapture, api: 'api/dungeon' });
    }

    onTrainFinish(data){
        if(data.success && this.player.story <= data.story) { // check if player story is lower than dungeon story level
            this.player.story++;
            this.compareStoryLevels();
        }
        // console.log(data);
        this.scene.launch('DialogBoxScene', { story: this.player.story, title: data.message.title, message: data.message.message, dataCapture: data.dataCapture, api: 'api/train' });
        // console.log(data.success, this.player.story, data.story)

    }

    onPracticeFinish(data){
        if(data.success && this.player.story <= data.story) { // check if player story is lower than dungeon story level
            this.player.story++;
            this.compareStoryLevels();
        }
        // console.log(data);
        data.dataCapture.username = this.player.name;
        this.scene.launch('DialogBoxScene', {story: this.player.story, title: data.message.title, message: data.message.message, dataCapture: data.dataCapture, api: 'api/practice' });
        // console.log(data.success, this.player.story, data.story)

    }

    compareStoryLevels() {
        // console.log('ayo update', this.player.story);
        for (let i = 0; i < this.cutSceneLevels.length; i ++) {
            this.cutSceneLevels[i].comparePlayerLevel(this.player.story);
        }
        for (let i = 0; i < this.trainLevels.length; i ++) {
            this.trainLevels[i].comparePlayerLevel(this.player.story);
        }
        for (let i = 0; i < this.practiceLevels.length; i ++) {
            this.practiceLevels[i].comparePlayerLevel(this.player.story);
        }
        for (let i = 0; i < this.dungeons.length; i ++) {
            this.dungeons[i].comparePlayerLevel(this.player.story);
        }
    }

    disableInteractiveLevels(tint){
        if(!tint){
            for (let i = 0; i < this.cutSceneLevels.length; i ++) {
                this.cutSceneLevels[i].disableInteractive();
            }
            for (let i = 0; i < this.trainLevels.length; i ++) {
                this.trainLevels[i].disableInteractive();
            }
            for (let i = 0; i < this.practiceLevels.length; i ++) {
                this.practiceLevels[i].disableInteractive();
            }
            for (let i = 0; i < this.dungeons.length; i ++) {
                this.dungeons[i].disableInteractive();
            }
        }
    }

    enableInteractiveLevels(tint){
        if(!tint){
            for (let i = 0; i < this.cutSceneLevels.length; i ++) {
                this.cutSceneLevels[i].setInteractive(true);
            }
            for (let i = 0; i < this.trainLevels.length; i ++) {
                this.trainLevels[i].setInteractive(true);
            }
            for (let i = 0; i < this.practiceLevels.length; i ++) {
                this.practiceLevels[i].setInteractive(true);
            }
            for (let i = 0; i < this.dungeons.length; i ++) {
                this.dungeons[i].setInteractive(true);
            }
        }
    }
}
