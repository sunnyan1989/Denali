'use strict';
var express = require('express');
var moment = require('moment');
var config = require('../app-config.js');
var hotlistAssignments = require('../models/Hotlist-assignments');
var router = express.Router();
var nodemailer = require("nodemailer");
var fs = require('fs');
var path = require('path');
var cheerio = require("cheerio");
var download_server = require("./curl");
var smtpTransport = require("./imap-mail");
/* GET candidate list assigned to the logged in person. */
router.post('/sendMail', function(req, res, next) {

    var mail_to = req.body.options.mail_to;
    var mail_cc = req.body.options.mail_cc;
    var mail_subject = req.body.options.mail_subject;
    var mail_content = req.body.options.mail_content;
    var type = req.body.options.type;
    var attach = req.body.options.attach;
    var mail_resumelink = req.body.options.mail_resumelink;
    var sendtype = config.serversetting.mailserver;
    var default_sender_mail = config.serversetting.default_sender_mail;
    var default_sender_name = config.serversetting.default_sender_name;
    var userid = req.session.user.userid;

    if (sendtype === "gmail") {

        //console.log(mail_resumelink);
        if (type === "submitted" || (type === "vendorf" && attach === '1')) {

            //console.log("mail_resumelink--" + mail_resumelink);

            if (mail_resumelink === "" || mail_resumelink === null) {
                res.send({err: true, msg: "send email fail, no attachment for this vendor"});
                return false;
            }

            if (type === "submitted") {
                var from = default_sender_name + "<" + default_sender_mail + ">";
            } else {
                var from = userid;
            }

            fs.readFile(mail_resumelink, function(err, data) {

                var filename = path.basename(mail_resumelink);

                smtpTransport.sendMail(from, mail_to, mail_cc, mail_subject, mail_content, {filename: filename, contents: data}, function(data) {
                    res.send(data);
                });

            });
        } else {

            smtpTransport.sendMail(userid, mail_to, mail_cc, mail_subject, mail_content, {}, function(data) {
                res.send(data);
            });

        }
    } else {
        //console.log("type--" + type);
        //console.log("attach--" + attach);

        if (mail_subject.indexOf("denaliJS:") === -1) {
            default_sender_mail = userid;
            default_sender_name = "";
        }


        if (type === "submitted" || (type === "vendorf" && attach === '1')) {

            if (mail_resumelink === "" || mail_resumelink === null) {
                res.send({err: true, msg: "send email fail, no attachment for this vendor"});
                return false;
            }

            if (type === "submitted") {
                //if (mail_cc.indexOf(userid.toString()) === -1) {
                if (mail_cc) {
                    mail_cc = mail_cc + "," + userid;
                } else {
                    mail_cc = userid;
                }

                //}
            }

            fs.readFile(mail_resumelink, function(err, data) {

                var filename = path.basename(mail_resumelink);

                smtpTransport.sendDefaultMail(default_sender_mail, default_sender_name, mail_to, mail_cc, mail_subject, mail_content, {filename: filename, contents: data}, function(data) {
                    res.send(data);
                });

            });
        } else {

            smtpTransport.sendDefaultMail(default_sender_mail, default_sender_name, mail_to, mail_cc, mail_subject, mail_content, {}, function(data) {
                res.send(data);
            });

        }

    }

});


