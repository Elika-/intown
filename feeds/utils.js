var moment = require('moment');

// Adds a small amount of seconds to the date, so that the feed is mixed
// Returns a new date
exports.randomize = function (date) {
    return moment(date).seconds(getRandomInt(0, 5));
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}