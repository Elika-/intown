var express = require('express'),
http = require('http'),
path = require('path'),
amqp = require('amqp');

var app = express();
  app.set('port', process.env.PORT || 3000);
  app.use(express.static(path.join(__dirname, 'public')));


var rabbitMQ = 'localhost'

http.createServer(app).listen(app.get('port'), function() {
	console.log("test");
});





app.get('/:city', function(req,res) {
	connectMQ(res);
	console.log(req.query.city);
});


function connectMQ(res) {
	app.rabbitMqConnection = amqp.createConnection({ host: rabbitMQ });
	app.rabbitMqConnection.on('ready', function(){
	app.connectionStatus = 'Connected!';
	
}) };
