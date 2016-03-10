'use strict';

var express = require('express');
var multer = require('multer');
var moment = require('moment');
var fs = require('fs-extra');
var config = require('../app-config.js');
var Candidate = require('../models/Candidates.js');
//var nodemailer = require("nodemailer");
var smtpTransport = require("./imap-mail");
var router = express.Router();


router.post('/sendMail', function(req, res, next) {

    var mail_from = req.body.options.mail_from;
    var mail_to = req.body.options.mail_to;
    var mail_subject = req.body.options.mail_subject;
    var mail_content = req.body.options.mail_content;
    var sendtype = config.serversetting.mailserver;
    var default_sender_mail = config.serversetting.default_sender_mail;
    var default_sender_name = config.serversetting.default_sender_name;
    var type = req.body.options.type;
    var userid = req.session.user.userid;

    if (mail_subject.indexOf("denaliJS:") === -1) {
        default_sender_mail = userid;
        default_sender_name = "";
    }

    if (sendtype === "gmail") {

        smtpTransport.sendMail(default_sender_mail, mail_to, req.session.user.userid, mail_subject, mail_content, {}, function(data) {
            res.send(data);
        });

    } else {

        smtpTransport.sendDefaultMail(default_sender_mail, default_sender_name, mail_to, req.session.user.userid, mail_subject, mail_content, {}, function(data) {
            res.send(data);
        });

    }

});

router.post('/sendAssignedEmails', function(req, res, next) {

    var datalist = typeof req.body.datalist !== 'undefined' ? req.body.datalist : "";
    var item = typeof req.body.item !== 'undefined' ? req.body.item : "";
    var sendtype = config.serversetting.mailserver;
    var default_sender_mail = config.serversetting.default_sender_mail;
    var default_sender_name = config.serversetting.default_sender_name;
    var userid = req.session.user.userid;

    Candidate.getEmailTemplateFromService(req, datalist, function(result) {
        //res.send(result);
        //console.log(result);
        if (typeof result.err === "undefined") {
            var subject = result[0].subject;
            var body = result[0].body;
            body = body.replace("<<username>>", item.assigned_cmperson);
            body = body.replace("<<candidatename>>", item.candidate);
            body = body.replace(/\\n\\n/g, "<br /><br />");
            body = body.replace(/\n\n/g, "<br /><br />");

            if (subject.indexOf("denaliJS:") === -1) {
                default_sender_mail = userid;
                default_sender_name = "";
            }

            smtpTransport.sendDefaultMail(default_sender_mail, default_sender_name, item.assigned_userid, userid, subject, body, {}, function(data) {
                res.send(data);
            });

        }

    });
});

router.post('/getEmailTemplate', function(req, res, next) {
    Candidate.getEmailTemplate(req, function(result) {
        res.send(result);
    });
});

/* GET all Candidate. */
router.post('/', function(req, res, next) {
    Candidate.getCandidateList(req, function(result) {
        res.send(result);
    });
});

router.post('/hotList', function(req, res, next) {
    Candidate.getHotList(req, function(result) {
        res.send(result);
    });
});

router.post('/getJobType', function(req, res, next) {
    Candidate.getJobType(req, function(result) {
        res.send(result);
    });
});

router.post('/getLegalStatusType', function(req, res, next) {
    Candidate.getLegalStatusType(req, function(result) {
        res.send(result);
    });
});

router.post('/getMajorType', function(req, res, next) {
    Candidate.getMajorType(req, function(result) {
        res.send(result);
    });
});

router.post('/getDegreeType', function(req, res, next) {
    Candidate.getDegreeType(req, function(result) {
        res.send(result);
    });
});

router.post('/getEmploymentType', function(req, res, next) {
    Candidate.getEmploymentType(req, function(result) {
        res.send(result);
    });
});

router.post('/getPersonInfo', function(req, res, next) {
    //alert(req);
    Candidate.getPersonInfo(req, function(result) {
        res.send(result);
    });
});

router.post('/getContactList', function(req, res, next) {
    //var sid = typeof req.body.sid !== 'undefined' ? parseInt(req.body.sid) : NULL;
    //alert(sid);
    Candidate.getContactList(req, function(result) {
        res.send(result);
    });
});

router.post('/getEducationList', function(req, res, next) {
    //var sid = typeof req.body.sid !== 'undefined' ? parseInt(req.body.sid) : NULL;
    Candidate.getEducationList(req, function(result) {
        res.send(result);
    });
});

router.post('/getLegalStatusList', function(req, res, next) {
    //var sid = typeof req.body.sid !== 'undefined' ? parseInt(req.body.sid) : NULL;
    Candidate.getLegalStatusList(req, function(result) {
        res.send(result);
    });
});

