var app = require('express')();
var http = require('http').Server(app);
var io = require("socket.io")();
var path = require('path');

var redis = require("redis"),
client = redis.createClient();

var cities = "__cities__"
var max = 100;



app.set('port', process.env.PORT || 3000);



http.listen(app.get('port'), function() {

});

app.get('/:city', function(req,res) {
	var query = req.params.city;
	if(query != cities) {
		client.lrange([query,0 ,max], function(err, reply) {
			if(reply.toString().length === 0) {
				client.rpush(cities, query);
				console.log("added " + query + "to missign cities");
				res.end("No data at the moment, stay tuned!");
			} else {
				console.log(reply);
				res.end(reply.toString())
			}
		});
	}



	
});



