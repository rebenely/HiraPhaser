var express = require('express');
var app = express();

var server = require('http').Server(app);
const bodyParser = require('body-parser');
let middleware = require('./middleware');
let auth = require('./authJWT');

/* Allow CORS */
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.use(express.static(__dirname));


app.use(bodyParser.urlencoded({ // Middleware
   extended: true
}));
app.use(bodyParser.json());


/* End points */
app.post('/login', auth.login);

app.get('/wtf', function(req, res) {
    console.log('ayy lmao');
});
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/hello', function (req, res) {
    res.json({
      title: 'Hello, Tester!',
      body: 'You still have a long way to go.'
    });
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
