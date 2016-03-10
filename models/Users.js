'use strict';

var crypto = require('crypto');
var moment = require('moment');

function Users() {

}

/*
 * Return user profile
 */
Users.prototype.signout = function(req, done) {



    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    var query = "call logout (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ");";
    console.log("query---" + query);

    this.query(req, query, done);


};

/*
 * Return user profile
 */
Users.prototype.signin = function(req, done) {

    var userid = req.body.email;
    var password = req.body.password;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

    var password = crypto.createHash('md5').update(password).digest('hex');

    var query = "call login ('" + caller_ip + "', '" + userid + "', '" + password + "');";
    console.log("query---" + query);

    req.getConnection(function(err, connection) {

        //var query = "call person_get (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + caller_sid + ");";

        if (err) {
            done({err: true, msg: 'database connect error'});
            //return;
        } else {
            connection.query(query, function(error, result, fields) {

                if (error || result[0][0].return_code == 1) {
                    //console.log(error);
                    done(null);
                } else {
                    //console.log(result[1]);
                    //console.log(result[2]);

                    var user = {
                        sid: result[1][0].sid,
                        picturelink: result[1][0].picturelink,
                        userid: result[1][0].userid,
                        name: result[1][0].name,
                        tenant_sid: result[1][0].tenant_sid,
                        tenant_name: result[1][0].tenant,
                        isuser: result[1][0].isuser,
                        istenantadmin: result[1][0].istenantadmin,
                        isglobaladmin: result[1][0].isglobaladmin,
                        isforcm: result[1][0].isforcm,
                        isforeq: result[1][0].isforeq,
                        logolink: result[1][0].tenantlogolink,
                        roles: []
                    };

                    for (var i = 0; i < result[2].length; i++) {
                        //user.roles = result[2][i].name.toString() + ",";
                        user.roles.push(result[2][i].name.toString());
                    }
                    
                    //console.log(user.roles);

                    done(user);
                }

            });
        }



    });



};

Users.prototype.search = function(req, done) {
    //console.log(req);
    var statusSid = typeof req.body.statusSid !== 'undefined' ? parseInt(req.body.statusSid) : 0;
    var name = req.body.name !== '' ? "'" + req.body.name + "'" : null;
    var userId = typeof req.body.userId !== 'undefined' && req.body.userId != '' ? "'" + req.body.userId + "'" : null;
    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var isTenantAdmin = typeof req.body.isTenantAdmin !== 'undefined' && req.body.isTenantAdmin != '' ? parseInt(req.body.isTenantAdmin) : null;
    var isForCM = typeof req.body.isForCM !== 'undefined' && req.body.isForCM != '' ? parseInt(req.body.isForCM) : null;
    var isForIEQ = typeof req.body.isForIEQ !== 'undefined' && req.body.isForIEQ != '' ? parseInt(req.body.isForIEQ) : null;
    var isUser = typeof req.body.isUser !== 'undefined' && req.body.isUser != '' ? parseInt(req.body.isUser) : null;

    var query = "call person_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + statusSid + ", " + name + ", " + userId + ", null, " + isUser + ", " + isTenantAdmin + ", " + isForCM + ", " + isForIEQ + ");";
    console.log("query--" + query);

    this.query(req, query, done);

};

Users.prototype.getUserList = function(req, done) {

    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var statusSid = typeof req.body.statusSid !== 'undefined' ? req.body.statusSid : null;
    var name = typeof req.body.name !== 'undefined' && req.body.name !== '' ? this.addQuotes(req.body.name) : null;
    var userId = typeof req.body.userId !== 'undefined' && req.body.userId !== '' ? this.addQuotes(req.body.userId) : null;
    var isuser = typeof req.body.isuser !== 'undefined' && req.body.isuser !== '' ? req.body.isuser : null;
    var isTenantAdmin = typeof req.body.isTenantAdmin !== 'undefined' && req.body.isTenantAdmin !== '' ? req.body.isTenantAdmin : null;
    var isForCM = typeof req.body.isForCM !== 'undefined' && req.body.isForCM !== '' ? req.body.isForCM : null;
    var isForREQ = typeof req.body.isForREQ !== 'undefined' && req.body.isForREQ !== '' ? req.body.isForREQ : null;

    var query = "call person_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + statusSid + ", "
            + name + ", " + userId + ", null, " + isuser + ", " + isTenantAdmin + ", " + isForCM + ", " + isForREQ + ");";
    console.log("query---" + query);

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {

            //console.log(result);
            if (error || result[0][0].return_code == 1) {
                done([]);
            } else {
                //console.log(result[1]);
                done(result[1]);
            }

        });

    });

};

