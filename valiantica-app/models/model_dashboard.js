'use strict';

var moment = require('moment');
function Dashboard() {
   
}

/*
 * Return list of person object when sid is provided
 */
Dashboard.prototype.getCMStatus = function(req, done) {
    
    //console.log(req.body);
    
    var startdate = req.body.startdate !== 'undefined' ? req.body.startdate : null;
    var enddate = req.body.enddate !== 'undefined' ? req.body.enddate : null;
    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    var querystr = "call report_cm_transactiontypebydate_cm (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + caller_sid + ", '" + startdate + "', '" + enddate + "');";
    console.log("query---" + querystr);

    this.query(req, querystr, done);

};

Dashboard.prototype.getCMActivity = function(req, done) {
    
    //console.log(req.body);
    
    var startdate = req.body.startdate !== 'undefined' ? req.body.startdate : null;
    var enddate = req.body.enddate !== 'undefined' ? req.body.enddate : null;
    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    var querystr = "call report_cm_persontransactioncount (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", '" + startdate + "', '" + enddate + "');";
    
    console.log("query---" + querystr);

    this.query(req, querystr, done);

};

Dashboard.prototype.query = function(req, query, done) {

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

module.exports = new Dashboard();
