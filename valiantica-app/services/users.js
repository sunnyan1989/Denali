'use strict';

var express = require('express');
var Users = require('../models/Users.js');
var multer = require('multer');
var moment = require('moment');
var fse = require('fs-extra');
var router = express.Router();

/* GET all users. */
router.post('/', function(req, res, next) {
    Users.getUserList(req, function(result) {
        res.send(result);
    });
});

router.post('/search', function(req, res, next) {
    Users.search(req, function(result) {
        res.send(result);
    });
});

/* Get user profile */
router.post('/getProfile', function(req, res, next) {
    Users.getProfile(req, function(result) {
        res.send(result);
    });
});

router.post('/getRoles', function(req, res, next) {
    Users.getRoles(req, function(result) {
        res.send(result);
    });
});

router.use('/updateUsersLogo', multer({
    rename: function(fieldname, filename) {
        return filename + moment().format('YYYY-MM-DD');
    }
}
));

/* Update tenant logo */
router.post('/updateUsersLogo', function(req, res, next) {
    //console.log(req.files);
    //console.log(req.files.file);
    var errObj = {err: true, msg: "Tenant logo not uploaded"};

    var tmpPath = req.files.file.path;
    // set where the file should actually exists 
    var targetDir = './files/profiles/' + req.session.user.tenant_sid;
    var targetPath = targetDir + "/" + req.files.file.name;

    fse.copy(tmpPath, targetPath, function(err) {
        if (err)
            res.send({err: true, msg: "Tenant logo not uploaded"});
        else
            res.send({err: false, picturelink: targetPath});
    });

});


router.post('/add', function(req, res, next) {
    Users.add(req, function(result) {
        res.send(result);
    });
});

/* Update user information */
router.post('/update', function(req, res, next) {
    var user = req.body.user;
    user.lastupdatedby = req.session.user.sid;
    Users.update(req, user, function(result) {
        res.send(result);
    });
});

/* Update user profile */
router.post('/updateProfile', function(req, res, next) {
    var user = req.body.user;
    user.lastupdatedby = req.session.user.sid;
    Users.updateProfile(req, user, function(result) {
        res.send(result);
    });
});

module.exports = router;
