var express = require('express'),
http = require('http'),
path = require('path'),
amqp = require('amqplib');

var rabbitMQ = 'ampq://localhost';

var app = express();
  app.set('port', process.env.PORT || 3000);
  app.use(express.static(path.join(__dirname, 'public')));


var rabbitMQ = 'localhost'

http.createServer(app).listen(app.get('port'), function() {
	console.log("test");
});





app.get('/:city', function(req,res) {
	connectMQ(res);
	res.end("query for: " + req.params.city);
});


function connectMQ(city) { 
amqp.connect(rabbitMQ).then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {
    
    var ok = ch.assertQueue('hello', {durable: false});
    
    ok = ok.then(function(_qok) {
      return ch.consume(city, function(msg) {
        console.log(" [x] Received '%s'", msg.content.toString());
      }, {noAck: true});
    });
    
    return ok.then(function(_consumeOk) {
      console.log(' [*] Waiting for messages. To exit press CTRL+C');
    });
  });
}).then(null, console.warn);

}