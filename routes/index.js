var express = require('express');
var router = express.Router();
var path = require('path');
var resFolder = path.resolve('./public/');


router.get('/', function (req, res) {
    res.sendFile(resFolder + '/index.html');
});

router.get('/static/style.css', function (req, res) {
    console.log(">>>" + resFolder);
    res.sendFile(resFolder + '/stylesheets/style.css');
});
router.get('/static/logo_full.png', function (req, res) {
    res.sendFile(resFolder + '/images/logo_full.png');
});
router.get('/static/bandsintown.png', function (req, res) {
    res.sendFile(resFolder + '/images/bandsintown.png');
});
router.get('/static/flickr.png', function (req, res) {
    res.sendFile(resFolder + '/images/flickr.png');
});
router.get('/static/meetup.png', function (req, res) {
    res.sendFile(resFolder + '/images/meetup.png');
});
router.get('/static/twitter.png', function (req, res) {
    res.sendFile(resFolder + '/images/twitter.png');
});
router.get('/static/intown.js', function (req, res) {
    res.sendFile(resFolder + '/javascripts/intown.js');
});

module.exports = router;
