class DialogBoxScene extends Phaser.Scene {

    constructor () {
        super('DialogBoxScene');
    }

    init (data) {
        this.message = data.message;
        this.title = data.title;
        this.api = data.api;
        if(this.api !== undefined) {
            this.url = data.api.url;
            this.payload = data.api.payload;
        }

        if(data.dataCapture !== undefined){
            this.payload = data.dataCapture;
            this.apiRequest = true;
        }
    }
    create () {
        this.scene.pause('MainScene');

        this.graphics = this.add.graphics();
        this.graphics.fillStyle(0x003366 , 1);
        this.graphics.fillRect(90, 160, 540, 150);

        var titleStyle = { font: "32px manaspc", fill: "#ffffff", align: "left" };
        var style = { font: "16px manaspc", fill: "#ffffff", align: "left", wordWrap: { width: 680 - 180, useAdvancedWrap: true} };
        var caveName = this.add.text(90 + 30, 160 + 30, this.title, titleStyle);
        var caveDesc = this.add.text(90 + 30, 160 + 80, this.message, style);

        // this.cancelButton = new HiraButton(this, 720 - 60 - 30 - 60 - 30, 420, "Cancel", style, () => {
        //     console.log('fuck go back');
        //     this.scene.wake('MainScene');
        //     this.scene.stop('DetailScene');
        // }, this);
        // this.add.existing(this.cancelButton);
        //
        if(this.apiRequest){
            console.log('send data');
            this.postData(`http://localhost:5000/api/dungeon`, this.payload)
          .then(data => console.log(JSON.stringify(data))) // JSON-string from `response.json()` call
          .catch(error => console.error(error));
        }
        this.okayButton = new HiraButton(this, 90 + 540 - 80, 160 + 150 - 30, "Continue", style, () => {
            this.scene.wake('MainScene');
            this.scene.stop('DialogBoxScene');
        }, this);
        this.add.existing(this.okayButton);
    }


    postData(url = ``, data = {}) {
      // Default options are marked with *
        return fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
        .then(response => response.json()); // parses response to JSON
    }
}
