var MINIMAL_DIFF_MIN = 5;
var Twitter = require('twitter-node-client').Twitter;
var moment = require('moment');
var config = require('../config/development.js').twitter;
var twitter = new Twitter(config);
var utils = require('./utils');
var lastCall = null;

var error = function (err, response, body) {
	if (err) {
		console.log(err)
	}
	;
};



exports.fetch = function(city, redis) {
	var success = function (data) {
	var parsed = JSON.parse(data);
	for(i = 0; i < parsed.statuses.length; i++) {
			var data = translate(parsed.statuses[i]);
		var score = moment(parsed.created_at).unix();

			redis.zadd(["data-"+city, score, JSON.stringify(data)], function(err ,res) {
				if(err != null) {
					console.log("err " + err);
				}
			});

		}
	 };


	if (callApi(new Date())) {
		console.log("fetching twitter data " + city);
		console.log(lastCall);
		twitter.getSearch({'q': city, 'count': 15}, error, success);
	}
}

// to ensure we do not poll twitter to much, call it only every 15 mins
function callApi(now) {
	var diff = moment.utc(moment(now).diff(moment(lastCall))).minute();
	var doCall = lastCall == null || diff >= MINIMAL_DIFF_MIN;
	if (doCall) {
		lastCall = new Date();
	}
	return doCall;
}

function translate(data) {
	var data =  {
		title : data.text,
		time: utils.randomize(data.created_at),
		service : "Twitter",
		user : data.user.screen_name,
		media :""
	}

	if(data.coordinates ) {
		data.location = {
			lat : data.coordinates.lat,
			lon: data.coordinates.lon
			}
		};

	return data;		
}




