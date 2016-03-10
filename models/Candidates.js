'use strict';
var moment = require('moment');

function Candidate() {}

/*
 * Return list of person object when sid is provided
 */
Candidate.prototype.getCandidateList = function(req, done) {

    //console.log(req);
    var statusSid = req.body.statusSid !== null ? parseInt(req.body.statusSid) : null;
    var name = req.body.name !== '' ? this.addQuotes(req.body.name) : null;
    var state = req.body.state !== '' ? this.addQuotes(req.body.state) : null;
    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var query = "call candidate_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + statusSid + ", " + name + ", " + state + ");";
    console.log("query---" + query);
    this.query(req, query, done);

};

Candidate.prototype.dupHotList = function(req, done) {

    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;

    var query = "call hotlist_duplicate (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", null);";
    console.log("query---" + query);

    this.query(req, query, done);

};

Candidate.prototype.getEmailTemplateFromService = function(req, datalist, done) {
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
 * Return list of hot list object when sid is provided
 */
Candidate.prototype.getHotList = function(req, done) {
    //console.log("statusSid-- " + statusSid + " --name--" + name + " --state--" + state);

    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }
        var query = "call hotlist_getlast (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ");";
        console.log("query---" + query);
        connection.query(query, function(error, result, fields) {

            //console.log(result);
            if (error || result[0][0].return_code == 1) {
                done(null);
            } else {
                if (typeof result[1][0] === "undefined") {
                    var query = "call hotlist_duplicate (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", null);";
                    console.log("query---" + query);

                    connection.query(query, function(err, duplicate, fields) {
                        //console.log(duplicate);
                        if (err || duplicate[0][0].return_code == 1) {
                            done({"msg": "database connect error"});
                        } else {
                            if (Object.keys(duplicate[1]).length > 0) {
                                //if (typeof result1[1][0].sid !=="undefined") {
                                //console.log(duplicate[1]);
                                done(duplicate[1]);
                            } else {
                                //console.log(duplicate[2]);
                                done(duplicate[2]);
                            }

                        }
                    });
                } else {
                    var query = "call hotlistitem_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + result[1][0].sid + ", true);";
                    console.log("query---" + query);
                    connection.query(query, function(err, getlist, fields) {
                        //console.log(result1);
                        if (err || getlist[0] == 1) {
                            done({"msg": "database connect error"});
                        } else {
                            //console.log(getlist);
                            if (Object.keys(getlist[1]).length > 0) {
                                //if (typeof result1[1][0].sid !=="undefined") {
                                //console.log(getlist[1]);
                                done(getlist[1]);
                            } else {
                                //console.log(getlist[2]);
                                done(getlist[2]);
                            }
                        }
                    });
                }
            }

        });

    });

};

/*
 * Get Job Type List,
 * Return result list.
 */
Candidate.prototype.getJobType = function(req, done) {

    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    var query = "call jobtype_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", 1);";
    console.log("query---" + query);
    this.query(req, query, done);

};

/*
 * Get Legal Status Type,
 * Return result list.
 */
Candidate.prototype.getLegalStatusType = function(req, done) {

    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    var query = "call legalstatustype_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", 1);";
    console.log("query---" + query);
    this.query(req, query, done);

};

/*
 * Get Major Type,
 * Return result list.
 */
Candidate.prototype.getMajorType = function(req, done) {
    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    var query = "call majortype_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", 1);";
    console.log("query---" + query);
    this.query(req, query, done);

};

/*
 * Get Major Type,
 * Return result list.
 */
Candidate.prototype.getDegreeType = function(req, done) {
    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    var query = "call degreetype_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", 1);";
    console.log("query---" + query);
    this.query(req, query, done);

};

Candidate.prototype.getEmploymentType = function(req, done) {
    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var query = "call employmenttype_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", 1);";
    console.log("query---" + query);
    this.query(req, query, done);
};

/*
 * Get Major Type,
 * Return result list.
 */

Candidate.prototype.getPersonInfo = function(req, done) {
    var sid = typeof req.body.sid !== 'undefined' ? req.body.sid : null;
    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var query = "call candidate_get (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + sid + ");";
    console.log("query---" + query);
    this.query(req, query, done);

};

