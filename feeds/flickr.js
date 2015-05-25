moment = require('moment');
https = require('https');
config = require('config/development');

function cleaner(data) {
	return {
		"title": data['title'],
		"link": "https://www.flickr.com/photos/" + data['owner'] + "/" + data['id'],
		"media": data['url_m'],
		"time": data['datetaken'],
		"service": "flickr",
		"user": data['ownername'],
	}
}

function image_url(data) {
	return "https://farm" + data.id +
		".staticflickr.com/" + data.server +
		"/" + data.id +
		"_" + data.secret +
		".jpg"
}

exports.fetch = function (city, redis) {
	https.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + config.flickr.apiKey +
		"format=json&nojsoncallback=1&per_page=10&extras=date_taken,owner_name,url_m&min_taken_date=" + moment().subtract(1, 'days').unix() +
		"&text=" + city, function(res) {

		body = '';
		res.on('data', function (chunk) {
			body += chunk;
		});

		res.on('end', function() {
				try {
			var data = JSON.parse(body).photos.photo;
			for (i = 0; i < data.length; i++) {
			
				cleaned = cleaner(data[i]);
				var score = moment(cleaned['time']).unix();
					redis.zadd(["data-"+city, score, JSON.stringify(cleaned)], function(err ,res) {
					//	console.log("Flickr " + res);
					});
			

			}
				} catch(e) {
					console.log("Flicker " + e)	
				}
		})
	}).end();
}