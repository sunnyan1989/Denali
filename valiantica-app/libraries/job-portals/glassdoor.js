//TODO
/** 
* Library to access glassdoor.com JSON API 
*/
'use strict';

var http = require('http');
var querystring = require('querystring');
var partnerID = '19711';
var apiKey = 'klGzYp5FN8g';
var prefix = "http://api.glassdoor.com/api/api.htm";


function Glassdoor() {
	
}

//Get jobs from Glassdoor.com using given queryParams
Glassdoor.prototype.getJobs = function(queryParams, done) {
	var params = {
		't.p': partnerID,
		't.k': apiKey,
		v: '1.1',
		format: 'json',
		action: 'jobs'
	};

	params.as_and = (typeof queryParams.andKeys === 'undefined')? [''] : queryParams.andKeys;
	params.as_phr = (typeof queryParams.exactPhrase === 'undefined')? [''] : queryParams.exactPhrase;
	params.as_any = (typeof queryParams.orKeys === 'undefined')? [''] : queryParams.orKeys;
	params.as_not = (typeof queryParams.notKeys === 'undefined')? [''] : queryParams.notKeys;
	params.as_ttl = (typeof queryParams.jobTitle === 'undefined')? '' : queryParams.jobTitle;
	params.as_cmp = (typeof queryParams.company === 'undefined')? '' : queryParams.company;
	//siteType : jobsite, employer (get from job boards or direct employer site)
	params.st = (typeof queryParams.siteType === 'undefined')? '' : queryParams.siteType;
	//jobType: parttime, fulltime, contract, internship, temporary
	params.jt = (typeof queryParams.jobTypes === 'undefined')? ['all'] : queryParams.jobTypes;
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
			console.log(chunk);
		});
		res.on('end', function() {
			done(data);
		});
	}).on('error', function(e) {
		console.error("Error receiving data from Glassdoor.com: ", e.message);
	});
	
}

module.exports = new Glassdoor();
