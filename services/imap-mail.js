'use strict';

var config = require('../app-config.js');
var nodemailer = require("nodemailer");
//var googlerequest = require('google-oauth-jwt');

function sendMail(sender, mail_to, mail_cc, subject, html, attchments, callback) {
    //console.log(config);

    var SERVICE_ACCOUNT_EMAIL = '72606887906-12qr8lf5bps7tnjkl3rk26hj2jce1his@developer.gserviceaccount.com';
    var SERVICE_ACCOUNT_KEY_FILE = "./services/7accb34c810e.pem";

    /*googlerequest.authenticate({
     // use the email address of the service account, as seen in the API console
     email: SERVICE_ACCOUNT_EMAIL,
     // use the PEM file we generated from the downloaded key
     keyFile: SERVICE_ACCOUNT_KEY_FILE,
     // specify the scopes you wish to access
     scopes: ['https://www.googleapis.com/auth/gmail.compose']
     }, function(err, token) {
     //console.log('Google API: Authenticated');
     //console.log('------------------------');
     console.log('The GoogleDrive Token is : ' + token);
     var smtpTransport = nodemailer.createTransport("SMTP", {
     service: "Gmail",
     debug: true,
     auth: {
     XOAuth2: {
     user: config.gmail.mail_user,
     clientId: "72606887906-12qr8lf5bps7tnjkl3rk26hj2jce1his.apps.googleusercontent.com",
     //clientSecret: config.gmail.mail_clientSecret,
     //refreshToken: config.gmail.mail_refreshToken,
     //accessToken: config.gmail.mail_accessToken,
     accessToken: token,
     timeout: config.gmail.mail_timeout
     }
     }
     });
     //console.log("attchments");
     //console.log(attchments);
     
     smtpTransport.sendMail({
     //sender: req.session.user.userid,
     sender: sender,
     to: mail_to,
     cc: mail_cc,
     subject: subject,
     html: html,
     attachments: [attchments]
     
     }, function(error, response) {  //callback
     if (error) {
     console.log(error);
     } else {
     //res.send(200);
     callback(200);
     console.log("Message sent: " + response.message);
     }
     smtpTransport.close();
     });
     
     
     });*/



}


function sendDefaultMail(sender, sendername, mail_to, mail_cc, subject, html, attchments, callback) {
    //console.log(config);
    nodemailer.SMTP = {
        host: config.defaultmail.mail_host,
        port: config.defaultmail.mail_port,
        use_authentication: config.defaultmail.mail_authentication,
        user: config.defaultmail.mail_server_user,
        pass: config.defaultmail.mail_server_pass
    };

    //for (var i = 0; i < mail_to.length; i++) {
    //console.log("sending notification email to: " + mail_to);

    if (typeof mail_cc === "undefined" || mail_cc === "") {
        var message = {
            sender: sendername + "<" + sender + ">",
            to: mail_to,
            subject: subject,
            html: html,
            attachments: [attchments]
        };
    } else {
        var message = {
            //sender: sendername + "<" + sender + ">",
            sender: sendername + "<" + sender + ">",
            to: mail_to,
            cc: mail_cc,
            subject: subject,
            html: html,
            attachments: [attchments]
        };
    }

    console.log(message);

    nodemailer.send_mail(message,
            function(err) {
                if (!err) {
                    console.log("Email: " + subject + ' sent successfully.');
                    callback(200);
                } else {
                    console.log("Email: " + subject + "send failed");
                    console.log(err);
                    callback({err: true, msg: subject + "send failed"});
                    //res.send({err: true, msg: "Email for (de-)assigning candidate failed"});
                }
            });
}



exports.sendMail = sendMail;
exports.sendDefaultMail = sendDefaultMail;
