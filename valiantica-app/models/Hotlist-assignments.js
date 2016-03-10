'use strict';

function HotlistAssignments() {
}
/*
 * Returns candidates assigned to logged in user for a hotlist
 */
HotlistAssignments.prototype.getMyCandidates = function(req, done) {

    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var hotlistSid = typeof req.body.hotlistSid !== 'undefined' ? req.body.hotlistSid : "";
    //if (action === "Update") {
    var query = "call candidate_getmycandidates (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + hotlistSid + ", " + caller_sid + ", null);";

    console.log("query---" + query);

    this.query(req, query, done);

}

/*
 * Returns jobs for a given hot list assignment
 */
HotlistAssignments.prototype.getTransactionsByJob = function(req, done) {

    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var hotlistjob_id = typeof req.body.job_sid !== 'undefined' ? req.body.job_sid : null;

    var query = "call hotlistransaction_getlistbyperson (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + hotlistjob_id + ");";

    console.log("query---" + query);

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {
            //console.log(result[0][0].return_code);
            if (error || result[0][0].return_code == 1) {
                done(null);
            } else {
                done(result[1]);
            }
        });

    });

}


HotlistAssignments.prototype.getJobs = function(req, done) {

    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var hotlistAssignmentSid = typeof req.body.hotlistAssignmentSid !== 'undefined' ? req.body.hotlistAssignmentSid : null;
    //var statusList = typeof req.body.statusList !== 'undefined' ? "'"+req.body.statusList+"'" : null;
    var isHot = typeof req.body.isHot !== 'undefined' ? req.body.isHot : null;

    //console.log("req.body.statusList---" + req.body.statusList);

    var statusList;

    if (isHot === "true")
        isHot = 1;
    else
        isHot = null;

    if (typeof req.body.statusList === "undefined" || req.body.statusList === "0" || req.body.statusList === 0) {
        statusList = "1,2,3,4,5,6,7,8,9";
    } else if (req.body.statusList === "0,10") {
        statusList = "1,2,3,4,5,6,7,8,9,10";
    } else {
        statusList = req.body.statusList;
    }

    var query = "call hotlistassignmentjob_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + hotlistAssignmentSid + ", '" + statusList + "', " + isHot + ");";

    console.log("query---" + query);

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {

            //console.log(result[0][0].return_code);
            if (error || result[0][0].return_code == 1) {
                done(null);
            } else {
                //console.log("jobs lists");

                var jobs = result[1];
                var asyncCount = result[1].length;
                //console.log(asyncCount);
                if (asyncCount > 0) {

                    //for (var i = 0; i < asyncCount; i++) {
                    //    var index = i;
                    //    jobs[index].transactions = {};

                    //console.log(index);

                    var query = "call hotlistransaction_getlistbyassignment (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + hotlistAssignmentSid + ");";
                    console.log(query);
                    connection.query(query, function(error, result1, fields) {
                        //console.log("getTransactionsByJob1111");
                        //
                        //console.log(result1[1]);
                        if (error || result1[0][0].return_code == 1) {
                            //done(null);
                            done({jobs: jobs, transactions: []});
                        } else {
                            //console.log("jobs[i]");
                            //console.log(index);
                            //console.log(result1[1]);
                            //jobs[index].transactions = result1[1];
                            //console.log(jobs);
                            //console.log({jobs:jobs, transactions:result1[1]});
                            done({jobs: jobs, transactions: result1[1]});
                            //console.log(jobs);
                        }

                    });

                    //console.log("hotlistransaction_getlistbyassignment1 end");

                    // }
                } else {
                    done(null);
                }

            }

        });

    });

    // console.log("hotlistassignmentjob_getlist end");

}

/*
 * Returns jobs for a given hot list assignment
 */
