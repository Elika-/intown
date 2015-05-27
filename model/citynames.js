var redis = require('redis');
var client = redis.createClient();
var S = require('string');


exports.autocomplete = function (string, res) {
    var completion = [];
    var begin = '[' + string;
    var end = '(' + string + 'z';
    console.log(begin);
    client.zrangebylex(['city-names', begin, end], function (err, data) {
        if (err) {
            completion.push(string);
            console.log(err);

        } else {
            data.forEach(function (d) {

                var obj = toJSON(d);
                completion.push(obj.name + ' (' + obj.country + ')');
            });
            completion.sort();
            res.json(completion);

        }
    });

}

function toJSON(string) {
    var sep = string.split(',');
    return {
        name: sep[0],
        country: sep[1],
        ordinal: sep[2]
    }
}