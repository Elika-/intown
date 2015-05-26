var https = require('https');
var config = require('../../config/development.js').meetup;
var DataObject = require('../DataObject');
var S = require('string');


exports.fetch = function (city, redis) {
    var url = S('https://api.meetup.com/2/open_events?and_text=False&country=de&offset=0&city={{cityPar}}&format=json&' +
    'limited_events=False&photo-host=public&page=20&radius=25.0&desc=True&status=upcoming&sig_id=187720534&sig={{apiKey}}').template({
        cityPar: city,
        apiKey: config.apiKey
    }).s

    console.log(url);
    https.get(url, function (res) {
        var body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            try {
                var json = JSON.parse(body);
                for (i = 0; i < json.results.length; i++) {
                    var trans = new DataObject('data.name', 'Meetup', new Date(json.results[i].updated))
                        .withLongText(S(json.results[i].description).
                            truncate(config.descSize)).withLink(json.results[i].event_url);
                    var score = moment(trans.time).unix();
                    redis.zadd(['data-' + city, score, JSON.stringify(trans)], function (err, res) {
                        if (err) {
                            console.log('meetup err' + err);
                        }
                    });
                }
            } catch (e) {
                console.log(e);
            }
            ;
        })
    }).end();
}


