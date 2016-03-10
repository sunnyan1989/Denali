'use strict';
var indeedSite = require('../libraries/job-portals/indeed.js');
var careerBuilderSite = require('../libraries/job-portals/careerbuilder.js');

function Jobs() {
	//this.pool = mysql.createPool(config.database);
}

// Load jobs from a site (query with params) and store it into database
Jobs.prototype.loadJobs = function(site, queryParams, done) {
	if (site == 'indeed') {
		indeedSite.getJobs(queryParams, function(result) {
				done(result);
		});;
	}
	if (site == 'careerbuilder') {
		careerBuilderSite.getJobs(queryParams, function(result) {
				done(result);
		});;	
	}
	
}

/*
Users.prototype.get = function(userSid, done) {
	var userSid = userSid || 0;
	if (userSid === 0) {
		this.pool.query("Select * from Users", function(err, rows) {
			if (err) {
				console.log('DB error getting user list: ' + err.stack);
				done([]);
			}
			done(rows);
		});
	}else {
		this.pool.query("Select * from Users where sid=?", userSid, function(err, rows) {
			if (err) {
				console.log('DB error getting user info: ' + err.stack);
				done({});
			}
			done(rows[0]);
		});
	}

} 

*/
//module.exports = new Jobs();
var obj = new Jobs();
var queryParams = {
	andKeys: ['java', 'C++'],
	orKeys: ['Javascript'],
	notKeys: ['QA'],
	userip: '127.0.0.1',
	useragent: 'Mozilla',
	age: 10,
	location: 'Santa Clara, 95051',
	limit: 2,
	salary: '50000-120000',
	radius: 10,
	jobTypes: ['fulltime', 'contract'],
	jobTitle: 'Software Engineer'
}
obj.loadJobs('careerbuilder', queryParams, function(result) {
	console.log(result);
});