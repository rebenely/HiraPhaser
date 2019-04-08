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
        this.nextStory = {};

        this.input.setDefaultCursor('url(assets/images/cursor/normal.png), pointer');

        this.scene.launch('WorldNavScene', {camera: this.cameras.main, player: this.player});
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

            var newObj = this.clouds3.create(x, y, 'clouds').setScale(Phaser.Math.RND.between(3, 5));
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
                { name: currentDungeon.name, level: currentDungeon.level, description:  currentDungeon.description, charSet: currentDungeon.charSet, wordPool: currentDungeon.wordPool, log: currentDungeon.log, world: currentDungeon.world },
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
                    this.scene.launch('DetailScene', {player: this.player, dungeon: this.dungeons[i], startScene: 'DungeonScene', passData: {player: this.player, dungeon: this.dungeons[i], difficulty: game.global.NORMAL, log: currentDungeon.log}});
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
                         }, startScene: 'CutLoaderScene', passData: {player: this.player, jsonFile: currentLevel.json, story: currentLevel.level, log: currentLevel.log, world: currentLevel.world}});
                     },
                     currentLevel.log, currentLevel.world));
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
                     }, startScene: 'TrainScene', passData: {player: this.player, characterPool: currentLevel.characterPool, title: currentLevel.name, level: currentLevel.level, log: currentLevel.log, world: currentLevel.world} });
                 }, currentLevel.log, currentLevel.world));
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
                     },startScene: 'BattleScene', passData: {player: this.player, simulate: true, wordPool: currentLevel.wordPool, mentor: currentLevel.mentor, level: currentLevel.level, log: currentLevel.log, world: currentLevel.world}});
                    },
                    currentLevel.log, currentLevel.world
                 ));
                 this.add.existing(this.practiceLevels[this.practiceLevels.length - 1]);
                 this.practiceLevels[this.practiceLevels.length - 1].comparePlayerLevel(this.player.story);
            }
            // console.log(this.world.storyLevels[i]);
        }

        /* load logs, maybe refactor charset too similar to this */
        for(let i = 0; i < this.cutSceneLevels.length && i < this.player.story; i++) {

            // this.player.learnNewCharacters(this.cutSceneLevels[i].fileName['teach']);
            // console.log(this.cutSceneLevels[i].log);
            if(this.player.story > this.cutSceneLevels[i].level){
                this.player.insertLog(this.cutSceneLevels[i].log, this.cutSceneLevels[i].level);
            }

            // if(i < this.trainLevels.length && this.player.story > this.trainLevels[i].level) {
            //     // console.log(this.trainLevels[i].log);
            //     this.player.insertLog(this.trainLevels[i].log, this.trainLevels[i].level);
            // }
            // if(i < this.practiceLevels.length && this.player.story > this.practiceLevels[i].level) {
            //     // console.log(this.practiceLevels[i].log);
            //     this.player.insertLog(this.practiceLevels[i].log, this.practiceLevels[i].level);
            // }

            if(i < this.dungeons.length && this.player.story > this.dungeons[i].level) {
                this.player.insertLog(this.dungeons[i].log, this.dungeons[i].level);
                // console.log(this.dungeons[i].log);
            }
        }
        // console.log(this.player.logs);
        this.compareStoryLevels();
        // this.onQuest();


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

        let worldNavScene = this.scene.get('WorldNavScene');
        worldNavScene.events.removeListener('quest');
        worldNavScene.events.on('quest', this.onQuest, this);

        /* debug */
        this.input.on('pointerup', function (pointer) {
            console.log(pointer.worldX, pointer.worldY);
        });

        // var cursors = this.input.keyboard.createCursorKeys();
        //
        // var controlConfig = {
        //     camera: this.cameras.main,
        //     left: cursors.left,
        //     right: cursors.right,
        //     up: cursors.up,
        //     down: cursors.down,
        //     acceleration: 0.02,
        //   drag: 0.0005,
        //   maxSpeed: 1.0
        // };
        //
        // this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        /* ------------------------------------ */

        /* for objects that do not follow the conventions, aka mga di ko agad naisip pano kapag ganito */

        /* inn story level */
        this.cutSceneLevels[0].setDepth(2);

        /* ------------------------------------- */

        /* para di tumagos ung pindot sa main kapag may nakabukas na iba */
        this.disableInteractiveLevels();
        //
        // var style = { font: "16px manaspc", fill:  game.global.UI_TEXT_FILL, align: "center"}; /* itong style dapat ginlobal ko na lang eh hahaha */
        //
        // /* for alpha, mga kagaguhan ko lang */
        // var nextArea0 = new HiraButton(this, 1000, 655, "Area not yet available!", style, () => {
        //     this.scene.launch('MessageScene', {message: { title : "Not yet implemented", body: "Will be available for next versions."}});
        //     this.events.emit('disableLevels');
        //     this.scene.sleep('WorldNavScene');
        // }, this);
        // this.add.existing(nextArea0);
        //
        // var nextArea1 = new HiraButton(this, 1565, 531, "Wala pa nga di ba?", style, () => {
        //     this.scene.launch('MessageScene', {message: { title : "Kulit mo rin eh", body: "Isa pang next mo ..."}});
        //     this.events.emit('disableLevels');
        //     this.scene.sleep('WorldNavScene');
        // }, this);
        // this.add.existing(nextArea1);
        //
        // var nextArea1 = new HiraButton(this, 1350, 100, "Ligma", style, () => {
        //     this.scene.launch('MessageScene', {message: { title : "Pindot pa", body: "Type mo konami code"}});
        //     this.events.emit('disableLevels');
        //     this.scene.sleep('WorldNavScene');
        // }, this);
        // this.add.existing(nextArea1);
        //
        var style = { font: "24px manaspc", fill: game.global.UI_TEXT_FILL, align: "left", wordWrap: { width: 400, useAdvancedWrap: true} };
        var secret = new HiraButton(this, 1705, 860, "Credits", style, () => {
            this.scene.launch('MessageScene', {message: { title : "Credits", body: "Sounds by Juhani Junkala. Sprites by me (that's why they're bad lol). Font by Hjort Nidudsson."}});
            this.events.emit('disableLevels');
            this.scene.sleep('WorldNavScene');
        }, this);
        this.add.existing(secret);

    }

    onQuest(){
        this.events.emit('updateNextStory', {level: this.nextStory});
        this.nextStory.alert();
    }

    update (time, delta) {
        // this.controls.update(delta);

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
        var player_story_b4 = this.player.story;
        if(this.player.story <= data.story){
            this.player.insertLog(data.log, data.story);
        }

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
        // console.log(data);
        if(data.sched != undefined) {

            this.scene.launch('DialogBoxScene', { sched: data.sched, player_story: player_story_b4, story: data.story, update_story: this.player.story, title: data.message.title, message: data.message.message, dataCapture: {'username' : this.player.name, characters: data.charSet, updateCharset: updateCharset, timestamp: data.timestamp, total_time: data.total_time, sched: data.sched}, api: 'api/learn'});
        } else {
            this.scene.launch('DialogBoxScene', { player_story: player_story_b4, story: data.story, update_story: this.player.story, title: data.message.title, message: data.message.message, dataCapture: {'username' : this.player.name, characters: data.charSet, updateCharset: updateCharset, timestamp: data.timestamp, total_time: data.total_time}, api: 'api/learn'});
        }
        // console.log('received', data);
    }

    /* emmitted event from dungeon */
    onFinishedDungeon(data){
        var player_story_b4 = this.player.story;
        // console.log(data);
        if(data.success && this.player.story <= data.story) { // check if player story is lower than dungeon story level
            this.player.story++;
            this.compareStoryLevels();
            this.player.insertLog(data.log, data.story);
        }

        this.scene.launch('DialogBoxScene', {player_story: player_story_b4, story: data.story, update_story: this.player.story, title: data.message.title, message: data.message.message, dataCapture: data.dataCapture, api: 'api/dungeon' });
    }

    onTrainFinish(data){
        var player_story_b4 = this.player.story;
        if(data.success && this.player.story <= data.story) { // check if player story is lower than dungeon story level
            this.player.story++;
            this.compareStoryLevels();
            // this.player.insertLog(data.log, data.story);
        }
        // console.log(data);
        this.scene.launch('DialogBoxScene', { player_story: player_story_b4, story: data.story, update_story: this.player.story, title: data.message.title, message: data.message.message, dataCapture: data.dataCapture, api: 'api/train' });
        // console.log(data.success, this.player.story, data.story)

    }

    onPracticeFinish(data){
        var player_story_b4 = this.player.story;
        if(data.success && this.player.story <= data.story) { // check if player story is lower than dungeon story level
            this.player.story++;
            this.compareStoryLevels();
            // this.player.insertLog(data.log, data.story);
        }
        // console.log(data);
        data.dataCapture.username = this.player.name;
        this.scene.launch('DialogBoxScene', {player_story: player_story_b4, story: data.story, update_story: this.player.story, title: data.message.title, message: data.message.message, dataCapture: data.dataCapture, api: 'api/practice' });
        // console.log(data.success, this.player.story, data.story)

    }

    compareStoryLevels() {
        // console.log('ayo update', this.player.story);
        var nextStory = this.cutSceneLevels[0];
        for (let i = 0; i < this.cutSceneLevels.length; i ++) {
            if(this.cutSceneLevels[i].comparePlayerLevel(this.player.story)) {
                if(nextStory.story < this.cutSceneLevels[i].story) {
                    nextStory = this.cutSceneLevels[i];
                }
            }

            if(i < this.trainLevels.length && this.trainLevels[i].comparePlayerLevel(this.player.story)) {
                if(nextStory.story < this.trainLevels[i].story) {
                    nextStory = this.trainLevels[i];
                }
            }

            if(i < this.practiceLevels.length && this.practiceLevels[i].comparePlayerLevel(this.player.story)) {
                if(nextStory.story < this.practiceLevels[i].story) {
                    nextStory = this.practiceLevels[i];
                }
            }

            if(i < this.dungeons.length && this.dungeons[i].comparePlayerLevel(this.player.story)) {
                if(nextStory.story < this.dungeons[i].story) {
                    nextStory = this.dungeons[i];
                }
            }
        }
        this.nextStory = nextStory;

        // console.log(nextStory.name, 'world', this.nextStory.world);
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
