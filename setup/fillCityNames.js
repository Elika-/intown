/**
 * Created by mirco on 26.05.15
 * Using Data from https://www.maxmind.com/en/free-world-cities-database
 * Run this script to fill in the data
 */
var fs = require('fs');
var redis = require('redis');
var client = redis.createClient();
var S = require('string');


var content = fs.readFile('worldcitiespop.txt', 'utf8', function (err, data) {
    if (err) throw err;
    var a = data.split('\n');
    a.forEach(function (entry) {
        var e = entry.split(',');
        var name = S(e[2] + ',' + e[0].toUpperCase() + ',0').trim().s;

        client.zadd(['city-names', 0, name], function (err) {
            if (err) {
                throw err;
            }
        });
    })
});
