var moment = require('moment');

// Adds a small amount of seconds to the date, so that the feed is mixed
// Returns a new date
exports.randomize = function (date) {
    var offset = getRandomInt(0, 5);
    return moment(date).seconds(offset);
}

exports.shouldAdd = function (string) {
    return true;
}

exports.buildData = function (pshort, ptime, pservice, ptext, plocation, plink, puser, pmedia) {
    if (!short || !time || !service) {
        throw {name: 'Missing Parameters', message: 'short text, time and service must be set'};
    }
    return {
        short: pshort,
        time: ptime,
        service: pservice,
        text: ptext || '',
        location: plocation || {},
        link: plink,
        user: puser || '',
        media: pmedia || ''
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}