HotlistAssignments.prototype.getSingleJob = function(req, done) {

    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var jobSid = typeof req.body.jobSid !== 'undefined' ? req.body.jobSid : null;

    var query = "call hotlistassignmentjob_get (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + jobSid + ");";
    //console.log("getSingleJob");
    console.log("query---" + query);
    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {

            //console.log(result[0][0].return_code);
            if (error || result[0][0].return_code == 1) {
                //console.log(error);
                done(null);
            } else {
                //console.log(result[1]);
                var rows = result[1];

                if (rows.length > 0) {
                    var query = "call hotlistransaction_getlistbyperson (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + jobSid + ");";

                    connection.query(query, function(error, result1, fields) {
                        //console.log("getTransactionsByJob1111");
                        //console.log(result1);
                        if (error || result1[0][0].return_code == 1) {
                            //console.log(error);
                            done(null);
                        } else {
                            //done(result1[1]);
                            rows[0].transactions = result1[1];
                            done(rows);
                            //console.log(rows);
                        }

                    });
                } else {
                    done(null);
                }

            }

        });

    });

}

HotlistAssignments.prototype.getNotificationEmails = function(req, done) {

    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var HotListAssignment_id = typeof req.body.HotListAssignment_id !== 'undefined' ? req.body.HotListAssignment_id : "";
    //if (action === "Update") {
    var query = "call hotlistassignmentjob_getnotificationemails (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + HotListAssignment_id + ");";

    console.log("query---" + query);

    this.query(req, query, done);

}

/*
 * Returns jobs for a given hot list assignment
 */
HotlistAssignments.prototype.getSearchUrl = function(req, done) {

    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var status_sid = typeof req.body.status_sid !== 'undefined' ? req.body.status_sid : "";
    //if (action === "Update") {
    var query = "call searchurl_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + status_sid + ");";

    console.log("query---" + query);

    this.query(req, query, done);

}

/*
 * Returns jobs for a given hot list assignment
 */
HotlistAssignments.prototype.getEmailTemplate = function(req, done) {
    //console.log(datalist);
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var cm_sid = typeof req.body.datalist.cm_sid !== 'undefined' ? req.body.datalist.cm_sid : "";
    var eid = typeof req.body.datalist.eid !== 'undefined' ? req.body.datalist.eid : "";

    var query = "call emailtemplate_get (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + cm_sid + ", " + eid + ");";

    console.log("query---" + query);

    this.query(req, query, done);

}

HotlistAssignments.prototype.getEmailTemplateFromService = function(req, datalist, done) {
    //console.log(datalist);
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var cm_sid = typeof datalist.cm_sid !== 'undefined' ? datalist.cm_sid : "";
    var eid = typeof datalist.eid !== 'undefined' ? datalist.eid : "";

    var query = "call emailtemplate_get (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + cm_sid + ", " + eid + ");";

    console.log("query---" + query);

    this.query(req, query, done);

}

/*
 * Returns jobs for a given hot list assignment
 */
HotlistAssignments.prototype.getJobDescription = function(req, done) {

    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    /*var type = typeof req.body.datalist.type !== 'undefined' ? req.body.datalist.type : null;
     var keywords = typeof req.body.datalist.keywords !== 'undefined' ? req.body.datalist.keywords : null;*/

    var type = typeof req.body.type !== 'undefined' && req.body.type !== "" ? req.body.type : null;
    var keywords = typeof req.body.keywords !== 'undefined' && req.body.keywords !== "" ? this.addQuotes(req.body.keywords) : null;

    if (type === "source") {
        var dataname = "jobdescription_getdistinctsource";
    } else if (type === "client") {
        var dataname = "jobdescription_getdistinctclient";
    } else {
        var dataname = "jobdescription_getdistinctvendor";
    }

    var query = "call " + dataname + " (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + keywords + ");";

    console.log("query---" + query);

    this.query(req, query, done);

}

/*
 * Returns jobs for a given hot list assignment
 */