Candidate.prototype.getContactList = function(req, done) {

    //console.log(req.body.sid);
    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    var sid = typeof req.body.sid !== 'undefined' ? req.body.sid : null;
    var isprimary = typeof req.body.isprimary !== 'undefined' ? req.body.isprimary : null;


    var query = "call personcontact_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + +sid + ", 1, " + isprimary + ");";
    console.log("query---" + query);
    this.query(req, query, done);

};

Candidate.prototype.getEducationList = function(req, done) {

    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    var sid = typeof req.body.sid !== 'undefined' ? req.body.sid : null;
    var isprimary = typeof req.body.isprimary !== 'undefined' ? req.body.isprimary : null;

    var query = "call personeducation_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + sid + ", 1, " + isprimary + ");";
    console.log("query---" + query);
    this.query(req, query, done);

};

Candidate.prototype.getLegalStatusList = function(req, done) {

    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    var sid = typeof req.body.sid !== 'undefined' ? req.body.sid : null;
    var isprimary = typeof req.body.isprimary !== 'undefined' ? req.body.isprimary : null;

    var query = "call personlegalstatus_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + sid + ", 1, " + isprimary + ");";
    console.log("query---" + query);
    this.query(req, query, done);

};

Candidate.prototype.getEmploymentList = function(req, done) {

    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    var sid = typeof req.body.sid !== 'undefined' ? req.body.sid : null;
    var isprimary = typeof req.body.isprimary !== 'undefined' ? req.body.isprimary : null;

    var query = "call personemployment_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + sid + ", 1, " + isprimary + ");";
    console.log("query---" + query);
    this.query(req, query, done);

};

Candidate.prototype.getSkillsList = function(req, done) {

    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var sid = typeof req.body.sid !== 'undefined' ? req.body.sid : null;
    var isprimary = typeof req.body.isprimary !== 'undefined' ? req.body.isprimary : null;

    var query = "call personskill_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + sid + ", 1, " + isprimary + ");";
    console.log("query---" + query);
    this.query(req, query, done);
};

Candidate.prototype.getCMList = function(req, done) {

    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    var query = "call hotlist_getcmlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ");";
    console.log("query---" + query);
    this.query(req, query, done);
};

Candidate.prototype.getAssignList = function(req, done) {

    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var HotListItem_sid = typeof req.body.HotListItem_sid !== 'undefined' ? req.body.HotListItem_sid : null;

    var query = "call hotlistassignment_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + HotListItem_sid + ");";
    console.log("query---" + query);
    this.query(req, query, done);
};

Candidate.prototype.getSingleHotItem = function(req, done) {

    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var HotListItem_sid = typeof req.body.HotListItem_sid !== 'undefined' ? req.body.HotListItem_sid : null;

    var query = "call hotlistitem_get (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + HotListItem_sid + ", false);";
    console.log("query---" + query);
    this.query(req, query, done);

};

Candidate.prototype.getSingleAssignment = function(req, done) {

    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    /*var HotListAssignment_id = typeof req.body.HotListAssignment_id !== 'undefined' ? req.body.HotListAssignment_id : null;
     console.log("HotListAssignment_id--" + HotListAssignment_id);*/
    var HotListItem_sid = typeof req.body.HotListItem_sid !== 'undefined' ? req.body.HotListItem_sid : null;
    //console.log("HotListItem_sid--" + HotListItem_sid);

    var query = "call hotlistassignment_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + HotListItem_sid + ");";
    console.log("query---" + query);
    this.query(req, query, done);
};


/*
 * Add a new tenant,
 * Return sid on success, error object on failure.
 */
