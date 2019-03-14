let jwt = require('jsonwebtoken');
const config = require('./config.js');
var MongoClient = require('mongodb').MongoClient;

const url = config.db_url;

let checkToken = (req, res, next) => {
  console.log('----------middleware------------');
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

  if (token) {
  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
    jwt.verify(token, config.secret, (err, decoded) => {
      if (err) {
          console.log('token error');
        return res.status(403).json({
          success: false,
          message: 'Token is not valid',
          error: err
        });
      } else {
          // console.log(decoded);
        res.locals.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

let updateSession = (req, res, next) => {
  console.log('----------session update------------');
  MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
    if (err) {
        throw err;
    }
    var username = res.locals.decoded.username;
    var session = res.locals.decoded.session;
    var start = res.locals.decoded.start;
    var dbo = db.db(config.db_name);

    var end = new Date().toLocaleString("en-US", {timeZone: "Asia/Manila"});
    end = new Date(end);
    var startDate = new Date(start);
    var playTime = (end - startDate) / 1000;

  dbo.collection("sessions").updateOne({username: username, session_id: session}, { $set: { end:  JSON.stringify(end.toLocaleString()).replace(/\"/g, ""), play_time: playTime } }, function(err, res) {
    if (err) throw err;
    console.log( username + ": updated end time of session ", session);
    db.close();
  });

  // dbo.collection("players").updateOne({username: username}, { $inc: {total_playtime: playTime} }, function(err, res) {
  //   if (err) throw err;
  //   console.log( username + ": updated playtime to", playTime);
  //   db.close();
  // });

  next();
 });

};

module.exports = {
  checkToken: checkToken,
  updateSession: updateSession
}
