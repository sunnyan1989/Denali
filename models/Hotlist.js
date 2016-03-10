'use strict';

function Hotlist() {
}

/*
 * Returns Hot List Status records
 */
Hotlist.prototype.getStatusData = function(req, done) {
   
    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var query = "call hotliststatus_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", null);";
    console.log("query---" + query);
    this.query(req, query, done);
    
};

/*
 * Returns Hot List Job Status records
 */
Hotlist.prototype.getJobStatusData = function(req, done) {
    
    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var query = "call hotlistjobstatus_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", null);";
    console.log("query---" + query);
    this.query(req, query, done);
};

/*
 * Returns last hotlist record for a tenant
 */
Hotlist.prototype.getLast = function(req, done) {
    
    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var query = "call hotlist_getlast (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ");";
    console.log("query---" + query);
    this.query(req, query, done);
};

Hotlist.prototype.query = function(req, query, done) {

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connection error'});
            return;
        }

        connection.query(query, function(error, result, fields) {

            //console.log(result[0][0].return_code);
            if (error || result[0][0].return_code == 1) {
                done([]);
            } else {
                //console.log(result[1]);
                done(result[1]);
            }

        });

    });
};

module.exports = new Hotlist();
