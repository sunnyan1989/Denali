'use strict';

var moment = require('moment');
//var pool;
function Reports() {

}

/* Return list of report_cm_activitydetailbycm() from database SP */
Reports.prototype.report_cm_activitydetailbycm = function(req, done) {
    /* SP input parameters
IN  caller_sid INT,
IN  caller_ip varchar(45),
IN  tenant_id INT,
IN  cm_person_id INT, -- can't be NULL
IN  begin_date_i varchar(10), -- if not used, set to NULL
IN  end_date_i varchar(10) -- if not used, set to NULL
     */
    
    //console.log(req.body.begin_date);
    
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;

    var cm_person_id = typeof req.body.cm_person_id !== 'undefined' && typeof req.body.cm_person_id.sid !== 'undefined' && req.body.cm_person_id.sid !== null ? parseInt(req.body.cm_person_id.sid) : null;
    var begin_date = typeof req.body.begin_date !== 'undefined' && req.body.begin_date !== '' && req.body.begin_date !== null ? req.body.begin_date : null;
    var end_date = typeof req.body.end_date !== 'undefined' && req.body.end_date !== '' && req.body.end_date !== null ? req.body.end_date : null;

    if (begin_date !== null)
        begin_date = this.addQuotes(moment(begin_date).format('YYYY-MM-DD'));
    
    if (end_date !== null)
        end_date = this.addQuotes(moment(end_date).format('YYYY-MM-DD'));

    var querystr = "call report_cm_activitydetailbycm (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + cm_person_id + ", " + begin_date + ", " + end_date + ");";
    console.log("run SP --- " + querystr);
    this.query(req, querystr, done);

};

/* Return list of report_cm_jobsbyvendor() from database SP */
Reports.prototype.report_cm_jobsbyvendor = function(req, done) {
    /* SP input parameters
IN  caller_sid INT,
IN  caller_ip varchar(45),
IN  tenant_id INT, -- can't be NULL
IN  vendor_i varchar(128),
IN  jobstatus_id INT
     */
    //console.log(req.body);
	
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;

	var job_status = req.body.job_status.sid !== null ? parseInt(req.body.job_status.sid) : null;
    var vendor_i =   req.body.vendor_i == 'All Vendors' || req.body.vendor_i == null ? null : '"'+req.body.vendor_i+'"';

    var querystr = "call report_cm_jobsbyvendor (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + vendor_i + ", " + job_status + ");";
    console.log("run SP --- " + querystr);
    this.query(req, querystr, done);

};

/* Return list of hotlistjobstatus_getlist() from database SP */
Reports.prototype.getJobStatusList = function(req, done) {
    /* SP input parameters
IN  caller_sid INT,
IN  caller_ip varchar(45),
IN  tenant_sid INT,
IN  status_sid INT  -- if not used, pass NULL
     */
	
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;

    var querystr = "call hotlistjobstatus_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", 1);";
    console.log("run SP --- " + querystr);

    this.query(req, querystr, done);
};

/* Return list of jobdescription_getdistinctvendor() from database SP */
Reports.prototype.getDistinctVendorList = function(req, done) {
    /* SP input parameters
		IN  caller_sid INT,
		IN  caller_ip varchar(45),
		IN  tenant_sid INT,
		IN  vendor_i varchar(128)
     */
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;

    var querystr = "call jobdescription_getdistinctvendor (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", NULL);";
    console.log("run SP --- " + querystr);

    this.query(req, querystr, done);
};

/* Return list of hotliststatus_getlist() from database SP */
Reports.prototype.getCandStatusList = function(req, done) {
    /* SP input parameters
		IN  caller_sid INT,
		IN  caller_ip varchar(45),
		IN  tenant_sid INT,
		IN  status_sid INT  -- if not used, pass NULL
     */
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;

    var querystr = "call hotliststatus_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", 1);";
    console.log("run SP --- " + querystr);

    this.query(req, querystr, done);
};