router.post('/getEmploymentList', function(req, res, next) {
    //var sid = typeof req.body.sid !== 'undefined' ? parseInt(req.body.sid) : NULL;
    Candidate.getEmploymentList(req, function(result) {
        res.send(result);
    });
});

router.post('/getSkillsList', function(req, res, next) {
    //var sid = typeof req.body.sid !== 'undefined' ? parseInt(req.body.sid) : NULL;
    Candidate.getSkillsList(req, function(result) {
        res.send(result);
    });
});

router.post('/getCMList', function(req, res, next) {
    //var sid = typeof req.body.sid !== 'undefined' ? parseInt(req.body.sid) : NULL;
    Candidate.getCMList(req, function(result) {
        res.send(result);
    });
});

router.post('/getAssignList', function(req, res, next) {
    //var sid = typeof req.body.sid !== 'undefined' ? parseInt(req.body.sid) : NULL;
    Candidate.getAssignList(req, function(result) {
        res.send(result);
    });
});

router.post('/getSingleHotItem', function(req, res, next) {
    //var sid = typeof req.body.sid !== 'undefined' ? parseInt(req.body.sid) : NULL;
    Candidate.getSingleHotItem(req, function(result) {
        res.send(result);
    });
});

router.post('/getSingleAssignment', function(req, res, next) {
    //var sid = typeof req.body.sid !== 'undefined' ? parseInt(req.body.sid) : NULL;
    Candidate.getSingleAssignment(req, function(result) {
        res.send(result);
    });
});

router.post('/addNew', function(req, res, next) {
    Candidate.addNew(req, function(result) {
        res.send(result);
    });
});

router.use('/updatePersonPicture', multer({
    rename: function(fieldname, filename) {
        return filename + moment().format('YYYY-MM-DD');
    }
}
));

/* Update tenant logo */
router.post('/updatePersonPicture', function(req, res, next) {
    //console.log(req.files);
    console.log(req.files.file);
    var errObj = {err: true, msg: "Profile Picture not uploaded"};

    var tmpPath = req.files.file.path;
    // set where the file should actually exists 
    var targetDir = './files/profiles/' + req.session.user.tenant_sid;
    var targetPath = targetDir + "/" + req.files.file.name;
    fs.copy(tmpPath, targetPath, function(err) {
        if (err)
            res.send({err: true, msg: "Profile Picture not uploaded"});
        else
            res.send({err: false, picturelink: targetPath});
    });

});

router.use('/updateResume', multer({
    rename: function(fieldname, filename) {
        return filename + moment().format('YYYY-MM-DD');
    }
}
));

/* Update tenant logo */
router.post('/updateResume', function(req, res, next) {
    //console.log(req.files);
    console.log(req.files.file);
    var errObj = {err: true, msg: "Resume not uploaded"};

    var tmpPath = req.files.file.path;
    // set where the file should actually exists 
    var targetDir = './files/resumes/' + req.session.user.tenant_sid;
    var targetPath = targetDir + "/" + req.files.file.name;
    fs.copy(tmpPath, targetPath, function(err) {
        if (err)
            res.send({err: true, msg: "Resume not uploaded"});
        else
            res.send({err: false, resumelink: targetPath});
    });

});

router.post('/updateItemStatus', function(req, res, next) {
    Candidate.updateItemStatus(req, function(result) {
        res.send(result);
    });
});

router.post('/updateHotListStatus', function(req, res, next) {
    Candidate.updateHotListStatus(req, function(result) {
        res.send(result);
    });
});

router.post('/newContact', function(req, res, next) {
    Candidate.newContact(req, function(result) {
        res.send(result);
    });
});

router.post('/newEducation', function(req, res, next) {
    Candidate.newEducation(req, function(result) {
        res.send(result);
    });
});

router.post('/newLegalStatus', function(req, res, next) {
    Candidate.newLegalStatus(req, function(result) {
        res.send(result);
    });
});

router.post('/newSkills', function(req, res, next) {
    Candidate.newSkills(req, function(result) {
        res.send(result);
    });
});

router.post('/newEmployment', function(req, res, next) {
    Candidate.newEmployment(req, function(result) {
        res.send(result);
    });
});

router.post('/addHostListItem', function(req, res, next) {
    Candidate.addHostListItem(req, function(result) {
        res.send(result);
    });
});

router.post('/dupHotList', function(req, res, next) {
    Candidate.dupHotList(req, function(result) {
        res.send(result);
    });
});

router.post('/addAssignment', function(req, res, next) {
    Candidate.addAssignment(req, function(result) {
        res.send(result);
    });
});

module.exports = router;
