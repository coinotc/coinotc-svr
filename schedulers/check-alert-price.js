var mongoose = require('mongoose');
const getCoinRates = require('./get-crypto-price');
var FCM = require('fcm-node');
var validDeviceRegistrationToken = new Array();
var serverKey = process.env.FCM_SERVER_KEY;
var fcm = new FCM(serverKey);

var db = mongoose.connect(process.env.MONGODB_URI);
require('../models/alert');
require('../models/User');
mongoose.set('debug', true);
var Alert = mongoose.model('alert');
var User = mongoose.model('User');
const ETH = '1027';

function getAlertPrice(above){
    var promise = Alert.find({above:above}).exec();
    return promise;
}

function updateAlertStatus(id){
    var updateStatus = Alert.findOneAndUpdate({_id : id},{status : false},{"new": true}).exec();
    return updateStatus
}

function getUserFcmToken(username){
    var getToken = User.findOneAndUpdate({ username : username },{
        "fields": { "deviceToken":1 },
        "new": true 
       }).exec();
    return getToken;
}

function compareETHPriceBelow() {
    var marketRate =  getCoinRates(ETH);

    var getAlert = getAlertPrice(false);    
    var alertRate = getAlert

    let results = Promise.all([
        marketRate,
        alertRate
    ]);
    return results
    .then(([marketRate, alertRate])=>{
        // console.log("NEW DATA RECIEVED>>>>>>>AAAAAAA"+ JSON.stringify(resultA));
        // console.log("NEW DATA RECIEVED>>>>>>>BBBBBBB"+resultB);
        // console.log(typeof resultB)
        // console.log(">>>>LONG" + resultB.length);
        // console.log(alertRate);
        // console.log(alertRate.price);
         console.log("MARKET PRICE"+marketRate.data.quotes.USD.price);
            alertRate.forEach((alertInfo)=>{
                console.log("CHECK FOREACH"+ alertInfo)
                if((alertInfo.status === true) && (marketRate.data.quotes.USD.price < alertInfo.price)){
                    console.log(">>>>>>>>>>!!!!PRICE IS LOWER THAN MARKET VALUE!!!!<<<<<<<<<<");
                    console.log(">>>>>>>>>>NOTIFY USER"+ alertInfo.username);
                    var deviceToken = getUserFcmToken(alertInfo.username);
                    deviceToken.then((token)=>{
                        console.log(">>>>>>>>>>TOKEN>>>>>>>>>>" + token.deviceToken);
                        console.log(">>>>>>>>>>BEFORE>>>>>>>>>>"+validDeviceRegistrationToken);
                        validDeviceRegistrationToken = token.deviceToken;
                        console.log(">>>>>>>>>>AFTER>>>>>>>>>>"+validDeviceRegistrationToken);
                        return ([alertInfo,validDeviceRegistrationToken])
                    }).then(([alertInfo,validDeviceRegistrationToken])=>{
                        console.log(">>>>>>>>>>NEW>>>>>>>>>>>" + alertInfo)
                        var pigeon = {
                            to: validDeviceRegistrationToken,
                            priority: 'high',
                            notification: {
                                title: alertInfo.crypto + ' VALUE BELOW ' + alertInfo.fiat + alertInfo.price, 
            
                                sound : "default" 
                            }
                        }
                        fcm.send(pigeon, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                            } else {
                                console.log("Successfully ALERT sent with response: ", response);
                            }
                        });
                        return alertInfo
                    }).then(alertInfo => {
                        console.log(">>>>>>>>>>ID>>>>>>>>>"+alertInfo)
                        var updateStatus = updateAlertStatus(alertInfo._id);
                        updateStatus.then(result=>{
                            console.log("Updated Status: " + result.status)
                        })
                    }).catch(err=> {  console.log(err)})
                    
                    .catch(err=> { console.log(err)})
                }else{
                    console.log("~~~~~~~~~~NOTHING TO SEE HERE~~~~~~~~~~")
                }
            })
        return 
    }).catch((error)=>{
         console.log(error);
    })
};

function compareETHPriceAbove() {
    var marketRate =  getCoinRates(ETH);

    var getAlert = getAlertPrice(true);    
    var alertRate = getAlert

    let results = Promise.all([
        marketRate,
        alertRate
      ]);
    return results
    .then(([marketRate, alertRate])=>{
        // console.log("NEW DATA RECIEVED>>>>>>>AAAAAAA"+ JSON.stringify(resultA));
        // console.log("NEW DATA RECIEVED>>>>>>>BBBBBBB"+resultB);
        // console.log(typeof resultB)
        // console.log(">>>>LONG" + resultB.length);
        // console.log(alertRate);
        // console.log(alertRate.price);
         console.log("MARKET PRICE"+marketRate.data.quotes.USD.price);
            alertRate.forEach((alertInfo)=>{
                console.log("CHECK FOREACH"+ alertInfo)
                if((alertInfo.status === true) && (marketRate.data.quotes.USD.price > alertInfo.price)){
                    console.log(">>>>>>>>>>!!!!PRICE IS ABOVE THAN MARKET VALUE!!!!<<<<<<<<<<");
                    console.log(">>>>>>>>>>NOTIFY USER"+ alertInfo.username);
                    var deviceToken = getUserFcmToken(alertInfo.username);
                    deviceToken.then((token)=>{
                        console.log(">>>>>>>>>>TOKEN>>>>>>>>>>" + token.deviceToken);
                        console.log(">>>>>>>>>>BEFORE>>>>>>>>>>"+validDeviceRegistrationToken);
                        validDeviceRegistrationToken = token.deviceToken;
                        console.log(">>>>>>>>>>AFTER>>>>>>>>>>"+validDeviceRegistrationToken);
                        return ([alertInfo,validDeviceRegistrationToken])
                    }).then(([alertInfo,validDeviceRegistrationToken])=>{
                        console.log(">>>>>>>>>>NEW>>>>>>>>>>>" + alertInfo)
                        var pigeon = {
                            to: validDeviceRegistrationToken,
                            priority: 'high',
                            notification: {
                                title: alertInfo.crypto + ' VALUE ABOVE ' + alertInfo.fiat + alertInfo.price, 
            
                                sound : "default" 
                            }
                        }
                        fcm.send(pigeon, function(err, response){
                            if (err) {
                                console.log("Something has gone wrong!");
                            } else {
                                console.log("Successfully ALERT sent with response: ", response);
                            }
                        });
                        return alertInfo
                    }).then(alertInfo => {
                        console.log(">>>>>>>>>>ID>>>>>>>>>"+alertInfo)
                        var updateStatus = updateAlertStatus(alertInfo._id);
                        updateStatus.then(result=>{
                            console.log("Updated Status: " + result.status)
                        })
                    }).catch(err=> {  console.log(err)})
                    
                    .catch(err=> { console.log(err)})
                }else{
                    console.log("~~~~~~~~~~NOTHING TO SEE HERE~~~~~~~~~~")
                }
            })
        return 
    }).catch((error)=>{
         console.log(error);
    })
};
compareETHPriceBelow();
compareETHPriceAbove();
process.exit();