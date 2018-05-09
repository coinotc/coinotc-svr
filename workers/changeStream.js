var MongoClient = require('mongodb').MongoClient;
var auth = require('../routes/auth');
module.exports = {
  changeStream: function() {
    MongoClient.connect('mongodb://localhost/coinotc?replicaSet=rs').then(
      function(client) {
        console.log('Ready to watch database');
        let db = client.db('coinotc');
        // Specific Alert Table For Change
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
          console.log('>>>>>alert changed<<<<<');
          console.log(change);
          db
            .collection('alerts')
            .findOne({ _id: change.documentKey._id }, function(err, res) {
              if (err) throw err;
              let username = res.username;
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
        // Specific Order Table For Change
        let orders_change_streams = db.collection('orderinformations').watch([
          {
            $match: {
              $and: [
                {
                  'updateDescription.updatedFields.finished': {
                    $in: [2, 3]
                  }
                },
                { operationType: 'update' }
              ]
            }
          }
        ]);
        orders_change_streams.on('change', function(change) {
          console.log('>>>>>order changed<<<<<');
          console.log(change);
          db
            .collection('orderinformations')
            .findOne({ _id: change.documentKey._id }, function(err, res) {
              if (err) throw err;
              if (change.updateDescription.updatedFields.finished == 2) {
                let username = res.seller;
                let notification = {
                  username: username,
                  message: `Your Order ${res._id} with ${
                    res.buyer
                  } has progress!`
                };
                db
                  .collection('notifications')
                  .insertOne(notification, function(err, res) {
                    if (err) throw err;
                    console.log('Insert success');
                  });
              } else if (change.updateDescription.updatedFields.finished == 3) {
                let username = res.buyer;
                let notification = {
                  username: username,
                  message: `Your Order ${res._id} with ${
                    res.seller
                  } has progress!`
                };
                db
                  .collection('notifications')
                  .insertOne(notification, function(err, res) {
                    if (err) throw err;
                    console.log('Insert success');
                  });
              }
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