HotlistAssignments.prototype.checkdUplicate = function(req, done) {

    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var assignment_sid = typeof req.body.assignment_sid !== 'undefined' ? req.body.assignment_sid : "";
    var joblink = typeof req.body.joblink !== 'undefined' ? this.addQuotes(req.body.joblink) : "";

    var query = "call hotlistassignmentjob_checkduplicate (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + assignment_sid + ", " + joblink + ");";
    //console.log("query---" + query);

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {
            
            console.log(result[1]);
            
            if (error || result[0][0].return_code === 1) {
                done({type: null, result: null});
            } else {

                if (result[1].length > 0) {
                    done({type: 1, result: result[1]});
                } else {
                    done({type: 2, result: result[2]});
                }

            }

        });

    });

}


/*
 * Returns transaction logs for a job
 */
/*HotlistAssignments.prototype.getTransactionsByJob = function(req, caller_sid, caller_ip, tenant_sid, jobSid, done, job) {
 
 
 var query = "call hotlistransaction_getlistbyperson (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + jobSid + ");";
 
 console.log("query---" + query);
 
 req.getConnection(function(err, connection) {
 
 if (err) {
 done({err: true, msg: 'database connect error'});
 return;
 }
 
 connection.query(query, function(error, result, fields) {
 //console.log("getTransactionsByJob");
 //console.log(result);
 if (error || result[0][0].return_code == 1) {
 done(null);
 } else {
 //console.log(result[1]);
 //if (typeof job !== 'undefined')
 //    job.transactions = result[1];
 if (result[1].length > 0) {
 done(result[1][0]);
 } else {
 done(null);
 }
 
 }
 
 });
 
 });
 
 };*/

/*
 * Add a job to a hot list assignment
 */
HotlistAssignments.prototype.addJob = function(req, done) {
    //console.log(job);

    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var job = req.body.job;
    var errObj = {err: true, msg: 'Failed to insert job: ' + job.title};

    job.source = typeof job.source !== 'undefined' && job.source !== null ? this.addQuotes(job.source) : null;
    job.description = typeof job.description !== 'undefined' && job.description !== null ? this.addQuotes(job.description) : null;
    job.client = typeof job.client !== 'undefined' && job.client !== null ? this.addQuotes(job.client) : null;
    job.vendor = typeof job.vendor !== 'undefined' && job.vendor !== null ? this.addQuotes(job.vendor) : null;
    job.vendorphone = typeof job.vendorphone !== 'undefined' && job.vendorphone !== null ? this.addQuotes(job.vendorphone) : null;
    job.vendoremail = typeof job.vendoremail !== 'undefined' && job.vendoremail !== "" ? this.addQuotes(job.vendoremail) : null;
    job.joblink = typeof job.joblink !== 'undefined' && job.joblink !== null ? this.addQuotes(job.joblink) : null;
    job.title = typeof job.title !== 'undefined' && job.title !== null ? this.addQuotes(job.title) : null;
    job.hourlyrate = typeof job.hourlyrate !== 'undefined' && job.hourlyrate !== null ? this.addQuotes(job.hourlyrate) : null;
    job.annualsalary = typeof job.annualsalary !== 'undefined' && job.annualsalary !== null ? this.addQuotes(job.annualsalary) : null;
    job.vendorcontact = typeof job.vendorcontact !== 'undefined' && job.vendorcontact !== null ? this.addQuotes(job.vendorcontact) : null;
    job.ID = typeof job.ID !== 'undefined' && job.ID !== null ? this.addQuotes(job.ID) : null;
    job.keywords = typeof job.keywords !== 'undefined' && job.keywords !== null ? this.addQuotes(job.keywords) : null;

    var query = "call hotlistassignmentjob_insert (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid
            + ", " + job.hotlistSid + ", " + job.hotlistAssignmentSid + ", " + job.source + ", " + job.description
            + ", " + job.client + ", " + job.vendor + ", " + job.vendorphone + ", " + job.vendoremail
            + ", " + job.joblink + ", " + job.title + ", " + job.hourlyrate + ", " + job.annualsalary
            + ", null, null, null, null, " + job.vendorcontact + ", " + job.ID + ", " + job.keywords + ");";

    console.log("query---" + query);
    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {

            //console.log(result);
            if (error || result[0][0].return_code == 1) {
                done(errObj);
            } else {
                done({err: false, hotlistjob_id: result[1][0].hotlistjob_id, msg: 'Inserted job: ' + job.title + ' successfully'});
            }

        });

    });

};

