var express = require('express');
var app = express();

var server = require('http').Server(app);
const bodyParser = require('body-parser');
let middleware = require('./middleware');
let auth = require('./authJWT');
var api = require('./api');

/* Allow CORS */
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use(express.static(__dirname));

/* middleware */
app.use(bodyParser.urlencoded({
   extended: true
}));
app.use(bodyParser.json());

/* db driver */

/* End points */
app.post('/login', auth.login);

app.post('/api/learn', api.postLearn);
app.post('/api/train', api.postTrain);
app.post('/api/practice', api.postPractice);
app.post('/api/dungeon', api.postDungeon);

app.get('/wtf', function(req, res) {
    console.log('ayy lmao');
});
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/hello', function (req, res) {

    var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";
    var succ = {};
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var announcement = {};
      var dbo = db.db("hira");
      dbo.collection("game_vars").findOne({var_name: "announcement" }, function(err, result) {
        if (err) throw err;
        console.log(result);
        succ = result;
        res.json({
          title: succ.title,
          body: succ.body
        });
        db.close();
      });
    });
    console.log('ayyyy succ');
})

app.get('/amireal', middleware.checkToken, function (req, res) {
    console.log(req.decoded);
    res.json({
      message: 'toight',
      username: req.decoded.username
    });
})




/* Start Server */
server.listen(8081, function () {
  console.log(`Listening on ${server.address().port}`);
});
