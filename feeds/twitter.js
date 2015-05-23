var Twitter = require('twitter-node-client').Twitter;
    //Get this data from your twitter apps dashboard
    var config = {
        "consumerKey": "cMWS2TdDswyMV3v1PhPx0I5vB",
        "consumerSecret": "jLn1kx5GmvqYIuvdstNDcSY3ODbDgBJ0lzqEDFcWrgOxHhCGAb",
        "accessToken": "313635473-MLzcfi4CsFaEPZ1RxaLsU3A8OgruRL6fAr8nxTL0",
        "accessTokenSecret": "NBIT1sok4RcuYX9RX5n8SUYo3nz8BJ9yAdJEDeywTE3dR"
    }

var twitter = new Twitter(config);

var error = function (err, response, body) {
	console.log('ERROR [%s]', err);
};

var success = function (data) {
	var parsed = JSON.parse(data);
	console.log(parsed.statuses.length);

for(i = 0; i < parsed.statuses.length; i++) {
		console.log(translate(parsed.statuses[i]));
	}
 };

exports.fetch = function(city, redis) {
    twitter.getSearch({'q':'#'+city,'count': 10}, error, success);
}


function translate(data) {

	return {
		title : data.text,
		location : {
			cord : data.coordinates,
			geo : data.geo
		},
		time : data.created_at,
		service : "Twitter",
		user : data.user.screen_name,
		media :""
	}
}




