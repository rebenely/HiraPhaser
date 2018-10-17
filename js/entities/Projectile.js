class Projectile extends Phaser.GameObjects.BitmapText {

    constructor(scene, x, y, font, characterPool) {
        super(scene, x, y, font, '');

        console.log('created!');
        this.x = x;
        this.y = y;
        this.characterPool = characterPool;
        this.currentChar = '';
        this.chars = [];
        this.setOrigin(0.5);
        this.visible = false;
        this.getRandomCharacter();
    }

    getRandomCharacter () {
        var i = Math.floor((Math.random() * this.characterPool.length));
        this.currentChar = this.characterPool[i];
        this.chars = this.currentChar.split('-');
        this.currentChar = this.currentChar.replace(/-/g, '');
        console.log('new char', this.currentChar);
        return this.currentChar;
    }

    getHiragana () {
        var charString = '';

        for( var i = 0; i < this.chars.length; i++ ){
            switch(this.chars[i]) {
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
            }
        }
        console.log('yikes ', charString);
        return charString;
    }
}
