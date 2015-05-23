var app = require('express')();
var http = require('http').Server(app);
var io = require("socket.io")();
var path = require('path');

var redis = require("redis"),
client = redis.createClient();

var expireTime = 60;
var max = -1;

app.set('port', process.env.PORT || 3000);


http.listen(app.get('port'), function() {

});

app.get('/:city', function(req,res) {
	var queryCity = req.params.city;


		client.lrange(["data-"+queryCity, 0 ,max], function(err, reply) {
			if(reply.toString().length === 0) {
				client.rpush("city-"+queryCity, "");
				client.expire(queryCity, expireTime);
				console.log("added " + queryCity );
				res.end("{}");

			} else {
				client.expire("city-"+queryCity, expireTime);
				res.end(JSON.stringify{reply.toString()});
			}
		});
		
});



