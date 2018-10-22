class MainScene extends Phaser.Scene {

    constructor () {
        super('MainScene');
    }

    init (data) {
        this.player = data.player;
    }

    preload () {

    }

    create () {
        /* background */
        var grassland = this.add.sprite(0, 0, 'grassland');
        grassland.setScale(3);

        /* ka dungeon */
        this.dungeonK = new Dungeon(this,
            {name: 'K-Dungeon', level: 2, description:  'This dungeon is the first dungeon ever made in this game! Easter egg dungeons will be added later. I just need to test the word wrap on this.', charSet: ['KA','KI','KU','KE','KO','A','I','U','E','O'], wordPool: ['A-KA', 'KO-A', 'KA-KI', 'KU-O-KE', 'KI-KU', 'KO-O', 'KE-KE', 'KO-KO', 'KI-KU'] },
            { x: 360, y: 240, spriteName: 'cave', dungeonBG: 'wall_texture.jpg', battleBG: 'battlebackground.png'},
            { minion: { name: 'goblin', exp: 10} , boss: {name:'goblinboss', exp: 50}},
            {sizeX: 90, sizeY: 64},
            () => {
                this.scene.pause('MainScene');
                this.scene.launch('DungeonDetailScene', {player: this.player, dungeon: this.dungeonK});
            }
         );
        this.add.existing(this.dungeonK);

        this.level1 = new StoryLevel(this,
             'The K-invasion',
             {name: 'level', x: 220, y: 180},
             'level1.json',
             {sizeX: 16, sizeY:16},
             () => {
                 this.scene.pause('MainScene');
                 this.scene.launch('CutLoaderScene', {jsonFile: 'level1.json'});
             }
         );
        this.add.existing(this.level1);

        this.trainLevel1 = new StoryLevel(this,
            'K-invasion: Training',
            {name: 'level', x: 260, y: 220},
            '',
            {sizeX: 12, sizeY: 12},
            () => {
                this.scene.pause('MainScene');
                this.scene.launch('TrainScene', {player: this.player, characterPool: ['KA','KI','KU','KE','KO']});
            }
        );
        this.add.existing(this.trainLevel1);

        this.simulateLevel1 = new StoryLevel(this,
            'K-invasion: Simulate Battle',
            {name: 'level', x: 300, y: 240},
            '',
            {sizeX: 12, sizeY: 12},
            () => {
                this.scene.pause('MainScene');
                this.scene.launch('BattleScene', {player: this.player, simulate: true, wordPool: ['KA','KI','KU','KE','KO','A','I','U','E','O']});
            }
        );
        this.add.existing(this.simulateLevel1);
    }

    update () {

    }



}