Candidate.prototype.addNew = function(req, done) {
    //console.log("req1--" + req.body.name);
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var name = typeof req.body.name !== 'undefined' && req.body.name !== '' ? this.addQuotes(req.body.name) : null;
    var tenant_sid = req.session.user.tenant_sid;
    var sex = typeof req.body.sex !== 'undefined' && req.body.sex !== null ? this.addQuotes(req.body.sex) : this.addQuotes('F');
    var maritalstatus = typeof req.body.maritalstatus !== 'undefined' && req.body.maritalstatus !== null ? this.addQuotes(req.body.maritalstatus) : this.addQuotes('Y');
    var birthday = typeof req.body.birthday !== 'undefined' ? req.body.birthday : null;
    var birthplace = typeof req.body.birthplace !== 'undefined' && req.body.birthplace !== null ? this.addQuotes(req.body.birthplace) : null;
    var action = typeof req.body.action !== 'undefined' ? req.body.action : "New";
    var sid = typeof req.body.sid !== 'undefined' ? req.body.sid : null;
    var picturelink = typeof req.body.picturelink !== 'undefined' && req.body.picturelink !== null ? this.addQuotes(req.body.picturelink) : null;
    var linkedin = typeof req.body.linkedin !== 'undefined' && req.body.linkedin !== null ? this.addQuotes(req.body.linkedin) : null;
    //console.log("req.body.picturelink---" + req.body.picturelink);
    if (birthday !== null)
        birthday = this.addQuotes(moment(birthday).format('YYYY-MM-DD'));

    if (action === "Update") {
        var query = "call candidate_update (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + sid + ", " + name + ", " + sex + ", null, null, " + maritalstatus + ", " + birthday + ", " + birthplace + ", " + picturelink + ", " + linkedin + ");";
    } else {
        var query = "call candidate_insert (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + name + ", " + sex + ", null, null, " + maritalstatus + ", " + birthday + ", " + birthplace + ", " + picturelink + ", " + linkedin + ");";
    }
    console.log("query---" + query);

    this.query(req, query, done);

};

Candidate.prototype.newContact = function(req, done) {

    //console.log("req.params---" + req.params);
    //console.log(req.body.email_work);
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var person_sid = typeof req.body.person_sid !== 'undefined' ? req.body.person_sid : null;
    //console.log("person_sid--"+person_sid);
    var address = typeof req.body.address !== 'undefined' && req.body.address !== null ? this.addQuotes(req.body.address) : null;
    var phone_home = typeof req.body.phone_home !== 'undefined' && req.body.phone_home !== null ? this.addQuotes(req.body.phone_home) : null;
    var phone_work = typeof req.body.phone_work !== 'undefined' && req.body.phone_work !== null ? this.addQuotes(req.body.phone_work) : null;
    var phone_cell = typeof req.body.phone_cell !== 'undefined' && req.body.phone_cell !== null ? this.addQuotes(req.body.phone_cell) : null;
    var phone_emergency = typeof req.body.phone_emergency !== 'undefined' && req.body.phone_emergency !== null ? this.addQuotes(req.body.phone_emergency) : null;
    var email_personal = typeof req.body.email_personal !== 'undefined' && req.body.email_personal !== null ? this.addQuotes(req.body.email_personal) : null;
    var email_work = typeof req.body.email_work !== 'undefined' && req.body.email_work !== "" ? this.addQuotes(req.body.email_work) : null;
    var email_emergency = typeof req.body.email_emergency !== 'undefined' && req.body.email_emergency !== "" ? this.addQuotes(req.body.email_emergency) : null;
    var zipcode = typeof req.body.zipcode !== 'undefined' && req.body.zipcode !== null ? this.addQuotes(req.body.zipcode) : null;
    var state = typeof req.body.state !== 'undefined' && req.body.state !== null ? this.addQuotes(req.body.state) : null;
    var country = typeof req.body.country !== 'undefined' && req.body.country !== null ? this.addQuotes(req.body.country) : null;
    var isprimary = typeof req.body.isprimary !== 'undefined' ? req.body.isprimary : false;
    var page = "hotlist";

    var action = typeof req.body.action !== 'undefined' ? req.body.action : "New";
    var sid = typeof req.body.sid !== 'undefined' ? req.body.sid : null;

    if (action === "Update") {
        var query = "call personcontact_update (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + sid + ", " + address + ", " + phone_home + ", " + phone_work + ", " + phone_cell + ", " + phone_emergency + ", " + email_personal + ", " + email_work + ", " + email_emergency + ", " + zipcode + ", " + state + ", " + country + ", " + isprimary + ", '" + page + "');";
    } else {
        var query = "call personcontact_insert (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + person_sid + ", " + address + ", " + phone_home + ", " + phone_work + ", " + phone_cell + ", " + phone_emergency + ", " + email_personal + ", " + email_work + ", " + email_emergency + ", " + zipcode + ", " + state + ", " + country + ", " + isprimary + ", '" + page + "');";
    }
    console.log("query---" + query);

    this.query(req, query, done);
};

