class Dungeon {

    constructor(name, characterPool, wordPool, level, detail, minion, boss, background, battleBackground) {
        this.name = name;
        this.level = level;
        this.characterPool = characterPool;
        this.wordPool = wordPool;
        this.sprite = null;
        this.minionSprite = 'assets/spritesheets/' + minion + 'idle.png'
        this.bossSprite = 'assets/spritesheets/' + boss + 'idle.png'
        this.minionFace = 'assets/images/' + minion + 'face.png';
        this.bossFace = 'assets/images/' + boss + 'face.png';
        this.detail = detail;
        this.background = 'assets/images/' + background;
        this.battleBackground = 'assets/images/' + battleBackground;
        this.minionName = minion;
        this.bossName = boss;
    }
}
