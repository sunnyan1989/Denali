/** 
* Library to access glassdoor.com JSON API
*/
'use strict';
var util = require('util');
var http = require('http');
var querystring = require('querystring');
var parseString = require('xml2js').parseString;

var devKey = 'WDHP4CH64B25WT7P9P1V';
var prefix = "http://api.careerbuilder.com/v2/jobsearch";

var jobTypes = {
	fulltime: 'Full-Time',
	parttime: 'Part-Time',
	contract: 'Contractor',
	internship: 'Intern',
	temporary: 'Seasonal/Temp',
}

function Careerbuilder() {
	
}

//Get jobs from Careerbuilder.com using given queryParams
Careerbuilder.prototype.getJobs = function(queryParams, done) {
	var params = {
		DeveloperKey: devKey,
		HostSite: 'US',
	};
	//and keys provided
	if (typeof queryParams.andKeys !== 'undefined' && queryParams.andKeys.length) {
		params.Keywords = queryParams.andKeys.toString();
	}else if (typeof queryParams.orKeys !== 'undefined' && queryParams.orKeys.length) {
		params.BooleanOperator = 'OR';
		params.Keywords = queryParams.orKeys.toString();
	}
	if (typeof queryParams.notKeys !== 'undefined' && queryParams.notKeys.length) {
		params.ExcludeKeywords = queryParams.notKeys.toString();
	}
	
	params.JobTitle = (typeof queryParams.jobTitle === 'undefined')? '' : queryParams.jobTitle;
	
	params.CompanyName = (typeof queryParams.company === 'undefined')? '' : queryParams.company;
	if (typeof queryParams.jobTypes === 'defined') {
		for (var i = 0; i < queryParams.jobTypes.length; i++) {
			params.EmpType += jobTypes[queryParams.jobTypes[i]] + ',';
		}
	}
	
	//salary : ex $50,000 or range like $40K-$50K
	if (typeof queryParams.salary !== 'undefined') {
		var range = queryParams.salary.split('-');
		params.payLow = range[0];
		params.payHigh = range[1];
	}
	//no of miles
	params.Radius = (typeof queryParams.radius === 'undefined')? '' : queryParams.radius;
	//location: area or zipcode
	params.Location = (typeof queryParams.location === 'undefined')? '' : queryParams.location;
	//from no of days back or 'any'
	params.PostedWithin = (typeof queryParams.age === 'undefined')? 'any' : queryParams.age;
	//number of results, default is 10
	params.PerPage = (typeof queryParams.limit === 'undefined')? '' : queryParams.limit;
	
	var requestUrl = prefix + '?' + querystring.stringify(params);
	console.log(requestUrl);
	
	http.get(requestUrl, function(res) {
		var data = "";
		res.on('data', function(chunk) {
			data += chunk;
			//console.log(chunk);
		});
		res.on('end', function() {
			parseString(data, {explicitArray: false}, function(err, result) { 
				console.log(util.inspect(result, false, null));
				done(parseResponse(result.ResponseJobSearch.Results));
			});
		});
	}).on('error', function(e) {
		console.error("Error receiving data from Careerbuilder.com: ", e.message);
	});
	
}

//Create a jobs array from response 
function parseResponse(res) {
	var jobs = [];
	if (typeof res.JobSearchResult !== 'undefined') {
		for (var i = 0; i < res.JobSearchResult.length; i++) {
			var job = {
				title: res.JobSearchResult[i].JobTitle,
				company: res.JobSearchResult[i].Company,
				location: res.JobSearchResult[i].Location,
				source: "",
				postedOn: res.JobSearchResult[i].PostedTime,
				description: res.JobSearchResult[i].DescriptionTeaser,
				url: res.JobSearchResult[i].JobDetailsURL,
				id: res.JobSearchResult[i].DID,
				distance: res.JobSearchResult[i].Distance,
				jobType: res.JobSearchResult[i].EmploymentType
			};
			jobs.push(job);
		}
	}
	return jobs;
}

module.exports = new Careerbuilder();
