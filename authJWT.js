let jwt = require('jsonwebtoken');
let config = require('./config');
var MongoClient = require('mongodb').MongoClient;
const url = config.db_url;
var bcrypt = require('bcryptjs');
module.exports  = {
  login (req, res) {
    console.log('----------login------------');
    let username = req.body.username;
    let password = req.body.password;
    // For the given username fetch user from DB
    let mockedUsername = 'admin';
    let mockedPassword = 'password';

    if (username && password) {

        MongoClient.connect(url, { useNewUrlParser: true }, async function(err, db) {
          if (err) {
              throw err;
          }
          var dbo = db.db(config.db_name);
          var query = {username: username};
          await dbo.collection("players").findOne(query, function(err, result) {
              if (err) {
                  return res.status(503).send({
                    success: false,
                    message: 'Cannot connect to db'
                  });
                  throw err;
              }
            if(result === null) {
                db.close();
                return res.status(401).send({
                  success: false,
                  message: 'User does not exist!'
                });
            } else {
                bcrypt.compare(password, result.password, function(err, hashResult) {
                    if (hashResult) {
                        var stringTime = JSON.stringify(new Date()).replace(/\"/g, "");
                      jwt.sign({username: username, session: result.session, start: stringTime},config.secret,
                        { expiresIn: '12h' }, async function(err, token) {
                            /* create session */

                            var currentSesh = {
                                username: username,
                                session_id: result.session,
                                start: stringTime,
                                end: ''
                            }
                            await dbo.collection("sessions").insertOne(currentSesh, function(errx, res) {
                              if (errx) {throw errx;}
                              console.log(username + ": added a session with id", result.session);
                              db.close();
                            });
                            // return the JWT token for the future API calls
                            return res.json({
                              success: true,
                              message: 'Authentication successful!',
                              token: token,
                              username: result.username,
                              story: result.story,
                              charset: result.charset
                            });
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
    console.log('----------signup------------');
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
                  session: 0,
                  total_playtime: 0,
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
  logout(req, res) {
      console.log('----------logout------------');
      MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) {
            throw err;
        }
        var username = res.locals.decoded.username;
        var session = res.locals.decoded.session;
        var start = res.locals.decoded.start;
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

              var end = new Date();
              var startDate = new Date(start);
              var playTime = (end - startDate) / 1000;

              dbo.collection("sessions").updateOne({username: username, session_id: session}, { $set: { end:  JSON.stringify(end).replace(/\"/g, ""), play_time: playTime } }, function(err, res) {
                if (err) throw err;
                console.log( username + ": ended session", session);
                db.close();
              });

              dbo.collection("players").updateOne({username: username}, { $set: { session: session + 1 }, $inc: {total_playtime: playTime} }, function(err, res) {
                if (err) throw err;
                console.log( username + ": updated session to", session + 1);
                db.close();
              });


          }

          db.close();
        });
      });
  },
  index (req, res) {
    res.json({
      success: true,
      message: 'Index page'
    });
  }
}
