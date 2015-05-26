var Twitter = require('twitter-node-client').Twitter;
var moment = require('moment');
var config = require('../../config/development.js').twitter;
var twitter = new Twitter(config);
var utils = require('./utils');
var DataObject = require('../DataObject');
var lastCall = null;

var error = function (err, response, body) {
    if (err) {
        console.log(err)
    }
};


exports.fetch = function (city, redis) {
    var success = function (data) {
        var parsed = JSON.parse(data);
        for (i = 0; i < parsed.statuses.length; i++) {
            var data = wrapData(parsed.statuses[i]);

            var score = moment(parsed.time).unix();

            redis.zadd(['data-' + city, score, JSON.stringify(data)], function (err, res) {
                if (err != null) {
                    console.log('twitter error ' + err);
                }
            });

        }
    };

    if (callApi(new Date())) {
        twitter.getSearch({q: city, count: 5}, error, success);
    }
}

// to ensure we do not poll twitter to much, call it only every 15 mins
function callApi(now) {
    var diff = moment.utc(moment(now).diff(moment(lastCall))).minute();
    var doCall = lastCall == null || diff >= config.minDiffInMin;
    if (doCall) {
        lastCall = new Date();
    }
    return doCall;
}


function wrapData(data) {

    var obj = new DataObject(data.text, 'Twitter', utils.randomize(data.created_at)).withUser(data.user.screen_name);
    /*  if (false && data.coordinates != null) {
     obj.withLocation({
     lat: data.coordinates.latitude,
     lon: data.coordinates.lon
     })
     }*/
    console.log(obj);
    return obj;
}