Candidate.prototype.newEducation = function(req, done) {
    //console.log("req1--" + req.body.name);
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var person_sid = typeof req.body.person_sid !== 'undefined' && req.body.person_sid !== null ? req.body.person_sid : null;
    var graduationdate = typeof req.body.graduationdate !== 'undefined' && req.body.graduationdate !== null ? req.body.graduationdate : null;
    var graduationinstitute = typeof req.body.graduationinstitute !== 'undefined' && req.body.graduationinstitute !== null ? this.addQuotes(req.body.graduationinstitute) : null;
    var graduationcountry = typeof req.body.graduationcountry !== 'undefined' && req.body.graduationcountry !== null ? this.addQuotes(req.body.graduationcountry) : null;
    var isprimary = typeof req.body.isprimary !== 'undefined' && req.body.isprimary !== null ? req.body.isprimary : false;
    var MajorType_sid = typeof req.body.MajorType_sid !== 'undefined' && req.body.MajorType_sid !== null ? req.body.MajorType_sid : 1;
    var DegreeType_sid = typeof req.body.DegreeType_sid !== 'undefined' && req.body.DegreeType_sid !== null ? req.body.DegreeType_sid : 1;
    var page = "hotlist";
    var action = typeof req.body.action !== 'undefined' ? req.body.action : "New";
    var sid = typeof req.body.sid !== 'undefined' ? req.body.sid : null;

    if (graduationdate !== null)
        graduationdate = this.addQuotes(moment(graduationdate).format('YYYY-MM-DD'));

    if (action === "Update") {
        var query = "call personeducation_update (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + sid + ", " + graduationdate + ", " + graduationinstitute + ", " + graduationcountry + ", " + isprimary + ", " + MajorType_sid + ", " + DegreeType_sid + ", '" + page + "');";
    } else {
        var query = "call personeducation_insert (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + person_sid + ", " + graduationdate + ", " + graduationinstitute + ", " + graduationcountry + ", " + isprimary + ", " + MajorType_sid + ", " + DegreeType_sid + ", '" + page + "');";
    }
    console.log("query---" + query);

    this.query(req, query, done);
};

Candidate.prototype.newLegalStatus = function(req, done) {
    //console.log("req1--" + req.body.name);
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var person_sid = typeof req.body.person_sid !== 'undefined' ? req.body.person_sid : null;
    var startdate = typeof req.body.startdate !== 'undefined' && req.body.startdate !== null ? req.body.startdate : null;
    var enddate = typeof req.body.enddate !== 'undefined' && req.body.enddate !== null ? req.body.enddate : null;
    var country = typeof req.body.country !== 'undefined' && req.body.country !== null ? this.addQuotes(req.body.country) : null;
    var ID = typeof req.body.ID !== 'undefined' && req.body.ID !== null ? this.addQuotes(req.body.ID) : null;
    var sponsorbusiness = typeof req.body.sponsorbusiness !== 'undefined' && req.body.sponsorbusiness !== null ? this.addQuotes(req.body.sponsorbusiness) : null;
    var LegalStatusType_sid = typeof req.body.LegalStatusType_sid !== 'undefined' && req.body.LegalStatusType_sid !== null ? req.body.LegalStatusType_sid : 1;
    var page = "hotlist";
    var isprimary = typeof req.body.isprimary !== 'undefined' ? req.body.isprimary : false;
    var action = typeof req.body.action !== 'undefined' ? req.body.action : "New";
    var sid = typeof req.body.sid !== 'undefined' ? req.body.sid : null;

    //console.log("startdate---" + startdate);
    if (startdate !== null)
        startdate = this.addQuotes(moment(startdate).format('YYYY-MM-DD'));

    if (enddate !== null)
        enddate = this.addQuotes(moment(enddate).format('YYYY-MM-DD'));

    if (action === "Update") {
        var query = "call personlegalstatus_update (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + sid + ", " + startdate + ", " + enddate + ", " + country + ", " + ID + ", " + sponsorbusiness + ", " + isprimary + ", " + LegalStatusType_sid + ", '" + page + "');";
    } else {
        var query = "call personlegalstatus_insert (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + person_sid + ", " + startdate + ", " + enddate + ", " + country + ", " + ID + ", " + sponsorbusiness + ", " + isprimary + ", " + LegalStatusType_sid + ", '" + page + "');";
    }
    console.log("query---" + query);

    this.query(req, query, done);
};

