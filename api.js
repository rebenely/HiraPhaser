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
          var update_story = myobj.update_story;
          delete myobj.update_story;
          var updateCharset = req.body.updateCharset;
          delete req.body.updateCharset;
          if(res.locals.decoded.username === myobj.username) {
              dbo.collection("learn").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log(myobj.username + ": added learn document");
                db.close();
              });

              dbo.collection("players").updateOne({username: myobj.username}, { $set: { story: update_story } }, function(err, res) {
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
          var myobj = req.body;
          var update_story = myobj.update_story;
          delete myobj.update_story;
          myobj.session_id = res.locals.decoded.session;
          if(res.locals.decoded.username === myobj.username) {

              dbo.collection("train").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log(myobj.username + ": added train document");
                db.close();
              });

              dbo.collection("players").updateOne({username: myobj.username}, { $set: { story: update_story } }, function(err, res) {
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
          var update_story = myobj.update_story;
          delete myobj.update_story;
          myobj.session_id = res.locals.decoded.session;
          if(res.locals.decoded.username === myobj.username) {
            dbo.collection("practice").insertOne(myobj, function(err, res) {
              if (err) throw err;
              console.log(myobj.username + ": added practice document");

            });

            dbo.collection("players").updateOne({username: myobj.username}, { $set: { story: update_story } }, function(err, res) {
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
    async postDungeon (req, res) {
        console.log('----------post dungeon------------');

        var succ = {};
        MongoClient.connect(url, { useNewUrlParser: true }, async function(err, db) {
          if (err) throw err;
          var announcement = {};
          var dbo = db.db(config.db_name);
          var myobj = req.body
          var update_story = myobj.update_story;
          delete myobj.update_story;
          myobj.session_id = res.locals.decoded.session;

          if(res.locals.decoded.username === myobj.username) {
              await dbo.collection("dungeon").insertOne(myobj, function(err, res) {
                if (err) throw err;
                console.log(myobj.username + ": added dungeon document");

              });
              var updatedEncounters;
              await dbo.collection("players").findOne({username: myobj.username }, async function(err, result) {
                if (err) throw err;
                succ = result;

                updatedEncounters = succ.encounters;
                for (let i = 0; i < myobj.encounters.length; i++) {
                    var j = self.checkWordExistence(myobj.encounters[i].word, updatedEncounters);

                    if(j != -1){
                        updatedEncounters[j].total++;
                        updatedEncounters[j].correct += myobj.encounters[i].correct ? 1 : 0;
                        updatedEncounters[j].accuracy =  updatedEncounters[j].correct / updatedEncounters[j].total;
                    } else {
                        updatedEncounters.push({
                            word: myobj.encounters[i].word,
                            total: myobj.encounters[i].total,
                            correct: myobj.encounters[i].correct,
                            accuracy:  myobj.encounters[i].accuracy
                        });
                    }
                }
                console.log(updatedEncounters, 'updated from', myobj.encounters);

                await dbo.collection("players").updateOne({username: myobj.username}, { $set: { story: update_story, encounters: updatedEncounters }, $inc: {total_items: myobj.total_items, total_correct: myobj.total_correct, total_possible_correct: myobj.possible_correct} }, function(err, res) {
                  if (err) throw err;
                  console.log(myobj.username + ": updated story and encounters");
                  db.close();
                });
                return res.json({
                  success: true
                });
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
    checkWordExistence(word, array) {

        for(let i = 0; i < array.length; i++) {
            // console.log(this.dataCapture.encounters[i].word, 'vs', word, this.dataCapture.encounters[i].word === word);
            if(array[i].word === word) {
                return i;
            }
        }
        return -1;
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
    async getStats (req, res) {
        console.log('----------get stats------------');
        var stats = {};
        var succ = new MongoClient(url, { useNewUrlParser: true });
        await succ.connect(async function(err, db) {
          if (err) throw err;
          var announcement = {};
          var dbo = db.db(config.db_name);
          await self.getAccuracy(dbo, 'dungeon', res.locals.decoded.username, function(result) {
              succ.close();
              if(result.length){
                  stats.dungeon_ave = result[0].ave;
                  console.log('dungeon', stats);
              } else {
                  stats.dungeon_ave = null;
                  console.log('dungeon empty');
              }
          }, stats);
          await self.getAccuracy(dbo, 'train', res.locals.decoded.username, function(result) {
              succ.close();
              if(result.length){
                  stats.train_ave = result[0].ave;
                  console.log('train', stats);
              } else {
                  stats.train_ave = null;
                  console.log('train empty');
              }
          }, stats);
          await self.getAccuracy(dbo, 'practice', res.locals.decoded.username, function(result) {
              succ.close();
              if(result.length){
                  stats.practice_ave = result[0].ave;
                  console.log('practice', stats);
              } else {
                  stats.practice_ave = null;
                  console.log('practice empty');
              }
              return res.status(200).json({
                success: true,
                message: 'some data!',
                stats: stats
              });

          }, stats);

      }, stats);

        // console.log('ayyyy succ');
    },
    postReview (req, res) {
        console.log('----------post train------------');

        var succ = {};
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
          if (err) throw err;
          var announcement = {};
          var dbo = db.db(config.db_name);
          var myobj = req.body;

          myobj.session_id = res.locals.decoded.session;
          if(res.locals.decoded.username) {

              dbo.collection("players").updateOne({username: res.locals.decoded.username}, { $inc: { review_count: 1 } }, function(err, res) {
                if (err) throw err;
                console.log(myobj.username + ": updated review count");
                db.close();
              });

              return res.json({
                success: true
              });
          } else {
              return res.status(403).json({
                success: false,
                message: 'Cannot find user!'
              });
          }

        });
        // console.log('ayyyy succ');
    },

}
