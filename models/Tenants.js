'use strict';

var crypto = require('crypto');
var moment = require('moment');

function Tenants() {

}

/*
 * Return list of tenants or tenant object when sid is provided
 */

Tenants.prototype.get = function(req, done) {
    var statusSid = req.body.statusSid !== '' ? parseInt(req.body.statusSid) : null;
    var name = req.body.name !== '' ? "'" + req.body.name + "'" : null;
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    var query = "call tenant_getlist (" + caller_sid + ", '" + caller_ip + "', " + statusSid + ", " + name + ");";
    console.log("query---" + query);

    this.query(req, query, done);
};
/*
 * Return tenant profile
 */
Tenants.prototype.getProfile = function(req, done) {
    
    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    var query = "call tenant_get (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ");";
    console.log("query---" + query);
    
    this.query(req, query, done);

};

/*
 * Add a new tenant,
 * Return sid on success, error object on failure.
 */
Tenants.prototype.add = function(req, done) {

    console.log(req);
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var userid = typeof req.body.email !== 'undefined' && req.body.email != '' ? this.addQuotes(req.body.email) : null;
    var name = typeof req.body.name !== 'undefined' && req.body.name != '' ? this.addQuotes(req.body.name) : null;
    var username = typeof req.body.username !== 'undefined' && req.body.username != '' ? this.addQuotes(req.body.username) : null;
    var password = typeof req.body.password !== 'undefined' && req.body.password != '' ? req.body.password : null;

    password = crypto.createHash('md5').update(password).digest('hex');

    var query = "call tenant_signup ('" + caller_ip + "', " + name + ", " + username + ", " + userid + ", " + this.addQuotes(password) + ");";
    console.log("query---" + query);

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {

            //console.log(result);
            if (error || result[0][0].return_code == 1) {
                done({err: true, msg: 'Failed to add Tenant: ' + name});
            } else if (error || result[0][0].return_code == 1) {
                done({err: true, msg: 'Failed to add Tenant: ' + name});
            } else if (error || result[0][0].return_code == 2) {
                done({err: true, msg: 'Tenant ' + name + ' or user ID ' + userid + ' already exists'});
            } else {
                //console.log(result[1]);
                done({err: false, sid: result[1].tenant_sid});
            }

        });

    });

};

/*
 * Check if tenant already exists
 */
/*Tenants.prototype.exists = function(name, sid, done) {
 knex.select('sid').from('Tenant').where('name', name).where('sid', '!=', sid).then(function(rows) {
 if (rows.length)
 done(true);
 else
 done(false);
 }).catch(function(err) {
 console.error(err);
 done(false);
 });
 };*/

/*
 * Update tenant information
 */
