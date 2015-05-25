var https = require('https');
var config = require('../config/development');

exports.fetch = function(city, redis) {
	https.get('https://api.meetup.com/2/open_events?and_text=False&country=de&offset=0&city=Hamburg&format=json&limited_events=False&photo-host=public&page=20&radius=25.0&desc=False&status=upcoming&sig_id=187720534&sig=' + config.meetup.apiKey, function (res) {
		body = '';
		res.on('data', function (chunk) {
			body += chunk;
		});
		res.on('end', function() {
			try {
				var json = JSON.parse(body);
				console.log(json.results.length);

				for(i = i; i < json.results.length; i++) {
					var trans =	translate(json.results[i]);
					var score = moment(trans.time).unix();
					redis.zadd(["data-"+city, score, JSON.stringify(trans)], function(err ,res) {
						if(err) {
							console.log("meetup err" + err);
						}
					});
				}
			} catch (e) {
				console.log(e);
			}
			
				
				
	
		})
	}).end();
}

var maxSize = 500;

function translate(data) {
	return {
		title : data.name,
		text : data.description.substring(0, data.description.length < maxSize
			? data.description.length : maxSize) ,
		time : new Date(data.updated),
		service : "Meetup",
		user : "",
		media :"",
		link: data.event_url
	}
}
