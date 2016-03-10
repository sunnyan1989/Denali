'use strict';

var express = require('express');
var Users = require('../models/Users.js');
var Tenants = require('../models/Tenants.js');
var router = express.Router();

/* 
 * Authenticate user, set session state
 */
router.post('/signin', function(req, res, next) {
    
    Users.signin(req, function(result) {
        if (result === null) {
            res.send(401, 'User email or password incorrect');
            return;
        } else if (result.err) {
            res.send(401, result.msg);
            return;
        } else {
            req.session.user = result;
            res.send(200);
        }
        //console.log(result);

    });

});


/*
 * Add new tenant with its admin user
 */
router.post('/signup', function(req, res, next) {
   
    Tenants.add(req, function(result) {
        res.json(result);
    });
});

router.post('/signout', function(req, res, next) {
    
    Users.signout(req, function(result) {
        req.session.destroy();
        //console.log(req.session);
        res.send(result);
    });
});

module.exports = router;