Candidate.prototype.newEmployment = function(req, done) {
    //console.log("req1--" + req.body.name);
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var person_sid = typeof req.body.person_sid !== 'undefined' ? req.body.person_sid : null;
    var name = typeof req.body.name !== 'undefined' && req.body.name !== null ? this.addQuotes(req.body.name) : null;
    var title = typeof req.body.title !== 'undefined' && req.body.title !== null ? this.addQuotes(req.body.title) : null;
    var startdate = typeof req.body.startdate !== 'undefined' && req.body.startdate !== null ? req.body.startdate : null;
    var enddate = typeof req.body.enddate !== 'undefined' && req.body.enddate !== null ? req.body.enddate : null;
    var isprimary = typeof req.body.isprimary !== 'undefined' ? req.body.isprimary : false;
    var JobType_sid = typeof req.body.JobType_sid !== 'undefined' ? req.body.JobType_sid : 1;
    var page = "hotlist";
    var action = typeof req.body.action !== 'undefined' ? req.body.action : "New";
    var sid = typeof req.body.sid !== 'undefined' ? req.body.sid : null;

    if (startdate !== null)
        startdate = this.addQuotes(moment(startdate).format('YYYY-MM-DD'));
    if (enddate !== null)
        enddate = this.addQuotes(moment(enddate).format('YYYY-MM-DD'));

    if (action === "Update") {
        var query = "call personemployment_update (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + sid + ", " + name + ", " + title + ", " + startdate + ", " + enddate + ", " + isprimary + ", " + JobType_sid + ", '" + page + "');";
    } else {
        var query = "call personemployment_insert (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + person_sid + ", " + name + ", " + title + ", " + startdate + ", " + enddate + ", " + isprimary + ", " + JobType_sid + ", '" + page + "');";
    }
    console.log("query---" + query);

    this.query(req, query, done);
};


Candidate.prototype.newSkills = function(req, done) {
    //console.log("req1--" + req.body.name);
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var person_sid = typeof req.body.person_sid !== 'undefined' ? req.body.person_sid : null;
    var name = typeof req.body.name !== 'undefined' && req.body.name !== null ? this.addQuotes(req.body.name) : null;
    var description = typeof req.body.description !== 'undefined' && req.body.description !== null ? this.addQuotes(req.body.description) : null;
    var resumelink = typeof req.body.resumelink !== 'undefined' && req.body.resumelink !== null ? this.addQuotes(req.body.resumelink) : null;
    var keywords = typeof req.body.keywords !== 'undefined' && req.body.keywords !== null ? this.addQuotes(req.body.keywords) : null;
    var isprimary = typeof req.body.isprimary !== 'undefined' && req.body.isprimary !== null ? req.body.isprimary : false;
    var JobType_sid = typeof req.body.JobType_sid !== 'undefined' && req.body.JobType_sid !== null ? req.body.JobType_sid : 1;
    var locationzip = typeof req.body.locationzip !== 'undefined' && req.body.locationzip !== null ? this.addQuotes(req.body.locationzip) : null;
    var EmploymentType_sid = typeof req.body.EmploymentType_sid !== 'undefined' ? req.body.EmploymentType_sid : 1;
    var hourlyrate_desired = typeof req.body.hourlyrate_desired !== 'undefined' && req.body.hourlyrate_desired !== null ? this.addQuotes(req.body.hourlyrate_desired) : null;
    var annualsalary_desired = typeof req.body.annualsalary_desired !== 'undefined' && req.body.annualsalary_desired !== null ? this.addQuotes(req.body.annualsalary_desired) : null;
    var page = "hotlist";
    var action = typeof req.body.action !== 'undefined' ? req.body.action : "New";
    var sid = typeof req.body.sid !== 'undefined' ? req.body.sid : null;

    if (action === "Update") {
        var query = "call personskill_update (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + sid + ", " + name + ", " + description + ", " + resumelink + ", " + keywords + ", " + isprimary + ", " + JobType_sid + ", " + locationzip + ", " + EmploymentType_sid + ", " + hourlyrate_desired + ", " + annualsalary_desired + ", '" + page + "');";
    } else {
        var query = "call personskill_insert (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + person_sid + ", " + name + ", " + description + ", " + resumelink + ", " + keywords + ", " + isprimary + ", " + JobType_sid + ", " + locationzip + ", " + EmploymentType_sid + ", " + hourlyrate_desired + ", " + annualsalary_desired + ", '" + page + "');";
    }

    console.log("query---" + query);

    this.query(req, query, done);
};

