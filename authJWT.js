let jwt = require('jsonwebtoken');
let config = require('./config');
var MongoClient = require('mongodb').MongoClient;
const url = config.db_url;
var bcrypt = require('bcryptjs');
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
          var dbo = db.db(config.db_name);
          var query = {username: username};
          dbo.collection("players").findOne(query, function(err, result) {
              if (err) {
                  return res.status(503).send({
                    success: false,
                    message: 'Cannot connect to db'
                  });
                  throw err;
              }
            if(result === null) {
                return res.status(401).send({
                  success: false,
                  message: 'User does not exist!'
                });
            } else {
                bcrypt.compare(password, result.password, function(err, hashResult) {
                    if (hashResult) {
                      let token = jwt.sign({username: username},
                        config.secret,
                        { expiresIn: '12h' // expires in 12h
                        }
                      );
                      // return the JWT token for the future API calls
                      return res.json({
                        success: true,
                        message: 'Authentication successful!',
                        token: token,
                        username: result.username,
                        story: result.story,
                        charset: result.charset
                      });
                    } else {
                      return res.status(401).send({
                        success: false,
                        message: 'Incorrect password'
                      });
                    }
                });

                console.log(result.username + ': logged in!');
            }
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
  signup (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let password1 = req.body.password1;


    if (username && password && password1) {
        if(password === password1){
            bcrypt.hash(password, parseInt(config.salt_rounds), function(err, hash) {
                password = hash;
            });

            MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
              if (err) {
                  console.log('hmmm');
                  return res.status(503).send({
                    success: false,
                    message: 'Cannot connect to db'
                  });
                  throw err;
              }
              var dbo = db.db(config.db_name);

              var myobj = {
                  username: username,
                  password: password,
                  story: 0,
                  charset: []
              }
              dbo.collection("players").insertOne(myobj, function(err, result) {
                  if (err) {
                      console.log(err);
                      if (err.name === 'MongoError' && err.code === 11000) {
                        // Duplicate username
                        return res.status(401).send({ succes: false, message: 'User already exist!' });
                      }

                      return res.status(503).send({
                        success: false,
                        message: 'Cannot connect to db'
                      });
                      // res.status(400).send({
                      //   success: false,
                      //   message: 'User already exists!'
                      // });
                      // throw err;
                  }
                  console.log(username+ ': registered');

                  res.json({
                    success: true,
                    message: 'Registration successful!'
                  });
                db.close();
              });

            });
        } else {
            res.status(400).send({
              success: false,
              message: 'Passwords do not match!'
            });
        }


    } else {
      res.status(400).send({
        success: false,
        message: 'All fields are required!'
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
