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
        this.dungeonK = new Dungeon('K-Dungeon',['KA','KI','KU','KE','KO','A','I','U','E','O'], ['A-KA', 'KO-A', 'KA-KI', 'KU-O-KE', 'KI-KU', 'KO-O', 'KE-KE', 'KO-KO', 'KI-KU'], 2, 'This dungeon is the first dungeon ever made in this game! Easter egg dungeons will be added later. I just need to test the word wrap on this.', 'goblin', 'goblinboss' , 'wall_texture.jpg', 'battlebackground.png');
        this.hoverCount = 0;

        this.dungeonK.sprite = this.add.sprite(360, 240, 'cave');
        this.dungeonK.sprite.setOrigin(0.5);
        this.dungeonK.sprite.setDisplaySize(90,64);
        this.dungeonK.sprite.setSize(90,64);

        var style = { font: "16px Courier", fill: "#00ff44" };
        var caveName = this.add.text(0, 0, "Kweba", style);
        caveName.visible = false;
        this.dungeonK.sprite.setInteractive();
        this.dungeonK.sprite.on('pointerdown', this.onClick, {name: caveName, dungeon: this.dungeonK, gamecontext: this});
        this.dungeonK.sprite.on('pointerover', this.onHover, {name: caveName, gamecontext: this});
        this.dungeonK.sprite.on('pointerout', this.onHoverOut, {name: caveName});

        Phaser.Display.Align.To.TopCenter(caveName, this.dungeonK.sprite, 0, 0);

    }

    update () {

    }

    onClick () {
        console.log('ayie ', this.dungeon.detail);
        this.name.visible = false;
        this.gamecontext.scene.pause('MainScene');
        this.gamecontext.scene.launch('DungeonDetailScene', {player: this.gamecontext.player, dungeon: this.dungeon})
        //this.gamecontext.scene.launch('BattleScene', {enemy: 'Trial0', difficulty: 'easy', player: this.gamecontext.player});
    }

    onHover () {
        this.gamecontext.hoverCount += 1;

        console.log('ayie ', this.gamecontext.hoverCount);
        this.name.visible = true;
    }

    onHoverOut () {
        console.log('awo');
        this.name.visible = false;
    }

}
