var cron = require('node-cron');

//exceute every 1 min
cron.schedule('*/30 * * * * *', function(){
    var shell = require('./child_helper');

    var commandList = [
        // "node ./schedulers/fcm.js"
        "node ./schedulers/check-alert-price.js"
    ]

    shell.series(commandList , function(err){
        if(err){
            console.log('executed many commands in a row'+ err);
            throw err;
        }else{ 
            console.log('done')
        }
    });
});