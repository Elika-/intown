var moment = require('moment');
var http = require('http');
var S = require('string');

exports.fetch = function (city, redis) {
    var url = S('http://api.bandsintown.com/events/on_sale_soon.json?location={{name}}&app_id=YOUR_APP_ID231').template({name: city}).s;
    http.get(url, function (res) {
        body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            try {
                var json = JSON.parse(body);
                for (var i = 0; i < body.length; i++) {
                    var data = translate(json[i]);
                    var valid = moment().isBetween(moment(), moment().add(2, 'd'));
                    if (valid) {
                        var score = moment(data.time).unix();
                        redis.zadd(['data-' + city, score, JSON.stringify(data)], function (err, res) {
                            }
                        )
                    }
                    ;
                }
            } catch (e) {
                console.log('BandsInTown Error: ' + e);
            }
        })
    }).end();
};

function translate(data) {
    return {
        short: artistName(data.artists),
        location: {
            lat: data.venue.latitude,
            lon: data.venue.longitude,
            adress: data.venue.location
        },
        text: '',
        time: data.datetime,
        service: 'BandsInTown',
        user: '',
        media: '',
        link: data.url
    }
}

function artistName(data) {
    var names = '';
    for (i = 0; i < data.length; i++) {
        names += data[i].name;
        if (i < data.length - 1) {
            names += '; ';
        }
    }
    return names;
}
