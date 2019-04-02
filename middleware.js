let jwt = require('jsonwebtoken');
var moment = require('moment');
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
    var myobj = req.body;
    console.log(myobj.total_time);

    var end = moment().utc().utcOffset(8);
    var startDate = moment(start, 'MM/DD/YYYY, LTS');
    console.log(startDate.format('MM/DD/YYYY, LTS'), 'end', end.format('MM/DD/YYYY, LTS'));
    var playTime = end.diff(startDate, 'seconds');
    if(myobj.total_time != undefined){
        dbo.collection("sessions").updateOne({username: username, session_id: session}, { $set: { end:  end.format('MM/DD/YYYY, LTS'), play_time: playTime }, $inc: { battle_time: myobj.total_time } }, function(err, res) {
          if (err) throw err;
          console.log( username + ": updated end time of session ", session);
          db.close();
        });
    } else {
        dbo.collection("sessions").updateOne({username: username, session_id: session}, { $set: { end:  end.format('MM/DD/YYYY, LTS'), play_time: playTime } }, function(err, res) {
          if (err) throw err;
          console.log( username + ": updated end time of session ", session);
          db.close();
        });
    }


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
