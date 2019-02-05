var MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

module.exports = {
    postLearn (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";
        var succ = {};
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var announcement = {};
          var dbo = db.db("hira");
          console.log(req.body.timestamp);
          var myobj = req.body
          var updateCharset = req.body.updateCharset;
          delete req.body.updateCharset;
          dbo.collection("learn").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
          });

          dbo.collection("players").updateOne({username: req.body.username}, { $set: { story: req.body.story } }, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
          });

          if(updateCharset) {
              dbo.collection("players").updateOne({username: req.body.username}, { $push: { charset: req.body.characters } }, function(err, res) {
                if (err) throw err;
                console.log("1 document updated");
                db.close();
              });
          }

          res.json({
            success: true
          });
        });
        console.log('ayyyy succ');
    },
    postTrain (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";
        var succ = {};
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var announcement = {};
          var dbo = db.db("hira");
          var myobj = req.body
          dbo.collection("train").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            db.close();
          });

          dbo.collection("players").updateOne({username: req.body.username}, { $set: { story: req.body.story } }, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
          });

          res.json({
            success: true
          });
        });
        console.log('ayyyy succ');
    },
    postPractice (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";
        var succ = {};
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var announcement = {};
          var dbo = db.db("hira");
          var myobj = req.body
          dbo.collection("practice").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");

          });

          dbo.collection("players").updateOne({username: req.body.username}, { $set: { story: req.body.story } }, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
          });

          res.json({
            success: true
          });
        });
        console.log('ayyyy succ');
    },
    postDungeon (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        var url = "mongodb://localhost:27017/";
        var succ = {};
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var announcement = {};
          var dbo = db.db("hira");
          var myobj = req.body
          dbo.collection("dungeon").insertOne(myobj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");

          });

          dbo.collection("players").updateOne({username: req.body.username}, { $set: { story: req.body.story } }, function(err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
          });
          res.json({
            success: true
          });
        });
        console.log('ayyyy succ');
    }

}
