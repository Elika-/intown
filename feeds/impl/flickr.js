var moment = require('moment');
var https = require('https');
var config = require('../../config/development').flickr;
var DataObject = require('../DataObject.js');
var S = require('string');


exports.fetch = function (city, redis) {
    console.log("FLICKR");
    var url = S('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key={{apiKey}}&' +
    'format=json&nojsoncallback=1&per_page=10&extras=date_taken,owner_name,url_m & min_taken_date ={{minTaken}}' +
    '&text={{city}}').template({
        apiKey: config.apiKey,
        minTaken: moment().subtract(config.maxTimeDiff).unix(),
        text: city
    }).s;
    https.get(url, function (res) {

        body = '';
        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function () {
            var data = JSON.parse(body).photos.photo;
            for (i = 0; i < data.length; i++) {
                var obj = data[i];
                var cleaned = new DataObject('', 'Flickr', moment(obj.datetaken)).withMedia(obj.url_m)
                    .withUser(obj.ownername).withLink('https://www.flickr.com/photos/' + obj.owner + '/' + obj.id);
                var score = moment(obj.datetaken).unix();
                redis.zadd(['data-' + city, score, JSON.stringify(cleaned)], function (err, res) {
                    if (err) {
                        console.log(err)
                    }
                });
            }
        })
    }).end();
}