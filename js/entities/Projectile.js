class Projectile extends Phaser.GameObjects.BitmapText {

    constructor(scene, x, y, font, characterPool) {
        super(scene, x, y, font, '');

        // console.log('created!');
        this.x = x;
        this.y = y;
        this.characterPool = characterPool;
        this.currentChar = '';
        this.chars = [];
        this.setOrigin(0.5);
        this.visible = false;
        this.characterPool = this.shuffle(characterPool);
        this.iterator = 0;
        // console.log('char pool length', this.characterPool.length)
    }

    say(text) {
        this.currentChar = text;
        this.chars = this.currentChar.split('-');
        this.currentChar = this.currentChar.replace(/-/g, '');
        // console.log('new char', this.currentChar);
        this.setText(this.getHiragana());
    }

    getRandomCharacter () {
        // console.log('iterator ', this.iterator, this.characterPool);
        this.currentChar = this.characterPool[this.iterator];
        this.chars = this.currentChar.split('-');
        this.currentChar = this.currentChar.replace(/-/g, '');
        // console.log('new char', this.currentChar);
        this.setText(this.getHiragana());
        if(this.iterator < this.characterPool.length - 1) {
            this.iterator++;
        } else {
            // console.log('go here');
            this.characterPool = this.shuffle(this.characterPool);
            this.iterator = 0;
        }

    }

    getHiragana () {
        var charString = '';

        for( var i = 0; i < this.chars.length; i++ ){
            charString += Projectile.convertToHiragana(this.chars[i]);
        }
        // console.log('yikes ', charString);
        return charString;
    }
    static convertToHiragana (text) {
        var charString = '';


        switch(text) {
            case 'A':
                charString = charString.concat(String.fromCharCode(12354));
            break;
            case 'I':
                charString = charString.concat(String.fromCharCode(12356));
            break;
            case 'U':
                charString = charString.concat(String.fromCharCode(12358));
            break;
            case 'E':
                charString = charString.concat(String.fromCharCode(12360));
            break;
            case 'O':
                charString = charString.concat(String.fromCharCode(12362));
            break;
            case 'KA':
                charString = charString.concat(String.fromCharCode(12363));
            break;
            case 'KI':
                charString = charString.concat(String.fromCharCode(12365));
            break;
            case 'KU':
                charString = charString.concat(String.fromCharCode(12367));
            break;
            case 'KE':
                charString = charString.concat(String.fromCharCode(12369));
            break;
            case 'KO':
                charString = charString.concat(String.fromCharCode(12371));
            break;
            case 'GA':
                charString = charString.concat(String.fromCharCode(12364));
            break;
            case 'GI':
                charString = charString.concat(String.fromCharCode(12366));
            break;
            case 'GU':
                charString = charString.concat(String.fromCharCode(12368));
            break;
            case 'GE':
                charString = charString.concat(String.fromCharCode(12370));
            break;
            case 'GO':
                charString = charString.concat(String.fromCharCode(12372));
            break;
            case 'SA':
                charString = charString.concat(String.fromCharCode(12373));
            break;
            case 'SHI':
                charString = charString.concat(String.fromCharCode(12375));
            break;
            case 'SU':
                charString = charString.concat(String.fromCharCode(12377));
            break;
            case 'SE':
                charString = charString.concat(String.fromCharCode(12379));
            break;
            case 'SO':
                charString = charString.concat(String.fromCharCode(12381));
            break;
            case 'ZA':
                charString = charString.concat(String.fromCharCode(12374));
            break;
            case 'ZI':
                charString = charString.concat(String.fromCharCode(12376));
            break;
            case 'ZU':
                charString = charString.concat(String.fromCharCode(12378));
            break;
            case 'ZE':
                charString = charString.concat(String.fromCharCode(12380));
            break;
            case 'ZO':
                charString = charString.concat(String.fromCharCode(12382));
            break;
            case 'TA':
                charString = charString.concat(String.fromCharCode(12383));
            break;
            case 'CHI':
                charString = charString.concat(String.fromCharCode(12385));
            break;
            case 'TSU':
                charString = charString.concat(String.fromCharCode(12388));
            break;
            case 'TE':
                charString = charString.concat(String.fromCharCode(12390));
            break;
            case 'TO':
                charString = charString.concat(String.fromCharCode(12392));
            break;
            case 'DA':
                charString = charString.concat(String.fromCharCode(12384));
            break;
            case 'DI':
                charString = charString.concat(String.fromCharCode(12386));
            break;
            case 'DU':
                charString = charString.concat(String.fromCharCode(12389));
            break;
            case 'DE':
                charString = charString.concat(String.fromCharCode(12391));
            break;
            case 'DO':
                charString = charString.concat(String.fromCharCode(12393));
            break;
            case 'NA':
                charString = charString.concat(String.fromCharCode(12394));
            break;
            case 'NI':
                charString = charString.concat(String.fromCharCode(12395));
            break;
            case 'NU':
                charString = charString.concat(String.fromCharCode(12396));
            break;
            case 'NE':
                charString = charString.concat(String.fromCharCode(12397));
            break;
            case 'NO':
                charString = charString.concat(String.fromCharCode(12398));
            break;
            case 'HA':
                charString = charString.concat(String.fromCharCode(12399));
            break;
            case 'HI':
                charString = charString.concat(String.fromCharCode(12402));
            break;
            case 'HU':
                charString = charString.concat(String.fromCharCode(12405));
            break;
            case 'HE':
                charString = charString.concat(String.fromCharCode(12408));
            break;
            case 'HO':
                charString = charString.concat(String.fromCharCode(12411));
            break;
            case 'BA':
                charString = charString.concat(String.fromCharCode(12400));
            break;
            case 'BI':
                charString = charString.concat(String.fromCharCode(12403));
            break;
            case 'BU':
                charString = charString.concat(String.fromCharCode(12406));
            break;
            case 'BE':
                charString = charString.concat(String.fromCharCode(12409));
            break;
            case 'PO':
                charString = charString.concat(String.fromCharCode(12412));
            break;
            case 'PA':
                charString = charString.concat(String.fromCharCode(12401));
            break;
            case 'PI':
                charString = charString.concat(String.fromCharCode(12404));
            break;
            case 'PU':
                charString = charString.concat(String.fromCharCode(12407));
            break;
            case 'PE':
                charString = charString.concat(String.fromCharCode(12410));
            break;
            case 'PO':
                charString = charString.concat(String.fromCharCode(12413));
            break;
            case 'MA':
                charString = charString.concat(String.fromCharCode(12414));
            break;
            case 'MI':
                charString = charString.concat(String.fromCharCode(12415));
            break;
            case 'MU':
                charString = charString.concat(String.fromCharCode(12416));
            break;
            case 'ME':
                charString = charString.concat(String.fromCharCode(12417));
            break;
            case 'MO':
                charString = charString.concat(String.fromCharCode(12418));
            break;
            case 'YA':
                charString = charString.concat(String.fromCharCode(12420));
            break;
            case 'YU':
                charString = charString.concat(String.fromCharCode(12422));
            break;
            case 'YO':
                charString = charString.concat(String.fromCharCode(12424));
            break;
            case 'RA':
                charString = charString.concat(String.fromCharCode(12425));
            break;
            case 'RI':
                charString = charString.concat(String.fromCharCode(12425));
            break;
            case 'RU':
                charString = charString.concat(String.fromCharCode(12426));
            break;
            case 'RE':
                charString = charString.concat(String.fromCharCode(12428));
            break;
            case 'RO':
                charString = charString.concat(String.fromCharCode(12429));
            break;
            case 'WA':
                charString = charString.concat(String.fromCharCode(12431));
            break;
            case 'WI':
                charString = charString.concat(String.fromCharCode(12432));
            break;
            case 'WE':
                charString = charString.concat(String.fromCharCode(12433));
            break;
            case 'WO':
                charString = charString.concat(String.fromCharCode(12434));
            break;
            case 'N':
                charString = charString.concat(String.fromCharCode(12435));
            break;
            case 'VU':
                charString = charString.concat(String.fromCharCode(12436));
            break;
        }

        // console.log('yikes ', charString);
        return charString;
    }
    shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
}
