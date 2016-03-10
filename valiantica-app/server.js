'use strict';

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var connection = require('express-myconnection');
//var underscore = require('underscore');
var config = require('./app-config.js');
var mysql = require('mysql');


var userService = require('./services/users');
var tenantService = require('./services/tenants');
var loginService = require('./services/login');
var candidateService = require('./services/candidates');
var hotlistService = require('./services/hotlist');
var myCandidatesService = require('./services/my-candidates');
var reportService = require('./services/services_reports');
var dashboardService = require('./services/services_dashboard');

var app = express();

app.use(favicon(__dirname + '/www/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(connection(mysql, config.mysqlconnection, 'pool'));

app.use(session({secret: 'Some secret', rolling: true, cookie:{maxAge:1800000}}));

app.use('/files', express.static(path.join(__dirname, '/files')));
app.use(express.static(path.join(__dirname, '/www')));

app.use('/services/login', loginService);

//Middleware to check if valid session is present
var checkSession = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.send(401);
    }
};

app.use(checkSession);

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return next();
});

//Get logged in use info from session
app.post('/getLoggedInUser', function(req, res, next) {
    //res.set('Cache-Control', 'no-cache');
    res.json(req.session.user);
});

app.get('/signout', function(req, res, next) {
    req.session.destroy();
    res.send(200);
});

// secure services with session check
app.use('/services/users', userService);
app.use('/services/tenants', tenantService);
app.use('/services/candidates', candidateService);
app.use('/services/my-candidates', myCandidatesService);
app.use('/services/hotlist', hotlistService);
app.use('/services/services_reports', reportService);
app.use('/services/services_dashboard', dashboardService);

app.set('port', process.env.PORT || 8080);
//start the server
app.listen(app.get('port'));
