var app = require('express')();
var http = require('http');
var path = require('path');

var flickr = require('./feeds/flickr');
var twitter = require('./feeds/twitter');
var bandsInTown = require('./feeds/bandsInTown');
var meetup = require('./feeds/meetup');


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
	// fetch_single("Hamburg");
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/app/index.html');
});

app.get('/static/style.css', function(req, res) {
	res.sendFile(__dirname + '/app/static/style.css');
});
app.get('/static/logo_full.png', function(req, res) {
	res.sendFile(__dirname + '/app/static/logo_full.png');
});
app.get('/static/bandsintown.png', function(req, res) {
	res.sendFile(__dirname + '/app/static/bandsintown.png');
});
app.get('/static/flickr.png', function(req, res) {
	res.sendFile(__dirname + '/app/static/flickr.png');
});
app.get('/static/meetup.png', function(req, res) {
	res.sendFile(__dirname + '/app/static/meetup.png');
});
app.get('/static/twitter.png', function(req, res) {
	res.sendFile(__dirname + '/app/static/twitter.png');
});
app.get('/static/intown.js', function(req, res) {
	res.sendFile(__dirname + '/app/static/intown.js');
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
			filtered = resp.sort(sort);
			res.json(filtered);
		});
	}
});


var sort = function sortStream(a, b) {
	var result = 0;
	if (moment(a.time).isBefore(moment(b.time))) {
		result = 1;
		console.log("before");
	} else if (moment(a.time).isAfter(moment(b.time))) {
		result = -1;
	}
	return result;
}

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
} else {
	filtered = data;
}
return filtered;	
}

function fetch_single(city) {
	flickr.fetch(city, client);
	twitter.fetch(city, client);
	bandsInTown.fetch(city, http, client);
	meetup.fetch(city, client);
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