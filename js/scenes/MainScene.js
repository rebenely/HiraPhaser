class MainScene extends Phaser.Scene {

    constructor () {
        super('MainScene');
    }

    init (data) {
        this.player = data.player;
        this.world = data.world;
    }

    preload () {

    }

    create () {



        /* background */
        var grassland = this.add.sprite(0, 0, 'world_map').setOrigin(0);
        // grassland.setScale(3);

        this.cameras.main.setBounds(0, 0, 2048, 981);

        console.log(this.world);

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
        this.dungeons = [];
        this.cutSceneLevels = [];
        this.trainLevels = [];
        this.practiceLevels = [];
        for(let i = 0; i < this.world.dungeons.length; i++){
            // this.dungeons.push();
            let currentDungeon =  this.world.dungeons[i];
            console.log(this.world.dungeons[i]);
            this.dungeons.push( new Dungeon(this,
                { name: currentDungeon.name, level: currentDungeon.level, description:  currentDungeon.description, charSet: currentDungeon.charSet, wordPool: currentDungeon.wordPool },
                { x: currentDungeon.sprites.x, y: currentDungeon.sprites.y, spriteName: currentDungeon.sprites.name, dungeonBG: {name: currentDungeon.sprites.dungeonBG.name, path: currentDungeon.sprites.dungeonBG.path}, battleBG: {name: currentDungeon.sprites.battleBG.name, path: currentDungeon.sprites.battleBG.path}},
                {
                    minion: {
                        name: currentDungeon.enemies.minion.name, path: currentDungeon.enemies.minion.path, exp: currentDungeon.enemies.minion.exp,
                        face: { name: currentDungeon.enemies.minion.face.name, path: currentDungeon.enemies.minion.face.path}
                    },
                    boss: {
                        name: currentDungeon.enemies.boss.name, path: currentDungeon.enemies.boss.path, exp: currentDungeon.enemies.boss.exp,
                        face: { name: currentDungeon.enemies.boss.face.name, path: currentDungeon.enemies.boss.face.path}
                    }
                },
                {sizeX: currentDungeon.optionals.sizeX, sizeY: currentDungeon.optionals.sizeY},
                () => {
                    this.scene.pause('MainScene');
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
                         this.scene.pause('MainScene');
                         this.scene.launch('DetailScene', {player: this.player, content: {
                             title: currentLevel.details.title,
                             subtitle:  currentLevel.details.subtitle,
                             desc:  currentLevel.details.desc
                         }, startScene: 'CutLoaderScene', passData: {jsonFile: currentLevel.json}});
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
                     this.scene.pause('MainScene');
                     this.scene.launch('DetailScene', {player: this.player, content: {
                         title: currentLevel.details.title,
                         subtitle:  currentLevel.details.subtitle,
                         desc:  currentLevel.details.desc
                     }, startScene: 'TrainScene', passData: {player: this.player, characterPool: currentLevel.characterPool}});
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
                     this.scene.pause('MainScene');
                     this.scene.launch('DetailScene', {player: this.player, content: {
                         title: currentLevel.details.title,
                         subtitle:  currentLevel.details.subtitle,
                         desc:  currentLevel.details.desc
                     },startScene: 'BattleScene', passData: {player: this.player, simulate: true, wordPool: currentLevel.wordPool}});
                     }
                 ));
                 this.add.existing(this.practiceLevels[this.practiceLevels.length - 1]);
                 this.practiceLevels[this.practiceLevels.length - 1].comparePlayerLevel(this.player.story);
            }
            console.log(this.world.storyLevels[i]);
        }

        /* emit events */
        let learn = this.scene.get('CutScene');
        learn.events.removeListener('learnedNewCharacters');
        learn.events.on('learnedNewCharacters', this.onLearnedNewCharacters, this);

        let finishedDungeon = this.scene.get('ResultScene');
        finishedDungeon.events.removeListener('finishedDungeon');
        finishedDungeon.events.on('finishedDungeon', this.onFinishedDungeon, this);

        /* debug */
        this.input.on('pointerup', function (pointer) {
            console.log(pointer.worldX, pointer.worldY);
        });
    }

    update (time, delta) {
        this.controls.update(delta);
    }

    onLearnedNewCharacters(data){
        console.log(data);
        if(!this.player.checkSubsetArray(data.charSet)){
            this.scene.launch('DialogBoxScene', {title: data.message.title, message: data.message.message});
            this.player.learnNewCharacters(data.charSet);
            this.player.story++;
        }
        this.compareStoryLevels();
        console.log('received', data);
    }

    onFinishedDungeon(data){
        console.log(data);
        if(data) {
            this.scene.launch('DialogBoxScene', {title: data.message.title, message: data.message.message });
            this.player.story++;
            this.compareStoryLevels();
        }
    }

    compareStoryLevels() {
        console.log('ayo update', this.player.story);
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


}
