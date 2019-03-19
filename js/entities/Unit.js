class Unit  {

    constructor(scene, x, y, type, hp, damage) {
        /* not a sprite since it will not be always drawn in scenes that have it */
        // console.log('i received ', hp);
        this.name = type;
        this.maxHp = this.hp = hp;
        this.damage = damage; // default damage
        this.sprite = null;
        this.x = x;
        this.y = y;
        this.exp = 0;
        this.story = this.level = this.world = 0;
        this.maxExp = 100;
        this.characterPool = [];
        this.logs = [];
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
        // console.log(this.sprite);
        this.sprite = scene.physics.add.sprite(x, y, sprite);
        this.sprite.setScale(scale);
        this.sprite.anchor = 0.5;
        this.sprite.anims.play(anim, true);
    }

    learnNewCharacters(newChars){
        this.characterPool = this.characterPool.concat(newChars);
    }

    checkSubsetArray(newChars, story) {
        // console.log(this.characterPool);
        // console.log(newChars.every(val => this.characterPool.includes(val)));
        if(newChars.length === 0 && this.story <= story) {
            this.story++;
            return true;
        } else {
            return newChars.every(val => this.characterPool.includes(val));
        }
    }

    insertLog(log, level){
        var pushed = false;
        if(this.logs.length > 0) {
            for(let i = 0; i < this.logs.length && !pushed; i++) {
                if(level > this.logs[i].level) {
                    this.logs.splice(i, 0, {log: log, level: level});
                    pushed = true;
                }
            }
        }
        if(!pushed){
            this.logs.push({log: log, level: level});
        }

    }

}
