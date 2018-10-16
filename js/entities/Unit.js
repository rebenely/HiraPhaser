class Unit  {

    constructor(scene, x, y, type, hp, damage) {
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
    
}
