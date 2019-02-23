var MongoClient = require('mongodb').MongoClient;

let config = require('./config');
const url = config.db_url;

var self = module.exports = {
    postLearn (req, res) {
        console.log('----------post learn------------');
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
        console.log('----------post train------------');

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
        console.log('----------post dungeon------------');

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
    },
    getAccuracy(db, collection, username, callback) {
        db.collection(collection).aggregate(
            [ { '$match': {"username": username} },
              { '$group': { '_id': "$username", 'ave' : {'$avg' : "$accuracy"}} },
            ],
            function(err, cursor) {
                cursor.toArray(function(err, documents) {
                  callback(documents);
                });
            }
        )
    },
    getStats (req, res) {
        console.log('----------get stats------------');
        var stats = {};
        var succ = new MongoClient(url, { useNewUrlParser: true });
        succ.connect(function(err, db) {
          if (err) throw err;
          var announcement = {};
          var dbo = db.db(config.db_name);
          self.getAccuracy(dbo, 'dungeon', res.locals.decoded.username, function(result) {
              succ.close();
              if(result.length){
                  stats.dungeon_ave = result[0].ave;
                  console.log('i have this badboy here', result[0].ave);
              } else {
                  console.log('empty');
              }
          });

          return res.status(200).json({
            success: true,
            message: 'some data!'
          });
        });
        // console.log('ayyyy succ');
    }

}
