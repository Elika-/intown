var app = require('express')();
var http = require('http');
var path = require('path');

var flickr = require('./feeds/flickr');
var twitter = require('./feeds/twitter');
var bandsInTown = require('./feeds/bandsInTown');


var redis = require("redis"),
client = redis.createClient();

var expireTime = 60;
var max = -1;

app.set('port', process.env.PORT || 3000);


server = http.Server(app);
server.listen(app.get('port'), function() {
	// Clean existing data from Redis
	console.log("listen");
	client.keys('*', function(err, replies) {
		if (!err && replies.length) {
			client.del(replies, function(err, res) {});
		}
	});
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/app/index.html');
});

app.get('/:city', function(req, res) {
	var queryCity = req.params.city;
	console.log(req.query);
	if (queryCity == 'favicon.ico') {
		res.end();
	} else {
		fetch_single(queryCity);
		var resp = []
		client.zrange(["data-" + queryCity, 0, -1], function(err, reply) {

			for(i = 1; i < reply.length; i++) {
				chunk = JSON.parse(reply[i]);
					resp.push(chunk);
				}

			filtered =	filter_service(req.query.exclude, resp);			
			res.json(filtered);
		});
	}
});

function filter_service(query, data) {
	filtered = [];
	if(query) {
	var excl =  query.split(",").map(function(val) {return val.toUpperCase()});

	for(i = 0; i < data.length; i++) {
		var serv = data[i].service.toUpperCase();
		if(excl.indexOf(serv) == -1) {
			filtered.push(data[i]);
		}

	}
}
return filtered;	
}

function fetch_single(city) {
		console.log("fetch data for "+city);
		flickr.fetch(city, client);
		twitter.fetch(city, client);
		bandsInTown.fetch(city, http,  client);
}

function fetch_data() {

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