Tenants.prototype.update = function(req, done) {
    //console.log(tenant);

    /*tenant.startdate = (tenant.startdate != null) ? moment(tenant.startdate).format('YYYY-MM-DD') : null;
     tenant.enddate = (tenant.enddate != null) ? moment(tenant.enddate).format('YYYY-MM-DD') : null;
     var sid = parseInt(tenant.sid);
     delete tenant.sid;
     tenant.statusid = parseInt(tenant.statusid);
     tenant.lastupdatedat = moment().format();
     // check if tenant name already exists
     this.exists(tenant.name, sid, function(result) {
     if (result) {
     done({err: true, msg: 'Tenant ' + tenant.name + ' already exists'});
     return;
     }
     
     knex('Tenant').update(tenant).where('sid', sid)
     .then(function() {
     done({err: false, msg: 'Updated Tenant: ' + tenant.name + ' successfully'});
     }).catch(function() {
     console.error(err);
     done({err: true, msg: 'Failed to update Tenant: ' + tenant.name});
     });
     });*/
    var tenant = typeof req.body.tenant !== 'undefined' && req.body.tenant !== '' ? req.body.tenant : null;
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = parseInt(tenant.sid);
    tenant.startdate = (tenant.startdate != null) ? this.addQuotes(moment(tenant.startdate).format('YYYY-MM-DD')) : null;
    tenant.enddate = (tenant.enddate != null) ? this.addQuotes(moment(tenant.enddate).format('YYYY-MM-DD')) : null;
    tenant.statusid = parseInt(tenant.statusid);
    tenant.logolink = typeof tenant.logolink !== 'undefined' && tenant.logolink !== '' ? this.addQuotes(tenant.logolink) : null;
    tenant.description = typeof tenant.description !== 'undefined' && tenant.description !== '' ? this.addQuotes(tenant.description) : null;
    tenant.name = typeof tenant.name !== 'undefined' && tenant.name !== '' ? this.addQuotes(tenant.name) : null;

    var query = "call tenant_update (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + tenant.statusid
            + ", " + tenant.name + ", " + tenant.description + ", " + tenant.adminuser_sid + ", " + tenant.startdate
            + ", " + tenant.enddate + ", " + tenant.logolink + ", " + tenant.maxusers + ");";
    console.log("query---" + query);
    /*pool.query(query, function(err, result, fields) {
     
     console.log(result);
     //console.log("result[0][0].return_code--" + result[0][0].return_code);
     //console.log("result[1][0].return_sid--" + result[1][0].return_sid);
     
     if (err || result[0][0].return_code == 1) {
     //
     done({err: true, msg: 'Failed to update Tenant: ' + tenant.name});
     }else if (result[0][0].return_code == 2) {
     done({err: true, msg: 'Company name already exists, Please enter another one.'});
     } else {
     done({err: false, msg: 'Updated company: ' + tenant.name + ' successfully'});
     }
     
     });*/

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {

            //console.log(result);
            if (error || result[0][0].return_code == 1) {
                done({err: true, msg: 'Failed to update Tenant: ' + tenant.name});
            } else if (result[0][0].return_code == 2) {
                done({err: true, msg: 'Company name already exists, Please enter another one.'});
            } else {
                done({err: false, msg: 'Updated company: ' + tenant.name + ' successfully'});
            }

        });

    });

};

/*
 * Update tenant profile information
 */
Tenants.prototype.updateProfile = function(req, done) {
    /*var sid = parseInt(tenant.sid);
     delete tenant.sid;
     tenant.lastupdatedat = moment().format();
     // check if tenant name already exists
     this.exists(tenant.name, sid, function(result) {
     if (result) {
     done({err: true, msg: 'Tenant ' + tenant.name + ' already exists'});
     return;
     }
     
     knex('Tenant').update(tenant).where('sid', sid)
     .then(function() {
     done({err: false, msg: 'Updated Tenant: ' + tenant.name + ' successfully'});
     }).catch(function() {
     console.error(err);
     done({err: true, msg: 'Failed to update Tenant: ' + tenant.name});
     });
     });*/

    var tenant = typeof req.body.tenant !== 'undefined' && req.body.tenant !== '' ? req.body.tenant : null;
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    tenant.startdate = null;
    tenant.enddate = null;
    tenant.statusid = null;
    tenant.logolink = typeof tenant.logolink !== 'undefined' && tenant.logolink !== '' ? this.addQuotes(tenant.logolink) : null;
    tenant.description = typeof tenant.description !== 'undefined' && tenant.description !== '' ? this.addQuotes(tenant.description) : null;
    tenant.name1 = typeof tenant.name !== 'undefined' && tenant.name !== '' ? this.addQuotes(tenant.name) : null;
    tenant.maxusers = null;
    tenant.adminuser_sid = null;

    var query = "call tenant_update (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + tenant.statusid
            + ", " + tenant.name1 + ", " + tenant.description + ", " + tenant.adminuser_sid + ", " + tenant.startdate
            + ", " + tenant.enddate + ", " + tenant.logolink + ", " + tenant.maxusers + ");";
    console.log("query---" + query);

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {

            if (error || result[0][0].return_code == 1) {
                console.log(error);
                done({err: true, msg: 'Failed to update Tenant: ' + tenant.name});
            } else if (result[0][0].return_code == 2) {
                done({err: true, msg: 'Company name already exists, Please enter another one.'});
            } else {
                done({err: false, msg: 'Updated Tenant: ' + tenant.name + ' successfully'});
            }

        });

    });

};

Tenants.prototype.query = function(req, query, done) {

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
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

Tenants.prototype.addQuotes = function(string) {
    return "'" + string + "'";
};

module.exports = new Tenants();
