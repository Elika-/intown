var Twitter = require('twitter-node-client').Twitter;
var moment = require('moment');
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



exports.fetch = function(city, redis) {
	var success = function (data) {
	var parsed = JSON.parse(data);
	for(i = 0; i < parsed.statuses.length; i++) {
			var data = translate(parsed.statuses[i]);
			var score = moment(data.time).unix();	

			redis.zadd(["data-"+city, score, JSON.stringify(data)], function(err ,res) {
				if(err != null) {
					console.log("err " + err);
				}
				//console.log("added:" + res);
			});

		}
	 };
    twitter.getSearch({'q':city,'count': 15}, error, success);
}


function translate(data) {
	var data =  {
		title : data.text,
		time : data.created_at,
		service : "Twitter",
		user : data.user.screen_name,
		media :""
	}

	if(data.coordinates ) {
		data.location = {
			lat : data.coordinates.lat,
			lon : data.coordinates.lon,
			}
		};

	return data;		
}




