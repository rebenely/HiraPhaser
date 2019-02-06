var express = require('express');
var app = express();
let config = require('./config');

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

app.post('/api/learn', middleware.checkToken, api.postLearn);
app.post('/api/train', middleware.checkToken, api.postTrain);
app.post('/api/practice', middleware.checkToken, api.postPractice);
app.post('/api/dungeon', middleware.checkToken, api.postDungeon);

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
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
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
    console.log('this is the token decoded', res.locals.decoded);
    res.json({
      message: 'toight',
      username: res.locals.decoded.username
    });
})




/* Start Server */
server.listen(process.env.PORT, function () {
  console.log(`Listening on ${server.address().port}`);
});
