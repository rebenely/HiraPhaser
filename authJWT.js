let jwt = require('jsonwebtoken');
let config = require('./config');
var MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

module.exports  = {
  login (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    // For the given username fetch user from DB
    let mockedUsername = 'admin';
    let mockedPassword = 'password';

    if (username && password) {

        MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
          if (err) {
              throw err;
          }
          var dbo = db.db("hira");
          var query = {username: username};
          dbo.collection("players").findOne(query, function(err, result) {
            if (err) {
                console.log('ayo wtf');
                throw err;
            }
            console.log('query result', result);
            if (username === result.username && password === result.password) {
              let token = jwt.sign({username: username},
                config.secret,
                { expiresIn: '12h' // expires in 12h
                }
              );
              // return the JWT token for the future API calls
              res.json({
                success: true,
                message: 'Authentication successful!',
                token: token,
                username: result.username,
                story: result.story,
                charset: result.charset
              });
            } else {
              res.status(403).send({
                success: false,
                message: 'Incorrect username or password'
              });
            }

            console.log(result.username, 'logged in!');
            db.close();
          });
        });

    } else {
      res.status(400).send({
        success: false,
        message: 'Username and Password Required!'
      });
    }
  },
  index (req, res) {
    res.json({
      success: true,
      message: 'Index page'
    });
  }
}