/*
 * Add a job to a hot list assignment
 */
HotlistAssignments.prototype.editJob = function(req, done) {

    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var job = req.body.job;

    var errObj = {err: true, msg: 'Failed to Edit job: ' + job.title};

    //console.log("job.source--" + job.source);

    job.source = typeof job.source !== 'undefined' && job.source !== null ? this.addQuotes(job.source) : null;
    job.description = typeof job.description !== 'undefined' && job.description !== null ? this.addQuotes(job.description) : null;
    job.client = typeof job.client !== 'undefined' && job.client !== null ? this.addQuotes(job.client) : null;
    job.vendor = typeof job.vendor !== 'undefined' && job.vendor !== null ? this.addQuotes(job.vendor) : null;
    job.vendorphone = typeof job.vendorphone !== 'undefined' && job.vendorphone !== null ? this.addQuotes(job.vendorphone) : null;
    job.vendoremail = typeof job.vendoremail !== 'undefined' && job.vendoremail !== '' ? this.addQuotes(job.vendoremail) : null;
    job.joblink = typeof job.joblink !== 'undefined' && job.joblink !== null ? this.addQuotes(job.joblink) : null;
    job.title = typeof job.title !== 'undefined' && job.title !== null ? this.addQuotes(job.title) : null;
    job.hourlyrate = typeof job.hourlyrate !== 'undefined' && job.hourlyrate !== null ? this.addQuotes(job.hourlyrate) : null;
    job.annualsalary = typeof job.annualsalary !== 'undefined' && job.annualsalary !== null ? this.addQuotes(job.annualsalary) : null;
    job.vendorcontact = typeof job.vendorcontact !== 'undefined' && job.vendorcontact !== null ? this.addQuotes(job.vendorcontact) : null;
    job.ID = typeof job.ID !== 'undefined' && job.ID !== null ? this.addQuotes(job.ID) : null;
    job.keywords = typeof job.keywords !== 'undefined' && job.keywords !== null ? this.addQuotes(job.keywords) : null;

    var query = "call jobdescription_update (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid
            + ", " + job.JobDescription_sid + ", " + job.source + ", " + job.description
            + ", " + job.client + ", " + job.vendor + ", " + job.vendorphone + ", " + job.vendoremail
            + ", " + job.joblink + ", " + job.title + ", " + job.hourlyrate + ", " + job.annualsalary
            + ", " + job.vendorcontact + ", " + job.ID + ", " + job.keywords + ");";

    console.log("query---" + query);
    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {
            //console.log(result);
            if (error || result[0][0].return_code == 1) {
                done(errObj);
            } else {

                done({err: false, hotlistjob_id: result[1][0].JobDescription_id, msg: 'Edit job: ' + job.title + ' successfully'});
            }

        });

    });
};

/*
 * Update status of a hot list assignment
 */
HotlistAssignments.prototype.updateStatus = function(req, done) {


    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var hotlistAssignment = typeof req.body.hotlistAssignment !== 'undefined' ? req.body.hotlistAssignment : null;
    var note_i = typeof hotlistAssignment.note_i !== 'undefined' && hotlistAssignment.note_i !== "" ? this.addQuotes(hotlistAssignment.note_i) : null;
    var errObj = {err: true, msg: 'Status update failed for candidate: ' + hotlistAssignment.candidate};

    var query = "call hotlistassignment_updatestatus (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid
            + ", " + hotlistAssignment.hotlistSid + ", " + hotlistAssignment.sid + ", " + hotlistAssignment.statusSid
            + ", " + note_i + ");";

    console.log("query---" + query);
    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {

            //console.log(result[0][0].return_code);
            if (error || result[0][0].return_code == 1) {
                done(errObj);
            } else {
                done({err: false, msg: 'Updated status for candidate: ' + hotlistAssignment.candidate + ' successfully'});
            }

        });

    });

}

