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

        this.cameras.main.setBounds(0, 0, 2048, 1024);

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
                     {sizeX: currentLevel.optionals.sizeX, sizeY: currentLevel.optionals.sizeY},
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
            }

            if(currentLevel.type === 'TrainScene') {
                this.trainLevels.push(new StoryLevel(this,
                     currentLevel.name,
                     {name: currentLevel.sprite.name, x: currentLevel.sprite.x, y: currentLevel.sprite.y},
                     '',
                     {sizeX: currentLevel.optionals.sizeX, sizeY: currentLevel.optionals.sizeY},
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
            }

            if(currentLevel.type === 'BattleScene') {
                this.practiceLevels.push(new StoryLevel(this,
                     currentLevel.name,
                     {name: currentLevel.sprite.name, x: currentLevel.sprite.x, y: currentLevel.sprite.y},
                     '',
                     {sizeX: currentLevel.optionals.sizeX, sizeY: currentLevel.optionals.sizeY},
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
            }
            console.log(this.world.storyLevels[i]);
        }
        /* ka dungeon */
        // this.dungeonK = new Dungeon(this,
        //     { name: 'K-Dungeon', level: 2, description:  'This dungeon is the first dungeon ever made in this game! Easter egg dungeons will be added later. I just need to test the word wrap on this.', charSet: ['KA','KI','KU','KE','KO','A','I','U','E','O'], wordPool: ['A-KA', 'KO-A', 'KA-KI', 'KU-O-KE', 'KI-KU', 'KO-O', 'KE-KE', 'KO-KO', 'KI-KU'] },
        //     { x: 360, y: 240, spriteName: 'k_cave', dungeonBG: {name: 'dungeon_wall', path: 'assets/images/k_dungeon/wall_texture.jpg'}, battleBG: {name: 'battleK', path: 'assets/images/k_dungeon/battlebackground.png'}},
        //     {
        //         minion: {
        //             name: 'goblin', path: 'assets/spritesheets/enemies/goblinidle.png', exp: 10,
        //             face: { name: 'goblinFace', path: 'assets/images/globals/goblinface.png'}
        //         },
        //         boss: {
        //             name:'goblinboss', path: 'assets/spritesheets/enemies/goblinbossidle.png', exp: 50,
        //             face: { name: 'goblinBossFace', path: 'assets/images/globals/goblinbossface.png'}
        //         }
        //     },
        //     {sizeX: 90, sizeY: 64},
        //     () => {
        //         this.scene.pause('MainScene');
        //         this.scene.launch('DetailScene', {player: this.player, dungeon: this.dungeonK, startScene: 'DungeonScene', passData: {player: this.player, dungeon: this.dungeonK, difficulty: game.global.EASY}});
        //     }
        //  );
        // this.add.existing(this.dungeonK);

        // this.level1 = new StoryLevel(this,
        //      'The K-invasion',
        //      {name: 'level', x: 220, y: 180},
        //      'level1.json',
        //      {sizeX: 16, sizeY:16},
        //      () => {
        //          this.scene.pause('MainScene');
        //          this.scene.launch('DetailScene', {player: this.player, content: {
        //              title: "Chapter I: Wtf",
        //              subtitle: "this should work",
        //              desc: "This is a place holder!"
        //          }, startScene: 'CutLoaderScene', passData: {jsonFile: 'level1.json'}});
        //      }
        //  );
        // this.add.existing(this.level1);
        //
        // this.trainLevel1 = new StoryLevel(this,
        //     'K-invasion: Training',
        //     {name: 'level', x: 260, y: 220},
        //     '',
        //     {sizeX: 12, sizeY: 12},
        //     () => {
        //         this.scene.pause('MainScene');
        //         this.scene.launch('DetailScene', {player: this.player, content: {
        //             title: "Chapter I: Wtf",
        //             subtitle: "Training",
        //             desc: "This is a place holder!"
        //         }, startScene: 'TrainScene', passData: {player: this.player, characterPool: ['KA','KI','KU','KE','KO']}});
        //     }
        // );
        // this.add.existing(this.trainLevel1);
        //
        // this.simulateLevel1 = new StoryLevel(this,
        //     'K-invasion: Simulate Battle',
        //     {name: 'level', x: 300, y: 240},
        //     '',
        //     {sizeX: 12, sizeY: 12},
        //     () => {
        //         this.scene.pause('MainScene');
        //         this.scene.launch('DetailScene', {player: this.player, content: {
        //             title: "Chapter I: Wtf",
        //             subtitle: "Simulate Battle",
        //             desc: "Dummy battle"
        //         }, startScene: 'BattleScene', passData: {player: this.player, simulate: true, wordPool: ['KA','KI','KU','KE','KO','A','I','U','E','O']}});
        //     }
        // );
        // this.add.existing(this.simulateLevel1);

        let learn = this.scene.get('CutScene');

        learn.events.removeListener('learnedNewCharacters');
        learn.events.on('learnedNewCharacters', this.onLearnedNewCharacters, this);

    }

    update (time, delta) {
        this.controls.update(delta);
    }

    onLearnedNewCharacters(data){
        this.player.learnNewCharacters(data);
        console.log('received', data);
    }



}
