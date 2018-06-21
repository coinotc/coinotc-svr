'use strict';

const request = require('request');

const CRYPTO_API_URL = 'https://api.coinmarketcap.com/v2/ticker/';
module.exports = function(coin) {
    return new Promise((resolve, reject) => {
        request({
            url: getURL(coin),
            json: true,
        }, (error, response, body) => {
            if (error) {
                return reject(error);
            }

            if (!response || !body || response.statusCode !== 200) {
                return reject(new Error('Unexpected response from api.coinmarketcap.com'));
            }

            resolve(body);
            console.log(body);
            return body;
            
        });
    });
};

function getURL(coin) {
    console.log(CRYPTO_API_URL + coin);
    return CRYPTO_API_URL + coin;
    
};

