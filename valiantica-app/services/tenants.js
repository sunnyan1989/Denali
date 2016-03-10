'use strict';

var express = require('express');
var multer = require('multer');
var moment = require('moment');
var fs = require('fs');
var fse = require('fs-extra');
var Tenants = require('../models/Tenants.js');
var router = express.Router();

router.post('/', function(req, res, next) {
    Tenants.get(req, function(result) {
        res.send(result);
    });
});

router.post('/addNew', function(req, res, next) {
    Tenants.add(req, function(result) {
        res.send(result);
    });
});

router.use('/updateTenantLogo', multer({
    rename: function(fieldname, filename) {
        return filename + moment().format('YYYY-MM-DD');
    }
}
));

/* Update tenant logo */
router.post('/updateTenantLogo', function(req, res, next) {
    //console.log(req.files);
    //console.log(req.files.file);
    var errObj = {err: true, msg: "Tenant logo not uploaded"};

    var tmpPath = req.files.file.path;
    // set where the file should actually exists 
    var targetDir = './files/logos/' + req.session.user.tenant_sid;
    var targetPath = targetDir + "/" + req.files.file.name;
    
    fse.copy(tmpPath, targetPath, function(err) {
        if (err)
            res.send({err: true, msg: "Tenant logo not uploaded"});
        else
            res.send({err: false, logolink: targetPath});
    });

});

router.post('/getProfile', function(req, res, next) {
    Tenants.getProfile(req, function(result) {
        //res.set('Cache-control', 'no-cache');
        res.send(result);
    });

});


/* Update tenant information */
router.post('/update', function(req, res, next) {
    Tenants.update(req, function(result) {
        res.send(result);
    });
});

/* Update tenant profile */
router.post('/updateProfile', function(req, res, next) {
    Tenants.updateProfile(req, function(result) {
        res.send(result);
    });
});

module.exports = router;
