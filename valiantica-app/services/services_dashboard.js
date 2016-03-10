'use strict';

var express = require('express');
//var google = require('googleapis');
var Dashboard = require('../models/model_dashboard.js');
var router = express.Router();
var nodemailer = require("nodemailer");

//var googlerequest = require('google-oauth-jwt');
//

//var gmail = google.gmail('v1');

/*var authClient = new google.auth.JWT(
        "72606887906-12qr8lf5bps7tnjkl3rk26hj2jce1his@developer.gserviceaccount.com",
        // Contents of private_key.pem if you want to load the pem file yourself
        // (do not use the path parameter above if using this param)
        "./services/119003fc07d6.pem",
        null,
        // Scopes can be specified either as an array or as a single, space-delimited string
                ['https://mail.google.com']
                // User to impersonate (leave empty if no impersonation needed)
                );

        authClient.authorize(function(err, tokens) {
            if (err) {
                console.log(err);
                return;
            }

            //console.log(tokens);

            // Make an authorized request to list Drive files.
            var gmail = google.gmail({auth: authClient, version: 'v1'});
            
            var emails = gmail.users.messages.list({userId: "tao_l@valiantica.com"}, function(err, results) {
                //console.log(err);
                //console.log(results);
            });
            
            console.log(emails);
 
        });*/

// generated by: openssl pkcs12 -in ...SNIP...p12 -out key.pem -nocerts -nodes

        /*function Cloud() {
         
         var SERVICE_ACCOUNT_EMAIL = '922493550664-nkm7necedaaj112qle0fecivpteku902@developer.gserviceaccount.com';
         var SERVICE_ACCOUNT_KEY_FILE = "./services/Denali-3ccaaf402ee9.pem";
         
         this.service_account_credentials = {
         EMAIL_ADDRESS: SERVICE_ACCOUNT_EMAIL,
         PRIVATE_KEY: SERVICE_ACCOUNT_KEY_FILE,
         SCOPES: ['https://www.googleapis.com/auth/userinfo.email',
         'https://www.googleapis.com/auth/datastore']
         };
         this.authorize();
         }
         ;
         
         // authorize with datastore api                                                                                                             
         Cloud.prototype.authorize = function(opt_callback) {
         
         this.jwt = new googleapis.auth.JWT(
         this.service_account_credentials.EMAIL_ADDRESS,
         this.service_account_credentials.PRIVATE_KEY,
         null,
         this.service_account_credentials.SCOPES
         );
         this.jwt.authorize((function(err, result) {
         if (!err) {
         //console.log(result);
         this.jwt.credentials = result;
         this.connect();
         }
         }).bind(this));
         }
         
         // connect to datastore                                                                                                                     
         Cloud.prototype.connect = function() {
         console.log("client");
         //console.log(this.jwt);
         googleapis.withAuthClient(this.jwt);
         googleapis.discover('datastore', 'v1beta2').execute((function(err, client) {
         console.log(err);
         console.log("client");
         console.log(client);
         if (err) {
         //this.emit('error', err);
         //return;
         }
         this.datastore = client.datastore.datasets;
         this.datastore.beginTransaction({
         datasetId: process.argv[2]
         }).execute(function(err, result) {
         console.log(result);
         });
         }).bind(this));
         };
         
         var cloud = new Cloud();*/

        /*googlerequest.encodeJWT({
         // use the email address of the service account, as seen in the API console
         email: SERVICE_ACCOUNT_EMAIL,
         // use the PEM file we generated from the downloaded key
         keyFile: SERVICE_ACCOUNT_KEY_FILE,
         // specify the scopes you which to access
         scopes: ['https://www.googleapis.com/auth/gmail.compose']
         }, function(err, jwt) {
         console.log(jwt);
         });
         
         googlerequest.authenticate({
         // use the email address of the service account, as seen in the API console
         email: SERVICE_ACCOUNT_EMAIL,
         // use the PEM file we generated from the downloaded key
         keyFile: SERVICE_ACCOUNT_KEY_FILE,
         // specify the scopes you wish to access
         scopes: ['https://www.googleapis.com/auth/gmail.compose']
         }, function(err, token) {
         console.log('Google API: Authenticated');
         console.log('------------------------');
         console.log('The GoogleDrive Token is : ' + token);
         });*/


        router.post('/cmStatus', function(req, res, next) {
            Dashboard.getCMStatus(req, function(result) {
                res.send(result);
            });
        });

        router.post('/getCMActivity', function(req, res, next) {
            Dashboard.getCMActivity(req, function(result) {
                res.send(result);
            });
        });

        module.exports = router;