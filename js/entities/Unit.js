class Unit  {

    constructor(scene, x, y, type, hp, damage) {
        /* not a sprite since it will not be always drawn in scenes that have it */
        console.log('i received ', hp);
        this.type = type;
        this.maxHp = this.hp = hp;
        this.damage = damage; // default damage
        this.sprite = null;
        this.x = x;
        this.y = y;
        this.exp = 0;
        this.level = 1;
        this.maxExp = 100;
        this.characterPool = [];
        this.story = 0;
    }

    levelUp () {
        if (this.exp >= this.maxExp) {
            this.level++;
            this.exp = 0;
            this.maxExp = 100 * this.level;
            return true;
        } else {
            return false;
        }
    }

    createSprite (scene, sprite, anim, x, y, scale) {
        console.log(this.sprite);
        this.sprite = scene.physics.add.sprite(x, y, sprite);
        this.sprite.setScale(scale);
        this.sprite.anchor = 0.5;
        this.sprite.anims.play(anim, true);
    }

    learnNewCharacters(newChars){
        this.characterPool = this.characterPool.concat(newChars);
    }

    checkSubsetArray(newChars) {
        console.log(newChars.every(val => this.characterPool.includes(val)));
        return newChars.every(val => this.characterPool.includes(val));
    }

}
