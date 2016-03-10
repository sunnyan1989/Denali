'use strict';

var express = require('express');

var Hotlist = require('../models/Hotlist');
var router = express.Router();


/* GET hotlist status data. */
router.get('/getStatusData', function(req, res, next) {
    /*hotlist.getStatusData(req.session.user.sid, req.ip, function(result) {
        res.send(result);
    });*/
    Hotlist.getStatusData(req, function(result) {
        res.send(result);
    });
});

/* GET hotlist job status data. */
router.get('/getJobStatusData', function(req, res, next) {
    /*hotlist.getJobStatusData(req.session.user.sid, req.ip, function(result) {
        res.send(result);
    });*/
    Hotlist.getJobStatusData(req, function(result) {
        res.send(result);
    });
});

/* GET last hotlist record*/
router.post('/getLast', function(req, res, next) {
    /*hotlist.getLast(req.session.user.sid, req.ip, req.session.user.tenant_sid, function(result) {
        res.send(result);
    });*/
    Hotlist.getLast(req, function(result) {
        res.send(result);
    });
});

module.exports = router;
