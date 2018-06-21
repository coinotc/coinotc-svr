
var FCM = require('fcm-node');
// var test = require('./check-alert-price')

var serverKey = 'AAAALaHfOPI:APA91bFffuUQ4fZrxQ0a7ybjgG5n5560f8YK4XnZj-af_Ir02fhje2563c8Gfmh4ofPDlfHZb7x7n-9JmAMIYId-qr8kIuDe5fNiQF79wvnKGW6Y7Jpcst1wN3a9p2yE_NGR6dPLlW96'; //put your server key here

var validDeviceRegistrationToken = new Array();

var fcm = new FCM(serverKey);

var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: validDeviceRegistrationToken[0],

    // collapse_key: 'your_collapse_key',
    priority: 'high',
    
    notification: {
        title: 'Testing', 
        body: 'hello bitches',
        sound : "default" 
    },
    
    // data: {  //you can send only notification or only data(or include both)
    //     my_key: 'my value',
    //     my_another_key: 'my another value'
    // }
};

// fcm.send(message, function(err, response){
//     if (err) {
//         console.log("Something has gone wrong!");
//     } else {
//         console.log("Successfully sent with response: ", response);
//     }
// });
