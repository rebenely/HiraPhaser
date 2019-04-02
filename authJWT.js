let jwt = require('jsonwebtoken');
let config = require('./config');
var moment = require('moment');
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
                        var stringTime = moment().utc().utcOffset(8).format('MM/DD/YYYY, LTS');
                      jwt.sign({username: username, session: result.session + 1, start: stringTime},config.secret,
                        { expiresIn: '12h' }, async function(err, token) {
                            /* create session */

                            var currentSesh = {
                                username: username,
                                session_id: result.session + 1,
                                start: stringTime,
                                end: '',
                                battle_time: 0,
                                idle: 0,
                                distracted: 0,
                                play_time: 0
                            }
                            dbo.collection("players").updateOne({username: username}, { $set: {session: result.session + 1} }, async function(err, res) {
                              if (err) throw err;
                              console.log( username + ": updated session id", result.session + 1);
                              await dbo.collection("sessions").insertOne(currentSesh, function(errx, res) {
                                if (errx) {throw errx;}
                                console.log(username + ": added a session with id", result.session + 1);
                                db.close();
                              });
                            });



                            // return the JWT token for the future API calls
                            return res.json({
                              success: true,
                              message: 'Authentication successful!',
                              token: token,
                              username: result.username,
                              story: result.story,
                              charset: result.charset,
                              sched: result.schedule
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
                  charset: [],
                  encounters: [],
                  total_items: 0,
                  total_correct: 0,
                  total_possible_correct: 0,
                  review_count: 0,
                  schedule: [],
                  total_idle: 0,
                  total_distracted: 0,
                  total_pattern_A: 0,
                  total_pattern_B: 0,
                  total_pattern_C: 0,
                  total_pattern_D: 0,
                  total_battle_time: 0
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
        var payload = req.body;
        var dbo = db.db(config.db_name);
        var query = {username: username};
        dbo.collection("players").findOne(query, async function(err, result) {
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
              var end = moment().utc();
              var startDate = moment(start, 'MM/DD/YYYY, LTS');
              // var startDate = moment().tz(start, 'MM/DD/YYYY, LTS', 'Asia/Manila');
              var playTime = end.diff(startDate, 'seconds');
              // console.log(moment().utc().utcOffset(8).add(24, 'hours').add(1, 'minutes'));
              console.log(startDate.format('MM/DD/YYYY, LTS'), 'end', end.format('MM/DD/YYYY, LTS'), 'diff', typeof playTime, ':', playTime);
              if(payload.idle == undefined || payload.idle == null) {
                  payload.idle = 0;
              }
              if(payload.distracted == undefined || payload.distracted == null) {
                  payload.distracted = 0;
              }
              await dbo.collection("sessions").updateOne({username: username, session_id: session}, { $set: { end:  end.utcOffset(8).format('MM/DD/YYYY, LTS'), play_time: playTime, distracted: payload.distracted, idle: payload.idle } }, async function(err, res) {
                if (err) throw err;
                console.log( username + ": ended session", session);
                await dbo.collection("sessions").findOne({username: username, session_id: session}, async function(err, result) {
                    if (err) throw err;
                    var sesh = result;
                    console.log('ses',sesh);
                    await dbo.collection("players").updateOne({username: username}, { $inc: {total_playtime: playTime, total_distracted: payload.distracted, total_idle: payload.idle, total_battle_time: sesh.battle_time} }, function(err, res) {
                      if (err) throw err;
                      console.log( username + ": updated playtime to", playTime);
                      db.close();
                    });
                });

              });



              return res.status(200).send({
                success: true,
                message: 'Saved data for ' + username
              });
          }

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
