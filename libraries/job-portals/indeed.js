/** 
* Library to access Indeed.com JSON API
*/
'use strict';

var http = require('http');
var querystring = require('querystring');
var pubId = "2813506204152128"; // publisher ID
var prefix = "http://api.indeed.com/ads/apisearch";


function Indeed() {
	
}

//Get jobs from Indeed.com using given queryParams
Indeed.prototype.getJobs = function(queryParams, done) {
	var params = {
		publisher: pubId, 
		v: 2,
		format: 'json',
	};
	params.q = (typeof queryParams.andKeys === 'undefined')? '' : queryParams.andKeys.join(' ');
	//siteType : jobsite, employer (get from job boards or direct employer site)
	params.st = (typeof queryParams.siteType === 'undefined')? 'all' : queryParams.siteType;
	//jobType: parttime, fulltime, contract, internship, temporary
	params.jt = (typeof queryParams.jobTypes === 'undefined')? 'all' : queryParams.jobTypes;
	//salary : ex $50,000 or range like $40K-$50K
	params.salary = (typeof queryParams.salary === 'undefined')? '' : queryParams.salary;
	//no of miles
	params.radius = (typeof queryParams.radius === 'undefined')? '' : queryParams.radius;
	//location: area or zipcode
	params.l = (typeof queryParams.location === 'undefined')? '' : queryParams.location;
	//from no of days back or 'any'
	params.fromage = (typeof queryParams.age === 'undefined')? 'any' : queryParams.age;
	//number of results, default is 10
	params.limit = (typeof queryParams.limit === 'undefined')? '' : queryParams.limit;
	params.userip = queryParams.userip;
	params.useragent = queryParams.useragent;
	
	var requestUrl = prefix + '?' + querystring.stringify(params);
	console.log(requestUrl);
	
	http.get(requestUrl, function(res) {
		var data = "";
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on('end', function() {
			console.log(data);
			var jobs = parseResponse(JSON.parse(data));
			done(jobs);
		});
	}).on('error', function(e) {
		console.error("Error receiving data from Indeed.com: ", e.message);
	});
	
}

//Create a jobs array from response 
function parseResponse(res) {
	var jobs = [];
	if (typeof res.results !== 'undefined') {
		for (var i = 0; i < res.results.length; i++) {
			var job = {
				title: res.results[i].jobtitle,
				company: res.results[i].company,
				location: res.results[i].formattedLocationFull,
				source: res.results[i].source,
				postedOn: res.results[i].date,
				description: res.results[i].snippet,
				url: res.results[i].url,
				id: res.results[i].jobkey,
				jobType: ""
			};
			jobs.push(job);
		}
	}
	return jobs;
}

module.exports = new Indeed();
