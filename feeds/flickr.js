moment = require('moment')();

function cleaner(data) {
	return {
		"title": data['title'],
		"link": data['link'],
		"time": data['date_taken'],
		"service": data['flickr'],
		"user": data['author'],
	}
}

exports.fetch = function (city, http, redis) {

	http.get("http://api.flickr.com/services/feeds/photos_public.gne?format=json", function(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		body = '';
		res.on('data', function (chunk) {
			body += chunk;
		});
		res.on('end', function() {
			try {
				data = JSON.parse(body.substring(15, body.length - 1))['items'];
				for (i = 0; i < data.length; i++) {
					cleaned = cleaner(data[i]);
					console.log(cleaned, moment(cleaned['time']));
				}
			} catch (e) {
				console.log("Flickr Error: " +e);
			}
		})
	}).end();

}