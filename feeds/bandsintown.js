exports.fetch = function(city, http, redis) {
	http.get('http://api.bandsintown.com/events/on_sale_soon.json?location='+city+'&app_id=YOUR_APP_ID231' , function(res) {
		body = '';
		res.on('data', function (chunk) {
			body += chunk;
		});
		res.on('end', function() {
			try {
					console.log(body);
				}
			 catch (e) {
					console.log("BandsInTown Error: " +e);
				}
		})
	}).end();
}