/*
 * Return user profile
 */
Users.prototype.getProfile = function(req, done) {

    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    //var sid = req.session.user.sid;

    var query = "call person_get (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + caller_sid + ");";
    console.log("query---" + query);

    //this.query(req, query, done);

    var persons = [];

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {

            if (result[0][0].return_code == 1) {
                done({err: true, msg: 'database error'});
            } else {
                persons = result[1];
                var query = "call personrole_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + caller_sid + ");";
                console.log("query---" + query);
                connection.query(query, function(error, result1, fields) {
                    if (error || result1[0][0].return_code == 1) {
                        done({err: true, msg: 'Failed to get User roles'});
                    } else {
                        //console.log(result[0][0]);
                        //console.log(result[1][0]);
                        //console.log(result1[1]);
                        var str = [];
                        for (var i = 0; i < result1[1].length; i++) {
                            str.push(result1[1][i].role);
                        }
                        var energy = str.join(",");
                        persons[0].roles = energy;

                    }
                    //console.log(persons);
                    done(persons);
                });

            }

        });

    });



};

/*
 * Get All roles 
 */
Users.prototype.getRoles = function(req, done) {


    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    //var sid = req.session.user.sid;

    var query = "call role_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", 1);";
    console.log("query---" + query);

    this.query(req, query, done);

}


/*
 * Insert new User
 * Return user sid on success, and err object on failure
 */
Users.prototype.add = function(req, done) {
    //var thisRef = this;
    var user = req.body.user;
    //console.log("user.picturelink");
    //console.log(user.picturelink);

    var caller_sid = req.session.user.sid;
    var tenant_sid = req.session.user.tenant_sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    user.startdate = (typeof user.startdate !== 'undefined' && user.startdate !== null) ? user.startdate : null;
    user.enddate = (typeof user.enddate !== 'undefined' && user.enddate !== null) ? user.enddate : null;
    user.statusid = parseInt(user.statusid);
    user.isuser = (typeof user.isuser !== 'undefined') ? parseInt(user.isuser) : 0;
    user.isforcm = (typeof user.isforcm !== 'undefined') ? parseInt(user.isforcm) : 0;
    user.isforeq = (typeof user.isforeq !== 'undefined') ? parseInt(user.isforeq) : 0;
    user.isglobaladmin = (typeof user.isglobaladmin !== 'undefined') ? parseInt(user.isglobaladmin) : 0;
    user.istenantadmin = (typeof user.istenantadmin !== 'undefined') ? parseInt(user.istenantadmin) : 0;
    user.picturelink = (typeof user.picturelink !== 'undefined' && user.picturelink !== null && user.picturelink !== "") ? this.addQuotes(user.picturelink) : this.addQuotes("/files/profiles/1/default_profile.jpg");
    user.userid = (typeof user.userid !== 'undefined' && user.userid !== "") ? "'" + user.userid + "'" : null;
    //console.log(user.picturelink);
    if (typeof user.password !== "undefined" && user.password) {
        user.password = "'" + crypto.createHash('md5').update(user.password).digest('hex') + "'";
    } else {
        user.password = null;
    }

    if (user.startdate !== null)
        user.startdate = "'" + moment(user.startdate).format('YYYY-MM-DD') + "'";

    if (user.enddate !== null)
        user.enddate = "'" + moment(user.enddate).format('YYYY-MM-DD') + "'";

    var query = "call person_insert (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", '" +
            user.name + "', null, " + user.startdate + ", " + user.enddate + ", null, null, null, " +
            user.userid + ", " + user.password + ", " + user.picturelink + ", null, null, null, " +
            user.isuser + ", " + user.istenantadmin + ", " + user.isglobaladmin + ", " + user.isforcm + ", " + user.isforeq + ", null);";

    console.log("query---" + query);

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {

            if (result[0][0].return_code == 1) {
                done({err: true, msg: 'database error'});
            } else if (result[0][0].return_code == 2) {
                done({err: true, msg: 'User ID already exists, Please enter another one.'});
            } else if (result[0][0].return_code == 3) {
                done({err: true, msg: 'Max uers reached'});
            } else {
                //done(result[1]);
                //console.log(result);
                //console.log(result[1]);
                //console.log(result[1][0]);
                for (var i = 0; i < user.roles.length; i++) {

                    var query1 = "call personrole_insert (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + result[1][0].newperson_id + ", " + user.roles[i] + ");";
                    console.log("query1---" + query1);
                    connection.query(query1, function(error, result1, fields) {
                        //console.log(error);
                        if (error || result1[0][0].return_code == 1) {
                            done({err: true, msg: 'Failed to add User: ' + user.name});
                        } else {
                            done({err: false, msg: 'Added User: ' + user.name + ' successfully'});
                        }

                    });

                }

            }

        });

    });

};

