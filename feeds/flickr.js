moment = require('moment');
https = require('https');

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
	https.get("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=98e130ea926d426413730b9018fcbe65&" +
		"format=json&nojsoncallback=1&per_page=10&extras=date_taken,owner_name,url_m&min_taken_date=" + moment().subtract(1, 'days').unix() +
		"&text=" + city, function(res) {
		console.log("https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=98e130ea926d426413730b9018fcbe65&" +
		"format=json&nojsoncallback=1&per_page=10&min_taken_date=" + moment().subtract(1, 'days').unix() +
		"&text=" + city);
		// console.log('STATUS: ' + res.statusCode);
		// console.log('HEADERS: ' + JSON.stringify(res.headers));
		// res.setEncoding('utf8');
		body = '';
		res.on('data', function (chunk) {
			body += chunk;
		});
		res.on('end', function() {
			console.log(JSON.parse(body));
			var data = JSON.parse(body).photos.photo;
			for (i = 0; i < data.length; i++) {
				// console.log(data[i]);
				cleaned = cleaner(data[i]);
				console.log(cleaned, moment(cleaned['time']).unix());
			}
		})
	}).end();
}