router.post('/sendNotificationEmails', function(req, res, next) {
    hotlistAssignments.getNotificationEmails(req, function(notificationEmails) {

        var job = req.body.job;
        var candidate = req.body.candidate;
        var name = req.body.name;
        var type = req.body.type;
        var sendtype = config.serversetting.mailserver;
        var default_sender_mail = config.serversetting.default_sender_mail;
        var default_sender_name = config.serversetting.default_sender_name;
        var userid = req.session.user.userid;
        //var resumelink = candidate.resumelink;

        if (notificationEmails.length > 0) {

            var e_id = {cm_sid: null, eid: 8};

            var mailto = [];
            var mailcc = [];

            for (var i = 0; i < notificationEmails.length; i++) {

                if (mailcc.indexOf(notificationEmails[i].ToEmail) === -1) {
                    mailto.push(notificationEmails[i].ToEmail);
                }

                if (mailcc.indexOf(notificationEmails[i].CCEmail) === -1) {
                    mailcc.push(notificationEmails[i].CCEmail);
                }
            }

            if (mailto.length > 0) {
                mailto = mailto.join();
                mailcc = mailcc.join();
            }

            hotlistAssignments.getEmailTemplateFromService(req, e_id, function(result) {
                //res.send(result);

                if (typeof result.err === "undefined") {
                    var subject = result[0].subject;
                    var body = result[0].body;

                    body = body.replace("<<username>>", name);
                    body = body.replace("<<candidatename>>", candidate.candidate);
                    body = body.replace("<<vendorcontact>>", job.vendorcontact ? job.vendorcontact : "N/A");
                    body = body.replace("<<vendorname>>", job.vendor ? job.vendor : "N/A");
                    body = body.replace("<<jobID>>", job.sid);
                    body = body.replace("<<jobtitle>>", job.title);
                    
                    if( typeof job.joblink!=="undefined" && job.joblink!==null && job.joblink!==""){
                        body = body.replace("<<joblink>>", "<a href='" + job.joblink + "'>Job Link</a>");
                    }else{
                       body = body.replace("<<joblink>>", "N/A");
                    }
                    
                    body = body.replace(/\\n\\n/g, "<br /><br />");
                    body = body.replace(/\n\n/g, "<br /><br />");

                    //console.log("job.joblink--"+job.joblink);

                    if (subject.indexOf("denaliJS:") === -1) {
                        default_sender_mail = userid;
                        default_sender_name = "";
                    }

                    smtpTransport.sendDefaultMail(default_sender_mail, default_sender_name, mailto, mailcc, subject, body, {}, function(data) {
                        res.send(data);
                    });

                }

            });

        }

        //console.log(notificationEmails);
        //res.send(result);
    });
});

router.post('/sendNormalEmails', function(req, res, next) {
    hotlistAssignments.getEmailTemplate(req, function(result) {
        console.log(result);
    });
});

