var MongoClient = require('mongodb').MongoClient;
var auth = require('../routes/auth');
module.exports = {
  changeStream: function() {
    MongoClient.connect('mongodb://localhost/coinotc?replicaSet=rs').then(
      function(client) {
        console.log('Ready to watch database');
        let db = client.db('coinotc');
        // specific table for any change
        let alerts_change_streams = db.collection('alerts').watch([
          {
            $match: {
              $and: [
                { 'updateDescription.updatedFields.status': false },
                { operationType: 'update' }
              ]
            }
          }
        ]);
        alerts_change_streams.on('change', function(change) {
          console.log('>>>>>changed<<<<<');
          console.log(change);
          db
            .collection('alerts')
            .findOne({ _id: change.documentKey._id }, function(err, res) {
              if (err) throw err;
              //console.log(res.username);
              let username = res.username;
              //console.log(username);
              let notification = {
                username: username,
                message: `Your ${res.crypto} in ${res.fiat} which price is ${
                  res.price
                }, has reached`
              };
              db
                .collection('notifications')
                .insertOne(notification, function(err, res) {
                  if (err) throw err;
                  console.log('Insert success');
                });
            });
        });
      }
    );
  }
};

// with aggregation on whole database

// change_streams = MongoClient.db.collection('alerts').watch([
//   {
//     $match: {
//       operationType: { $in: ['insert'] }
//     }
//   },
//   {
//     $match: {
//       price: { $lt: 500 }
//     }
//   }
// ]);

//for change inchange_streams:
//do_some_magic();
