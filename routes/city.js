var express = require('express');
var router = express.Router();
var redis = require('redis');
var client = redis.createClient();
var moment = require('moment');
var crawler = require('../model/feeds/crawler.js');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.json({error: 'you need to provide a city'});
});

router.get('/:city', function (req, res) {
    var queryCity = req.params.city;
    if (queryCity == 'favicon.ico') {
        res.end();
    } else {
        crawler.crawl(queryCity);
        var resp = []
        client.zrange(['data-' + queryCity, 0, -1], function (err, reply) {
            for (i = 1; i < reply.length; i++) {
                var chunk;
                try {
                    chunk = JSON.parse(reply[i]);
                    resp.push(chunk);
                } catch (e) {
                    console.log(e);
                    console.log(reply[i]);
                }
            }
            res.type('json');
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


module.exports = router;