/*
 * Update User information
 */
Users.prototype.update = function(req, user, done) {

    //var thisRef = this;
    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    var person_id = parseInt(user.sid);

    console.log("eee--" + user.startdate);

    user.startdate = (typeof user.startdate != 'undefined' && user.startdate !== null) ? user.startdate : null;
    user.enddate = (typeof user.enddate != 'undefined' && user.enddate !== null) ? user.enddate : null;
    user.statusid = parseInt(user.statusid);
    user.oldstatusid = parseInt(user.oldstatusid);
    user.isuser = (typeof user.isuser != 'undefined') ? parseInt(user.isuser) : 0;
    user.isforcm = (typeof user.isforcm != 'undefined') ? parseInt(user.isforcm) : 0;
    user.isforeq = (typeof user.isforeq != 'undefined') ? parseInt(user.isforeq) : 0;
    user.isglobaladmin = (typeof user.isglobaladmin != 'undefined') ? parseInt(user.isglobaladmin) : 0;
    user.istenantadmin = (typeof user.istenantadmin != 'undefined') ? parseInt(user.istenantadmin) : 0;
    user.picturelink = (typeof user.picturelink != 'undefined' && user.picturelink !== null && user.picturelink !== "") ? this.addQuotes(user.picturelink) : null;
    user.userid = (typeof user.userid != 'undefined' && user.userid !== null) ? "'" + user.userid + "'" : null;

    if (typeof user.password !== "undefined" && user.password && user.password !== "******") {
        user.password = "'" + crypto.createHash('md5').update(user.password).digest('hex') + "'";
    } else {
        user.password = null;
    }

    if (user.startdate !== null)
        user.startdate = "'" + moment(user.startdate).format('YYYY-MM-DD') + "'";

    if (user.enddate !== null)
        user.enddate = "'" + moment(user.enddate).format('YYYY-MM-DD') + "'";

    if (user.statusid === user.oldstatusid) {
        user.statusid = null;
    }

    //console.log("user.statusid---" + user.statusid);

    var query = "call person_update (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + person_id
            + ", " + user.statusid + ", '" + user.name + "', null, " + user.startdate + ", " + user.enddate
            + ", null, null, null, " + user.userid + ", " + user.password + ", "
            + user.picturelink + ", null, null, null, " + user.isuser + ", " + user.istenantadmin + ", " + user.isglobaladmin + ", " + user.isforcm + ", " + user.isforeq + ", null);";
    console.log("query---" + query);

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {

            //console.log(result[0][0].return_code);
            if (error || result[0][0].return_code == 1) {
                console.log(error);
                done({err: true, msg: 'database error'});
            } else {
                if (result[0][0].return_code == 1) {
                    done({err: true, msg: 'database error'});
                } else if (result[0][0].return_code == 2) {
                    done({err: true, msg: 'User ID already exists, Please enter another one.'});
                } else if (result[0][0].return_code == 3) {
                    done({err: true, msg: 'Max uers reached'});
                } else {
                    //done(result[1]);
                    //done({err: false, msg: 'Updated User: ' + user.name + ' successfully'});

                    var query1 = "call personrole_getlist (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + person_id + ");";
                    console.log("query1---" + query1);
                    connection.query(query1, function(error, result1, fields) {

                        if (error || result1[0][0].return_code == 1) {
                            //console.log(error);
                            done({err: true, msg: 'Could not get user roles'});
                        } else {
                            //done({err: false, msg: 'Added User: ' + user.name + ' successfully'});

                            var rolelist = result1[1];
                            var roleArray = [];
                            var roleSidArray = [];
                            var noExitsArray = [];
                            for (var i = 0; i < rolelist.length; i++) {
                                roleArray.push(parseInt(rolelist[i].Role_sid));
                                roleSidArray.push(parseInt(rolelist[i].sid));
                                //for (var j = 0; j < user.roles.length; j++) {
                                //console.log(rolelist[i].Role_sid);
                                //    if(rolelist[i].Role_sid !== user.roles[j]){

                                //     }
                                //}
                            }

                            //console.log(roleArray);

                            for (var j = 0; j < user.roles.length; j++) {
                                //roleArray.push(user.roles[j]);
                                //console.log("roleArray");
                                //console.log(roleArray);
                                //console.log("user.roles[j]");
                                //console.log(user.roles[j]);
                                //console.log(roleArray.indexOf(parseInt(user.roles[j])));
                                var index = roleArray.indexOf(parseInt(user.roles[j]));
                                if (index === -1) {
                                    var query2 = "call personrole_insert (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + person_id + ", " + user.roles[j] + ");";
                                    console.log("query2---" + query2);
                                    connection.query(query2, function(error, result3, fields) {
                                        if (error || result3[0][0].return_code == 1) {
                                            //console.log(error);
                                            done({err: true, msg: 'Could not update user roles'});
                                        }
                                    });
                                } else {
                                    roleArray.splice(index, 1);
                                    roleSidArray.splice(index, 1);
                                }
                            }

                            //console.log(roleArray);

                            for (var m = 0; m < roleSidArray.length; m++) {
                                var query = "call personrole_delete (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + roleSidArray[m] + ");";
                                //console.log("query---" + query);
                                connection.query(query, function(error, result, fields) {
                                    if (error || result[0][0].return_code == 1) {
                                        //console.log(error);
                                        done({err: true, msg: 'Could not update user roles'});
                                    }
                                });
                            }

                            done({err: false, msg: 'Updated User: ' + user.name + ' successfully'});

                        }

                    });

                }
            }

        });

    });

};

