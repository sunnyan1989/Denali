//TODO
/** 
* Library to access SimplyHired.com XML API
*/
'use strict';

var xml2js = require('xml2js');
var http = require('http');


var queryPrefix = 'http://api.simplyhired.com/a/jobs-api/xml-v2/';
var pubId = '75463'; // publisher id
var parser;	


function SimplyHired() {
	var parser = xml2js.Parser();
}

//Get jobs from Indeed.com using given queryParams
Indeed.prototype.getJobs = function(queryParams, done) {

	
}

module.exports = new SimplyHired();
