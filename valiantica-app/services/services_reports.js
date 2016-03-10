'use strict';
var express = require('express');
var Reports = require('../models/model_reports.js');
var router = express.Router();

router.post('/report_cm_activitydetailbycm', function(req, res, next) {
    Reports.report_cm_activitydetailbycm(req, function(result) {
        res.send(result);
    });
});

router.post('/report_cm_jobsbyvendor', function(req, res, next) {
    Reports.report_cm_jobsbyvendor(req, function(result) {
        res.send(result);
    });
});

router.post('/getJobStatusList', function(req, res, next) {
    Reports.getJobStatusList(req, function(result) {
        res.send(result);
    });
});

router.post('/getDistinctVendorList', function(req, res, next) {
    Reports.getDistinctVendorList(req, function(result) {
        res.send(result);
    });
});

router.post('/getCandidateList', function(req, res, next) {
    Reports.getCandidateList(req, function(result) {
        res.send(result);
    });
});

router.post('/getCMList', function(req, res, next) {
    Reports.getCMList(req, function(result) {
        res.send(result);
    });
});

router.post('/report_cm_activitybycandidate', function(req, res, next) {
    Reports.report_cm_activitybycandidate(req, function(result) {
        res.send(result);
    });
});

router.post('/getCandStatusList', function(req, res, next) {
    Reports.getCandStatusList(req, function(result) {
        res.send(result);
    });
});

router.post('/report_cm_activitybycm', function(req, res, next) {
    Reports.report_cm_activitybycm(req, function(result) {
        res.send(result);
    });
});

module.exports = router;