/*
 * Update status of a hot list assignment
 */
HotlistAssignments.prototype.updateJobStatus = function(req, done) {
    var errObj = {err: true, msg: 'Status update failed'};


    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var hotListData = typeof req.body.hotListData !== 'undefined' ? req.body.hotListData : null;

    if (hotListData.note !== null) {
        hotListData.note = this.addQuotes(hotListData.note);
    }

    if (hotListData.hourlyrate !== null && typeof hotListData.hourlyrate !== 'undefined') {
        hotListData.hourlyrate = this.addQuotes(hotListData.hourlyrate);
    } else {
        hotListData.hourlyrate = null;
    }

    if (hotListData.annualsalary !== null && typeof hotListData.annualsalary !== 'undefined') {
        hotListData.annualsalary = this.addQuotes(hotListData.annualsalary);
    } else {
        hotListData.annualsalary = null;
    }

    var query = "call hotlistassignmentjob_updatestatus (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid
            + ", " + hotListData.HotListJob_id + ", " + hotListData.newHotLisJobtStatus_sid + ", " + hotListData.note
            + ", " + hotListData.hourlyrate + ", " + hotListData.annualsalary + ");";

    console.log("query---" + query);
    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {

            //console.log(result[0][0].return_code);
            if (error || result[0][0].return_code == 1) {
                done(errObj);
            } else {
                done({err: false, msg: 'Updated status successfully'});
            }

        });

    });

}

/*
 * Update status of a hot list assignment
 */
HotlistAssignments.prototype.updateIsHot = function(req, done) {
    var errObj = {err: true, msg: 'Hot Status update failed'};

    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var hotListData = typeof req.body.hotListData !== 'undefined' && req.body.hotListData !== '' ? req.body.hotListData : null;

    if (hotListData.ishot === "true")
        hotListData.ishot = 1;
    else
        hotListData.ishot = 0;

    var query = "call hotlistassignmentjob_updateishot (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + hotListData.HotListJob_id + ", " + hotListData.ishot + ");";
    console.log("query---" + query);

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {

            if (result[0][0].return_code == 1) {
                done(errObj);
            } else {
                done({err: false, msg: 'Hot Status update successfully'});
            }

        });

    });

}

/*
 * Update status of a hot list assignment
 */
HotlistAssignments.prototype.updateKeywords = function(req, done) {
    var errObj = {err: true, msg: 'Keywords update failed'};

    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var keywordDate = typeof req.body.keywordDate !== 'undefined' && req.body.keywordDate !== '' ? req.body.keywordDate : null;
    keywordDate.keywords = this.addQuotes(keywordDate.keywords);

    var query = "call hotlistassignment_updatekeywords (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + keywordDate.sid + ", " + keywordDate.keywords + ");";
    console.log("query---" + query);

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {

            if (result[0][0].return_code == 1) {
                done(errObj);
            } else {
                done({err: false, msg: 'Keywords update successfully'});
            }

        });

    });
}

HotlistAssignments.prototype.query = function(req, query, done) {

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {
            //console.log(error);
            //console.log(result);
            //console.log(result[0][0].return_code);
            if (error || result[0][0].return_code === 1) {
                done(null);
            } else {
                //console.log(result[1]);
                done(result[1]);
            }

        });

    });
};

HotlistAssignments.prototype.addQuotes = function(string) {
    return "'" + string + "'";
};

module.exports = new HotlistAssignments();
