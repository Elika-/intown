var moment = require('moment');
var http = require('http');

exports.fetch = function (city, http, redis) {
    http.get('http://api.bandsintown.com/events/on_sale_soon.json?location=Hamburg&app_id=YOUR_APP_ID231', function (res) {
        body = '';
        console.log(res);
        res.on('data', function (chunk) {
            body += chunk;
        });
        res.on('end', function () {
            try {
                var json = JSON.parse(body);
                for (var i = 0; i < body.length; i++) {
                    var data = translate(json[i]);
                    var score = moment(data.time).unix();
                    redis.zadd(['data-' + city, score, JSON.stringify(data)], function (err, res) {
                        }
                    );


                }
            } catch (e) {
                console.log('BandsInTown Error: ' + e);
            }
        })
    }).end();
}

function translate(data) {
    return {
        title: artistName(data.artists),
        location: {
            lat: data.venue.latitude,
            lon: data.venue.longitude,
            adress: data.venue.location
        },
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
