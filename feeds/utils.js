var moment = require('moment');

// Adds a small amount of seconds to the date, so that the feed is mixed
// Returns a new date
exports.randomize = function (date) {
    var offset = getRandomInt(0, 5);
    return moment(date).seconds(offset);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}