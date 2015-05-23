var app = require('express')();
var http = require('http');
var io = require("socket.io")();
var path = require('path');
var flickr = require('../feeds/flickr');
var twitter = require('../feeds/twitter');



var redis = require("redis"),
client = redis.createClient();

var expireTime = 60;
var max = -1;

app.set('port', process.env.PORT || 3000);


server = http.Server(app);
server.listen(app.get('port'), function() {


var minutes = 1, the_interval = minutes * 60 * 1000;
fetch_data();
setInterval(fetch_data, the_interval);

});

app.get('/:city', function(req,res) {
	var queryCity = req.params.city;

		client.lrange(["data-"+queryCity, 0 ,max], function(err, reply) {
			if(reply.toString().length === 0) {
				client.rpush("city-" + queryCity, "");
				client.expire(queryCity, expireTime);
				console.log("added " + queryCity );
				res.end("{}");
			} else {
				client.expire("city-" + queryCity, expireTime);
				res.end(reply);
			}
		});
		
});

var fetch_data = function() {
	twitter.fetch("hamburg", client);
	flickr.fetch("hamburg", http, client)
}