Candidate.prototype.addHostListItem = function(req, done) {
    console.log("req.body.ids--" + req.body.ids);
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var HotList_sid = typeof req.body.HotList_sid !== 'undefined' ? req.body.HotList_sid : null;
    var Person_Skill_sid = typeof req.body.ids[0] !== 'undefined' ? req.body.ids[0] : null;

    //if (action === "Update") {
    var query = "call hotlistitem_insert (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + HotList_sid + ", " + Person_Skill_sid + ");";

    console.log("query---" + query);

    this.query(req, query, done);
};


Candidate.prototype.addAssignment = function(req, done) {

    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var HotList_sid = typeof req.body.HotList_sid !== 'undefined' ? req.body.HotList_sid : null;
    var HotListItem_sid = typeof req.body.HotListItem_sid !== 'undefined' ? req.body.HotListItem_sid : null;

    //console.log(Person_sid);

    var Person_sid = typeof req.body.Person_sid !== 'undefined' ? req.body.Person_sid : null;
    //if (action === "Update") {

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        for (var i = 0; i < Person_sid.length; i++) {
            var query = "call hotlistassignment_insert (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + HotList_sid + ", " + HotListItem_sid + ", " + Person_sid[i] + ");";
            
            console.log("query---" + query);
            
            connection.query(query, function(error, result, fields) {
                //console.log(result);
                if (error || result[0][0].return_code == 1) {
                    //console.log(error);
                    done([]);
                } else {
                    //console.log(result[1]);
                    //done(result[1]);
                    done({HotListItem_sid: HotListItem_sid});
                }
            });
        }
    });
};

Candidate.prototype.updateItemStatus = function(req, done) {

    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var HotList_sid = typeof req.body.HotList_sid !== 'undefined' ? req.body.HotList_sid : null;
    var HotListAssignment_sid = typeof req.body.HotListAssignment_sid !== 'undefined' ? req.body.HotListAssignment_sid : null;
    var newHotListStatus_sid = typeof req.body.newHotListStatus_sid !== 'undefined' ? req.body.newHotListStatus_sid : null;
    //if (action === "Update") {
    var query = "call hotlistassignment_updatestatus (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + HotList_sid + ", " + HotListAssignment_sid + ", " + newHotListStatus_sid + ", null);";

    console.log("query---" + query);

    this.query(req, query, done);

};

Candidate.prototype.updateHotListStatus = function(req, done) {

    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var HotList_sid = typeof req.body.HotList_sid !== 'undefined' ? req.body.HotList_sid : null;
    var HotListItem_sid = typeof req.body.HotListItem_sid !== 'undefined' ? req.body.HotListItem_sid : null;
    var newHotListStatus_sid = typeof req.body.newHotListStatus_sid !== 'undefined' ? req.body.newHotListStatus_sid : null;
    //if (action === "Update") {
    var query = "call hotlistitem_updatestatus (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + HotList_sid + ", " + HotListItem_sid + ", " + newHotListStatus_sid + ");";

    console.log("query---" + query);

    this.query(req, query, done);
};

Candidate.prototype.query = function(req, query, done) {

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {
            //console.log(error);
            if (error || result[0][0].return_code == 1) {
                done([]);
            } else {
                //console.log(result[1]);
                done(result[1]);
            }

        });

    });
};

Candidate.prototype.addQuotes = function(string) {
    return "'" + string + "'";
};

module.exports = new Candidate();