var express = require('express');
var router = express.Router();
var citynames = require('../model/citynames.js');


router.get('/:city', function (req, res) {
    citynames.autocomplete(req.params.city, res);
});


module.exports = router;
