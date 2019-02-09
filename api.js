var MongoClient = require('mongodb').MongoClient;

let config = require('./config');
const url = config.db_url;

module.exports = {
    postLearn (req, res) {
        var succ = {};
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
          if (err) throw err;
          var announcement = {};
          var dbo = db.db(config.db_name);
          var myobj = req.body;
          myobj.session_id = res.locals.decoded.session;
          var updateCharset = req.body.updateCharset;
          delete req.body.updateCharset;
          if(res.locals.decoded.username === myobj.username) {
              dbo.collection("learn").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log(myobj.username + ": added learn document");
                db.close();
              });

              dbo.collection("players").updateOne({username: myobj.username}, { $set: { story: myobj.story } }, function(err, res) {
                if (err) throw err;
                console.log(myobj.username + ": updated story");
                db.close();
              });

              if(updateCharset) {
                  dbo.collection("players").updateOne({username: myobj.username}, { $push: { charset: myobj.characters } }, function(err, res) {
                    if (err) throw err;
                    console.log(myobj.username + ": updated charset");
                    db.close();
                  });
              }

              return res.json({
                success: true
              });
          } else {
              return res.status(403).json({
                success: false,
                message: 'username and token does not match!'
              });
          }

        });
        // console.log('ayyyy succ');
    },
    postTrain (req, res) {
        var succ = {};
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
          if (err) throw err;
          var announcement = {};
          var dbo = db.db(config.db_name);
          var myobj = req.body
          myobj.session_id = res.locals.decoded.session;
          if(res.locals.decoded.username === myobj.username) {

              dbo.collection("train").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log(myobj.username + ": added train document");
                db.close();
              });

              dbo.collection("players").updateOne({username: myobj.username}, { $set: { story: myobj.story } }, function(err, res) {
                if (err) throw err;
                console.log(myobj.username + ": updated story");
                db.close();
              });

              return res.json({
                success: true
              });
          } else {
              return res.status(403).json({
                success: false,
                message: 'username and token does not match!'
              });
          }

        });
        // console.log('ayyyy succ');
    },
    postPractice (req, res) {
        var succ = {};
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
          if (err) throw err;
          var announcement = {};
          var dbo = db.db(config.db_name);
          var myobj = req.body;
          myobj.session_id = res.locals.decoded.session;
          if(res.locals.decoded.username === myobj.username) {
            dbo.collection("practice").insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log(myobj.username + ": added practice document");

            });

            dbo.collection("players").updateOne({username: myobj.username}, { $set: { story: myobj.story } }, function(err, res) {
              if (err) throw err;
              console.log(myobj.username + ": updated story");
              db.close();
            });

            return res.json({
              success: true
            });
          } else {
              return res.status(403).json({
                success: false,
                message: 'username and token does not match!'
              });
          }

        });
        // console.log('ayyyy succ');
    },
    postDungeon (req, res) {
        var succ = {};
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
          if (err) throw err;
          var announcement = {};
          var dbo = db.db(config.db_name);
          var myobj = req.body
          myobj.session_id = res.locals.decoded.session;

          if(res.locals.decoded.username === myobj.username) {
              dbo.collection("dungeon").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log(myobj.username + ": added dungeon document");

              });

              dbo.collection("players").updateOne({username: myobj.username}, { $set: { story: myobj.story } }, function(err, res) {
                if (err) throw err;
                console.log(myobj.username + ": updated story");
                db.close();
              });
              return res.json({
                success: true
              });
          } else {
              return res.status(403).json({
                success: false,
                message: 'username and token does not match!'
              });
          }

        });
        // console.log('ayyyy succ');
    }

}
