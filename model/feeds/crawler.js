var twitter = require('./impl/twitter');
var flickr = require('./impl/flickr');
var meetup = require('./impl/meetup');
var bandsintown = require('./impl/bandsintown');


var redis = require('redis');
var client = redis.createClient();


exports.crawl = function (city) {
    twitter.fetch(city, client);
    flickr.fetch(city, client);
    meetup.fetch(city, client);
    bandsintown.fetch(city, client);

}
