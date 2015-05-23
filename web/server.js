var app = require('express')();
var http = require('http');
var io = require("socket.io")();
var path = require('path');
var flickr = require('../feeds/flickr');
var twitter = require('../feeds/twitter');
var bandsInTown = require('../feeds/bandsInTown');


var redis = require("redis"),
client = redis.createClient();

var expireTime = 60;
var max = -1;

app.set('port', process.env.PORT || 3000);


server = http.Server(app);
server.listen(app.get('port'), function() {
	var minutes = 1, the_interval = minutes * 60 * 1000;
	//fetch_data();
//	setInterval(fetch_data, the_interval);
});

app.get('/:city', function(req,res) {
	var queryCity = req.params.city;
	fetch_single(queryCity);
	var resp =""
	client.zrange(["data-"+queryCity, 0, -1], function(err, reply) {
		for(i = 1; i < reply.length; i++) {
			resp += reply[i];

		}
		res.end(resp);
	});

		
});

function fetch_single(city) {
			console.log("fetch data for "+city);
		//flickr.fetch(city, http, client);
		twitter.fetch(city, client)
		bandsInTown.fetch(city,http,client);

}

function fetch_data() {
	console.log("fetch_data");
	client.keys('data-*', function(err, reply) {

		for(i = 0; i < reply.length; i++) {
			var city = getPlainName(reply[i]);
			fetch_single(city);
		}

	});
}



function getPlainName(key) {
	return key.substring(5);
}