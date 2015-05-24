var Twitter = require('twitter-node-client').Twitter;
var moment = require('moment');
    //Get this data from your twitter apps dashboard
    var config = {
        "consumerKey": "iUvYdR6co8eGHjg9q0olkQ",
        "consumerSecret": "WvdbJpj49tBfmLJU3bLITsxx90piBjjRtHLguA0MA",
        "accessToken": "14236464-FdEGhmN3EdlzXTpwfKEJtesupiRkVnMJRxRjKG4ec",
        "accessTokenSecret": "59qpCrDjGtA19VxDozsDmb1vOZbgD4GvIflBh2cizY"
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




