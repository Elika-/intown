var express = require('express');
var router = express.Router();
var redis = require('redis');
var client = redis.createClient();
var flickr = require('../feeds/flickr');
var meetup = require('../feeds/meetup');
var twitter = require('../feeds/twitter');
var bandsintown = require('../feeds/bandsintown');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.json({error: 'you need to provide a city'});
});

router.get('/:city', function (req, res) {
    var queryCity = req.params.city;
    console.log(req.query);
    if (queryCity == 'favicon.ico') {
        res.end();
    } else {
        fetchFor(queryCity);
        var resp = []
        client.zrange(['data-' + queryCity, 0, -1], function (err, reply) {
            for (i = 1; i < reply.length; i++) {
                var chunk = JSON.parse(reply[i]);
                resp.push(chunk);
            }
            res.json(resp.sort(sort));
        });
    }
});

var sort = function sortStream(a, b) {
    var result = 0;
    if (moment(a.time).isBefore(moment(b.time))) {
        result = 1;
    } else if (moment(a.time).isAfter(moment(b.time))) {
        result = -1;
    }
    return result;
}


function fetchFor(city) {
    flickr.fetch(city, client);
    twitter.fetch(city, client);
    bandsintown.fetch(city, client);
    meetup.fetch(city, client);
}

module.exports = router;