/*
 * Update User profile information
 */
Users.prototype.updateProfile = function(req, user, done) {

    var caller_sid = req.session.user.sid;
    var caller_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    var tenant_sid = req.session.user.tenant_sid;
    user.picturelink = (typeof user.picturelink != 'undefined' && user.picturelink !== null && user.picturelink !== "") ? this.addQuotes(user.picturelink) : null;
    user.userid = (typeof user.userid != 'undefined' && user.userid !== null) ? "'" + user.userid + "'" : null;
    if (user.changePassword) {
        user.password = "'" + crypto.createHash('md5').update(user.password).digest('hex') + "'";
    } else {
        user.password = null;
    }

    var query = "call person_update (" + caller_sid + ", '" + caller_ip + "', " + tenant_sid + ", " + caller_sid
            + ", 1, '" + user.name + "', null, null, null, null, null, null, " + user.userid + ", " + user.password + ", "
            + user.picturelink + ", null, null, null, null, null, null, null, null, null);";
    console.log("query---" + query);

    req.getConnection(function(err, connection) {

        if (err) {
            done({err: true, msg: 'database connect error'});
            return;
        }

        connection.query(query, function(error, result, fields) {
            
            if (result[0][0].return_code === 1) {
                done({err: true, msg: 'database error'});
            } else if (result[0][0].return_code === 2) {
                console.log(result);
                done({err: true, msg: 'User ID already exists, Please enter another one.'});
            } else {
                done({err: false, msg: 'Updated User: ' + user.name + ' successfully'});
            }

        });

    });

};

Users.prototype.query = function(req, query, done) {

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

Users.prototype.addQuotes = function(string) {
    return "'" + string + "'";
};

module.exports = new Users();