/* GET candidate list assigned to the logged in person. */
router.post('/', function(req, res, next) {
    hotlistAssignments.getMyCandidates(req, function(result) {
        res.send(result);
    });
});
/* Get jobs for a candidate */
router.post('/getTransactionsByJob', function(req, res, next) {
    hotlistAssignments.getTransactionsByJob(req, function(result) {
        res.send(result);
    });
});
router.post('/getJobs', function(req, res, next) {
    hotlistAssignments.getJobs(req, function(result) {
        res.send(result);
    });
});
/* Get jobs for a candidate */
router.post('/getSingleJob', function(req, res, next) {
    hotlistAssignments.getSingleJob(req, function(result) {
        res.send(result);
    });
});
/* Get search url for a candidate */
router.post('/getSearchUrl', function(req, res, next) {
    hotlistAssignments.getSearchUrl(req, function(result) {
        res.send(result);
    });
});
router.post('/getEmailTemplate', function(req, res, next) {
    hotlistAssignments.getEmailTemplate(req, function(result) {
        res.send(result);
    });
});
router.post('/getNotificationEmails', function(req, res, next) {
    hotlistAssignments.getNotificationEmails(req, function(result) {
        res.send(result);
    });
});
router.post('/getJobDescription', function(req, res, next) {
    hotlistAssignments.getJobDescription(req, function(result) {
        res.send(result);
    });
});
/* Insert a new job */
router.post('/addJob', function(req, res, next) {
    hotlistAssignments.addJob(req, function(result) {
        res.send(result);
    });
});
/* Insert a new job */
router.post('/editJob', function(req, res, next) {
    hotlistAssignments.editJob(req, function(result) {
        res.send(result);
    });
});
/* Update status for a candidate */
router.post('/updateStatus', function(req, res, next) {
    hotlistAssignments.updateStatus(req, function(result) {
        res.send(result);
    });
});
router.post('/updateJobStatus', function(req, res, next) {
    hotlistAssignments.updateJobStatus(req, function(result) {
        res.send(result);
    });
});
router.post('/updateIsHot', function(req, res, next) {
    hotlistAssignments.updateIsHot(req, function(result) {
        res.send(result);
    });
});
router.post('/updateKeywords', function(req, res, next) {
    hotlistAssignments.updateKeywords(req, function(result) {
        res.send(result);
    });
});
router.post('/checkdUplicate', function(req, res, next) {
    hotlistAssignments.checkdUplicate(req, function(result) {
        res.send(result);
    });
});
router.post('/getDataWithUrl', function(req, res, next) {

    var urlstr = req.body.joburl.fullurl;
    download_server.download(req.body.joburl.fullurl, function(data) {
        //console.log(data);
        if (data) {
            //console.log(data);
            var $ = cheerio.load(data);
            var jobtitle, source, jobid, company, contact, email, phone, keywords, detailDescription;
            if (urlstr.indexOf("dice.com") >= 0) {

                source = "dice.com";
                if ($('meta[name="twitter:text:job_title"]').length > 0) {
                    jobtitle = $('meta[name="twitter:text:job_title"]').attr("content");
                } else {
                    jobtitle = "";
                }

                if ($('span[property="skills"]').length > 0) {
                    keywords = $('span[property="skills"]').attr("content");
                } else {
                    keywords = "";
                }

                if ($('meta[name="groupId"]').length > 0) {
                    jobid = $('meta[name="groupId"]').attr("content");
                } else {
                    jobid = "";
                }

                if ($('span[property="Organization"]').length > 0) {
                    company = $('span[property="Organization"]').attr("content");
                    //console.log(company);
                } else {
                    company = "";
                }

                if ($('span[property="addressLocality"]').length > 0) {
                    var addressLocality = $('span[property="addressLocality"]').attr("content");
                    var addressRegion = $('span[property="addressRegion"]').attr("content");
                    //var description = $('span[property="description"]').attr("content");
                    if ($("#detailDescription").length > 0) {
                        var description = $('#detailDescription').html();
                    } else if ($(".dc_content").length > 0) {
                        var description = $('.dc_content').html();
                    }


                    detailDescription = description + "\n\n" + addressLocality + " " + addressRegion;
                } else {
                    detailDescription = "";
                }

                if ($('#contactInfo').length > 0) {
                    /*contact = $('#contactInfo div:nth-child(1)').text();
                     contact = contact.trim();
                     phone = $('#contactInfo div:nth-child(5)').text();
                     phone = phone.replace("Phone:", "");
                     phone = phone.trim();*/
                    contact = "";
                    phone = "";
                } else if ($('.contact_info').length > 0) {
                    contact = $('.contact_info dl:nth-child(2)').text();
                    contact = contact.replace("Contact:", "");
                    contact = contact.trim();
                    phone = $('.contact_info dl:nth-child(6) dd').text();
                    phone = phone.replace("Phone:", "");
                    phone = phone.trim();
                } else {
                    contact = "";
                    phone = "";
                }

            } else if (urlstr.indexOf("monster.com") >= 0) {

                source = "monster.com";
                if ($("#jobTitle").length > 0) {
                    jobtitle = $("#jobTitle").val();
                } else {
                    jobtitle = "";
                }

                if ($("#jobLocation").length > 0) {

                    if ($("#jobBodyContent").length > 0) {
                        var description = $('#jobBodyContent').html();
                    } else if ($("#TrackingJobBody").length > 0) {
                        var description = $('#TrackingJobBody').html();
                    } else {
                        var description = $('#CJT-jobBodyContent').html();
                    }

                    //if (description.length > 4096) {
                    //    description = description.substring(0, 4096);
                    //}
                    var jobLocation = $("#jobLocation").val();
                    detailDescription = description + "\n\n" + jobLocation;
                } else {
                    detailDescription = "";
                }

                if ($("#jobID").length > 0) {
                    jobid = $("#jobID").val();
                } else if ($("#jobRefCode").length > 0) {
                    jobid = $("#jobRefCode").val();
                } else {
                    jobid = "";
                }

                if ($('#jobCompany').length > 0) {
                    company = $('#jobCompany').val();
                } else {
                    company = "";
                }

                keywords = "";
                //console.log("monster.com");

            } else if (urlstr.indexOf("indeed.com") >= 0) {
                jobtitle = $(".jobtitle").text();
                //detailDescription = $("#job_summary").text();
                //console.log("indeed.com");
                //console.log(jobtitle);
            }

            //console.log(source);
            res.send({jobtitle: jobtitle, jobid: jobid, source: source, company: company, contact: contact, phone: phone, keywords: keywords, detailDescription: detailDescription});
        } else {
            //console.log("error");
        }
    });
});
router.post('/setSessionStatusChange', function(req, res, next) {
    //if (req.body.user.jobStatusList === "1,2,3,4,5,6,7,8,9") {
    //    req.body.user.jobStatusList === "0";
    //}
    //console.log(req.body.user.jobStatusList);
    req.session.user = req.body.user;
    res.send(200);
});
module.exports = router;
