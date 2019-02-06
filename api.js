var MongoClient = require('mongodb').MongoClient;

let config = require('./config');
const url = config.db_url;

module.exports = {
    postLearn (req, res) {
        var succ = {};
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
          if (err) throw err;
          var announcement = {};
          var dbo = db.db("hira");
          console.log('this be the body' , req.body);
          var myobj = req.body
          var updateCharset = req.body.updateCharset;
          delete req.body.updateCharset;
          if(res.locals.decoded.username === myobj.username) {
              dbo.collection("learn").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
              });

              dbo.collection("players").updateOne({username: myobj.username}, { $set: { story: myobj.story } }, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
              });

              if(updateCharset) {
                  dbo.collection("players").updateOne({username: myobj.username}, { $push: { charset: myobj.characters } }, function(err, res) {
                    if (err) throw err;
                    console.log("1 document updated");
                    db.close();
                  });
              }

              res.json({
                success: true
              });
          } else {
              return res.status(403).json({
                success: false,
                message: 'username and token does not match!'
              });
          }

        });
        console.log('ayyyy succ');
    },
    postTrain (req, res) {
        var succ = {};
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
          if (err) throw err;
          var announcement = {};
          var dbo = db.db("hira");
          var myobj = req.body

          if(res.locals.decoded.username === myobj.username) {

              dbo.collection("train").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");
                db.close();
              });

              dbo.collection("players").updateOne({username: myobj.username}, { $set: { story: myobj.story } }, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
              });

              res.json({
                success: true
              });
          } else {
              return res.status(403).json({
                success: false,
                message: 'username and token does not match!'
              });
          }

        });
        console.log('ayyyy succ');
    },
    postPractice (req, res) {
        var succ = {};
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
          if (err) throw err;
          var announcement = {};
          var dbo = db.db("hira");
          var myobj = req.body
          if(res.locals.decoded.username === myobj.username) {
            dbo.collection("practice").insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log("1 document inserted");

            });

            dbo.collection("players").updateOne({username: myobj.username}, { $set: { story: myobj.story } }, function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
              db.close();
            });

            res.json({
              success: true
            });
          } else {
              return res.status(403).json({
                success: false,
                message: 'username and token does not match!'
              });
          }

        });
        console.log('ayyyy succ');
    },
    postDungeon (req, res) {
        var succ = {};
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
          if (err) throw err;
          var announcement = {};
          var dbo = db.db("hira");
          var myobj = req.body

          if(res.locals.decoded.username === myobj.username) {
              dbo.collection("dungeon").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log("1 document inserted");

              });

              dbo.collection("players").updateOne({username: myobj.username}, { $set: { story: myobj.story } }, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
              });
              res.json({
                success: true
              });
          } else {
              return res.status(403).json({
                success: false,
                message: 'username and token does not match!'
              });
          }

        });
        console.log('ayyyy succ');
    }

}