/* Return list of report_cm_activitybycm() from database SP */
Reports.prototype.report_cm_activitybycm = function(req, done) {
    /* SP input parameters
IN  caller_sid INT,
IN  caller_ip varchar(45),
IN  tenant_id INT,
IN  cm_person_id INT, -- can't be NULL
IN  candidate_id INT, -- if not used, set to NULL
IN  status_id INT,    -- if not used, set to NULL
IN  begin_date_i varchar(10), -- if not used, set to NULL
IN  end_date_i varchar(10) -- if not used, set to NULL
     */
    //console.log("req-body");
    //console.log(req.body);
    
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;

    var candidate_status = typeof req.body.candidate_status !== 'undefined' && typeof req.body.candidate_status.sid !== 'undefined' && req.body.candidate_status.sid !== null ? parseInt(req.body.candidate_status.sid) : null;
    var candidate_id =     typeof req.body.candidate_id     !== 'undefined' && typeof req.body.candidate_id.sid     !== 'undefined' && req.body.candidate_id.sid     !== null ? parseInt(req.body.candidate_id.sid)     : null;
    var cm_person_id = typeof req.body.cm_person_id !== 'undefined' && typeof req.body.cm_person_id.sid !== 'undefined' && req.body.cm_person_id.sid !== null ? parseInt(req.body.cm_person_id.sid) : null;
    var begin_date = typeof req.body.begin_date !== 'undefined' && req.body.begin_date !== '' && req.body.begin_date !== null ? req.body.begin_date : null;
    var end_date = typeof req.body.end_date !== 'undefined' && req.body.end_date !== '' && req.body.end_date !== null ? req.body.end_date : null;

    if (begin_date !== null)
        begin_date = this.addQuotes(moment(begin_date).format('YYYY-MM-DD'));
    
    if (end_date !== null)
        end_date = this.addQuotes(moment(end_date).format('YYYY-MM-DD'));

    var querystr = "call report_cm_activitybycm (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + cm_person_id + ", " + candidate_id + ", " + candidate_status + ", " + begin_date + ", " + end_date + ");";
    console.log("run SP --- " + querystr);
    this.query(req, querystr, done);

};

/* Return list of report_cm_activitybycandidate() from database SP */
Reports.prototype.report_cm_activitybycandidate = function(req, done) {
    /* SP input parameters
     IN  caller_sid INT,
     IN  caller_ip varchar(45),
     IN  tenant_id INT,
     IN  status_id INT,    -- if not used, set to NULL
     IN  candidate_id INT, -- if not used, set to NULL
     IN  cm_person_id INT, -- if not used, set to NULL
     IN  begin_date_i varchar(10), -- if not used, set to NULL
     IN  end_date_i varchar(10) -- if not used, set to NULL
     */
    
    //console.log(req.body);
    
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;

    var statusSid = typeof req.body.statusSid !== 'undefined' && req.body.statusSid !== null ? parseInt(req.body.statusSid) : null;
    var candidate_id = typeof req.body.candidate_id !== 'undefined' && typeof req.body.candidate_id.sid !== 'undefined' && req.body.candidate_id.sid !== null ? parseInt(req.body.candidate_id.sid) : null;
    var cm_person_id = typeof req.body.cm_person_id !== 'undefined' && typeof req.body.cm_person_id.sid !== 'undefined' && req.body.cm_person_id.sid !== null ? parseInt(req.body.cm_person_id.sid) : null;
    var begin_date = typeof req.body.begin_date !== 'undefined' && req.body.begin_date !== '' && req.body.begin_date !== null ? req.body.begin_date : null;
    //if (begin_date !== null) begin_date = moment(begin_date).format('YYYY-MM-DD');
    var end_date = typeof req.body.end_date !== 'undefined' && req.body.end_date !== '' && req.body.end_date !== null ? req.body.end_date : null;
    //if (end_date !== null) end_date = moment(end_date).format('YYYY-MM-DD');

    if (begin_date !== null)
        begin_date = this.addQuotes(moment(begin_date).format('YYYY-MM-DD'));
    
    if (end_date !== null)
        end_date = this.addQuotes(moment(end_date).format('YYYY-MM-DD'));

    var querystr = "call report_cm_activitybycandidate (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + statusSid + ", " + candidate_id + ", " + cm_person_id + ", " + begin_date + ", " + end_date + ");";
    console.log("run SP --- " + querystr);
    this.query(req, querystr, done);

};

/* Return list of candidate_getlist() from database SP */
Reports.prototype.getCandidateList = function(req, done) {
    /* SP input parameters
     IN  caller_sid INT,
     IN  caller_ip varchar(45),
     IN  tenant_sid INT,
     IN  status_sid INT,  -- if not used, pass NULL
     IN  partialname varchar(256), -- if not used, pass NULL
     IN  partialstate varchar(45) -- if not used, pass NULL
     */
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;

    var querystr = "call candidate_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", 1, NULL, NULL);";
    console.log("run SP --- " + querystr);

    this.query(req, querystr, done);
};

/* Return list of hotlistassignment_cmperson_getlist() from database SP */
Reports.prototype.getCMList = function(req, done) {
    /* SP input parameters
     IN  caller_sid INT,
     IN  caller_ip varchar(45),
     IN  tenant_sid INT
     */
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;

    var querystr = "call hotlistassignment_cmperson_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ");";
    console.log("run SP --- " + querystr);

    this.query(req, querystr, done);
};

Reports.prototype.query = function(req, query, done) {

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {
            //console.log(error);
            if (error || result[0][0].return_code == 1) {
                done({"msg": "DB error. Please check DB log."});
            } else {
                //console.log(result[1]);
                done(result[1]);
            }

        });

    });
};

Reports.prototype.addQuotes = function(string) {
    return "'" + string + "'";
};

module.exports = new Reports();