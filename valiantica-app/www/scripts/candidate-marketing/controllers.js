'use strict';
//Global admin controllers

var candidateMarketingControllers = angular.module('candidateMarketingControllers', []);
candidateMarketingControllers.factory('markeData', function() {
    var data =
            {
                jobs: []
            };
    return {
        getJobList: function() {
            return data.jobs;
        },
        setJobList: function(joblists) {
            data.jobs = joblists;
        }
    };
});
candidateMarketingControllers.controller('MyCandidatesCtrl', ['$scope', '$http', '$q', '$modal', '$filter', "markeData",
    function($scope, $http, $q, $modal, $filter, markeData) {
        $scope.candidates = [];
        $scope.hotlistStatusList = [];
        $scope.hotlistJobStatusList = [];
        $scope.curCandidateIndex = $scope.loggedInUser.curCandidateIndex ? $scope.loggedInUser.curCandidateIndex : 0;
        $scope.hotlistJobStatusList[0] = {name: 'All, Except Inactive', value: true};
        $scope.jobStatusList = null;
        $scope.searchUrlData = [];
        $scope.jobFormData = [];
        $scope.isCollapsed = $scope.loggedInUser.isCollapsed ? true : false;
        $scope.isHotList = $scope.loggedInUser.isHotList ? $scope.loggedInUser.isHotList : 'false';
        $scope.page_ishow = true;
        $scope.lastHotlistSid = null;
        $(".mycandidates li").first().removeClass("active");
        $scope.jobs = [];

        $scope.$watch(function() {
            return markeData.getJobList();
        }, function(newVal, oldVal) {
            //if (typeof newVal !== 'undefined') {
            //   $scope.taskList = uaProgressService.taskList;
            //}
            $scope.jobs = markeData.getJobList();
        });

        //$scope.jobs = Data.getJobList();

        //console.log($scope.jobs);

        $scope.init = function(done) {
            var promises = [];
            //Initialize hot list status data
            var getHotlistStatus = $http.get('services/hotlist/getStatusData');
            promises.push(getHotlistStatus);
            getHotlistStatus.success(function(data) {
                for (var i = 0; i < data.length; i++) {
                    $scope.hotlistStatusList[data[i].sid] = data[i].name; // for status lookup
                }
            });
            // Get last hotlist id
            var getLastHotlist = $http.post('services/hotlist/getLast');
            promises.push(getLastHotlist);
            getLastHotlist.success(function(data) {
                //alert(data[0].sid);
                $scope.lastHotlistSid = data[0].sid;
            });

            /*$http.post('services/hotlist/getLast').success(function(data) {
             //alert(data[0].sid);
             $scope.lastHotlistSid = data[0].sid;
             //done();
             });*/

            //Initialize hot list job status data
            var getHotlistJobStatus = $http.get('services/hotlist/getJobStatusData');
            promises.push(getHotlistJobStatus);
            getHotlistJobStatus.success(function(data) {

                if ($scope.loggedInUser.jobStatusList) {
                    var jobStatusArray = $scope.loggedInUser.jobStatusList.split(",");
                    //console.log(jobStatusArray);
                }
                for (var i = 0; i < data.length; i++) {
                    //alert(data[i].sid);
                    data[i].statuscheck = false;
                    if ($scope.loggedInUser.jobStatusList) {
                        if (jobStatusArray.indexOf(data[i].sid.toString()) != -1) {
                            data[i].statuscheck = true;
                            $scope.hotlistJobStatusList[0].value = false;
                        }
                    }
                    //alert(data[i].statuscheck);
                    $scope.hotlistJobStatusList[data[i].sid] = {name: data[i].name, statuscheck: data[i].statuscheck, value: data[i].statuscheck, sid: data[i].sid}; // for status lookup
                }
                if (typeof jobStatusArray !== "undefined") {
                    if (jobStatusArray[0] === "0" || jobStatusArray[0] === 0) {
                        $scope.hotlistJobStatusList[0].value = true;
                    }
                }

            });
            // when all http requests are resolved
            $q.all(promises).then(done);
            //done();
        }

        $scope.$on('mynotify', function(event, result) {
            $scope.notify('success', result);
        });

        $scope.$on('errornotify', function(event, result) {
            $scope.notify('error', result);
        });

        $scope.$on('updateJobStatusNotify', function(event, jobSid, result) {
            //*
            $scope.searchKeys = {
                jobSid: jobSid
            };
            //alert(jobSid);
            //alert(result);
            $http.post('/services/my-candidates/getSingleJob/', $scope.searchKeys).success(function(data) {
                //alert(data);
                //console.log(data[0]);
                for (var i = 0; i < $scope.jobs.length; i++) {
                    //alert(i);
                    if ($scope.jobs[i].sid === jobSid) {
                        $scope.jobs[i] = data[0];

                        var jobstatus = data[0].jobstatus;

                        if (jobstatus == 'New') {
                            $scope.jobs[i].fristStep = true;
                            $scope.jobs[i].groupClass = "ui-accordion-info";
                        }
                        if (jobstatus == 'Submitted' || jobstatus == 'Selected' || jobstatus == 'Interested' || jobstatus == 'Phone Screening' || jobstatus == 'Interviewing' || jobstatus == 'Interviewed') {
                            $scope.jobs[i].secondStep = true;
                            $scope.jobs[i].groupClass = "ui-accordion-success";
                        }
                        if (jobstatus == 'Inactive' || jobstatus == 'Rejected' || jobstatus == 'Closed') {
                            $scope.jobs[i].thirdStep = true;
                            $scope.jobs[i].groupClass = "ui-accordion-danger";
                        }

                        if ($scope.jobs[i].hourlyrate === "NULL") {
                            $scope.jobs[i].hourlyrate = "";
                        }

                        if ($scope.jobs[i].annualsalary === "NULL") {
                            $scope.jobs[i].annualsalary = "";
                        }

                        if ($scope.jobs[i].hourlyrate_submitted === "NULL") {
                            $scope.jobs[i].hourlyrate_submitted = "";
                        }

                        if ($scope.jobs[i].annualsalary_submitted === "NULL") {
                            $scope.jobs[i].annualsalary_submitted = "";
                        }

                        if ($scope.jobs[i].hourlyrate_agreed === "NULL") {
                            $scope.jobs[i].hourlyrate_agreed = "";
                        }

                        if ($scope.jobs[i].annualsalary_agreed === "NULL") {
                            $scope.jobs[i].annualsalary_agreed = "";
                        }

                        $scope.jobs[i].isOpen = true;

                        $scope.jobs[i].statusList = $scope.hotlistJobStatusList.slice($scope.jobs[i].HotListJobStatus_sid + 1);
                        $scope.jobs[i].nextStep = $scope.jobs[i].statusList[0];

                    }
                }
            });
            //*/
            $scope.notify('success', result);
        });


        $scope.$on('updateList', function(event, type, passData) {

            if (type === "editkw") {
                $scope.candidates[passData.listid].keywords = passData.keywords;
                $scope.candidates[passData.listid].url = [];
                for (var j = 0; j < $scope.searchUrlData.length; j++) {
                    var url = $scope.searchUrlData[j].url;

                    if ($scope.searchUrlData[j].company === "dice") {
                        url = url.replace("<<employment_type>>", $scope.candidates[passData.listid].str_dice);
                        var keywords = $scope.candidates[passData.listid].keywords.replace(/,/g, " ");
                        url = url.replace("<<keywords>>", keywords);
                        url = url.replace(/#/g, '%23');
                    } else if ($scope.searchUrlData[j].company === "monster") {
                        url = url.replace("<<employment_type>>", $scope.candidates[passData.listid].str_monster);
                        url = url.replace("<<keywords>>", $scope.candidates[passData.listid].keywords);
                        url = url.replace(/#/g, '%23');
                    } else if ($scope.searchUrlData[j].company === "indeed") {
                        url = url.replace("<<employment_type>>", $scope.candidates[passData.listid].str_indeed);
                        url = url.replace("<<keywords>>", $scope.candidates[passData.listid].keywords);
                        url = url.replace(/#/g, '%23');
                    }

                    //url = url.replace("<<employment_type>>", $scope.candidates[passData.listid].EmploymentType_sid);
                    if ($scope.candidates[passData.listid].locationzip) {
                        var zip = $scope.candidates[passData.listid].locationzip;
                    } else {
                        var zip = "";
                    }
                    url = url.replace("<<zip>>", zip);
                    $scope.candidates[passData.listid].url.push({urllink: url, company: $scope.searchUrlData[j].company});
                }
            }

        });

        $scope.sendMail = function(i) {

            var hotListData = {
                HotListJob_id: $scope.candidates[i].assignment_sid,
                newHotLisJobtStatus_sid: -1,
                note: "",
                hourlyrate: null,
                annualsalary: null
            };

            if ($scope.candidates[i].cand_email) {
                //console.log($scope.candidates[i]);
                this.showPopWithEmail(1, "smail-candidatef", null, hotListData, $scope.candidates[i]);
            }
            else {
                this.showPopNoEmail("smail-candidatef", null, hotListData, $scope.candidates[i]);
            }

        };

        $scope.setSummaryStatus = function(isCollapsed) {
            $scope.isCollapsed = isCollapsed === false ? true : false;
            var user = $scope.loggedInUser;
            user.isCollapsed = $scope.isCollapsed;
            $http.post('services/my-candidates/setSessionStatusChange', {user: user}).success(function(result) {
            });
        };

        $http.post('services/my-candidates/getSearchUrl', {status_sid: 1}).success(function(searchurl) {
            $scope.searchUrlData = searchurl;
        });

        $scope.hoverIn = function() {
            this.hoverEdit = true;
        };

        $scope.hoverOut = function() {
            this.hoverEdit = false;
        };

        //Get candidates
        $scope.search = function() {
            //alert($scope.lastHotlistSid);
            $http.post('services/my-candidates/', {hotlistSid: $scope.lastHotlistSid}).success(function(candidates) {

                if (candidates.msg) {
                    $scope.notify('error', candidates.msg);
                }

                $scope.candidates = candidates;
                //alert(candidates.length);
                //console.log(candidates);
                $scope.page_ishow = false;
                $scope.no_result_found = false;

                if (candidates.length > 0) {

                    for (var i = 0; i < candidates.length; i++) {
                        $scope.candidates[i].url = [];
                        $scope.candidates[i].newStatusSid = $scope.candidates[i].status_sid;

                        for (var j = 0; j < $scope.searchUrlData.length; j++) {
                            var url = $scope.searchUrlData[j].url;

                            if ($scope.searchUrlData[j].company === "dice") {
                                url = url.replace("<<employment_type>>", $scope.candidates[i].str_dice);
                                var keywords = $scope.candidates[i].keywords.replace(/,/g, " ");
                                url = url.replace("<<keywords>>", keywords);
                                url = url.replace(/#/g, '%23');
                            } else if ($scope.searchUrlData[j].company === "monster") {
                                url = url.replace("<<employment_type>>", $scope.candidates[i].str_monster);
                                url = url.replace("<<keywords>>", $scope.candidates[i].keywords);
                                url = url.replace(/#/g, '%23');
                            } else if ($scope.searchUrlData[j].company === "indeed") {
                                url = url.replace("<<employment_type>>", $scope.candidates[i].str_indeed);
                                url = url.replace("<<keywords>>", $scope.candidates[i].keywords);
                                url = url.replace(/#/g, '%23');
                            }

                            if ($scope.candidates[i].locationzip) {
                                var zip = $scope.candidates[i].locationzip;
                            } else {
                                var zip = "";
                            }
                            url = url.replace("<<zip>>", zip);

                            $scope.candidates[i].url.push({urllink: url, company: $scope.searchUrlData[j].company});
                        }
                    }
                    $scope.getJobs();
                } else {
                    $scope.no_result_found = true;
                }
            });
        };

        //Change Hot List assignment status, save to DB

        $scope.updateStatus = function(i) {

            var list = {
                candidate: $scope.candidates[i].candidate,
                hotlistSid: $scope.lastHotlistSid,
                sid: $scope.candidates[i].assignment_sid,
                statusSid: $scope.candidates[i].newStatusSid,
                note_i: ""
            };

            var modalInstance;
            modalInstance = $modal.open({
                backdrop: true,
                windowClass: 'app-modal-window',
                templateUrl: "views/newComment.html",
                controller: function($scope, Data, $http, $modalInstance, $log) {

                    $scope.submit = function(comment) {
                        list.note_i = comment.note_i;
                        $http.post('services/my-candidates/updateStatus',
                                {hotlistAssignment: list})
                                .success(function(result) {
                                    if (result.err) {
                                        $scope.$parent.$broadcast('errornotify', result.msg);
                                        $scope.candidates[i].newStatusSid = $scope.candidates[i].status_sid; //revert to old status
                                    } else
                                        // $scope.notify('success', result.msg);
                                        $scope.$parent.$broadcast('mynotify', result.msg);
                                    $modalInstance.dismiss('cancel');
                                }).error(function() {
                            $scope.notify('error', 'Server error');
                            $scope.candidates[i].newStatusSid = $scope.candidates[i].status_sid; //revert to old status
                        });
                    };

                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                    comment: function() {
                        return $scope.comment;
                    }
                }
            });

        }

        $scope.editKW = function(i) {

            var source_keywords = {keyword: $scope.candidates[i].keywords, sid: $scope.candidates[i].assignment_sid};

            var list = {
                sid: $scope.candidates[i].assignment_sid,
                keywords: ""
            };

            var modalInstance;
            modalInstance = $modal.open({
                backdrop: true,
                windowClass: 'app-modal-window',
                templateUrl: "views/editKW.html",
                controller: function($scope, Data, $http, $modalInstance, $log) {
                    $scope.keywords = {keyword: source_keywords.keyword, sid: source_keywords.sid};
                    $scope.submit = function(keywords) {
                        list.keywords = keywords.keyword;
                        $http.post('services/my-candidates/updateKeywords',
                                {keywordDate: list})
                                .success(function(result) {
                                    if (result.err) {
                                        $scope.$parent.$broadcast('errornotify', result.msg);
                                    } else {
                                        $scope.$parent.$broadcast('updateList', "editkw", {listid: i, keywords: list.keywords});
                                        $scope.$parent.$broadcast('mynotify', result.msg);
                                        $modalInstance.dismiss('cancel');
                                    }
                                }).error(function() {
                            $scope.$parent.$broadcast('errornotify', 'Server error');
                        });
                    };

                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                    comment: function() {
                        return $scope.comment;
                    }
                }
            });

        }

        // Set current candidate index
        $scope.setCurrentCandidate = function(index) {
            $scope.curCandidateIndex = index;
            var user = $scope.loggedInUser;
            //alert($scope.loggedInUser.curCandidateIndex + "--"+index);
            if ($scope.loggedInUser.curCandidateIndex !== index) {
                //alert($scope.loggedInUser.curCandidateIndex + "--"+index);
                //user.jobStatusList = "1,2,3,4,5,6,7,8,9";
                user.jobStatusList = "0";
                user.isHotList = "false";
                $scope.isHotList = $scope.ishot = "false";
                $scope.newOne = true;
                $scope.hotlistJobStatusList[0].value = true;
                for (var j = 1; j < $scope.hotlistJobStatusList.length; j++) {
                    $scope.hotlistJobStatusList[j].value = false;
                }
            } else {
                $scope.newOne = false;
            }

            user.curCandidateIndex = index;

            $http.post('services/my-candidates/setSessionStatusChange', {user: user}).success(function(result) {
            });

            $scope.jobs = [];
            $scope.getJobs();
            //There is no job for this candidate.
        }
        $scope.jobs = [];

        //Get hot list jobs for current candidate
        $scope.getJobs = function() {

            var user = $scope.loggedInUser;
            //console.log(user);

            if ($scope.newOne) {
                $scope.jobStatusList = "0";
            } else {
                if ($scope.loggedInUser.jobStatusList != "") {
                    $scope.jobStatusList = $scope.loggedInUser.jobStatusList;
                } else {
                    $scope.jobStatusList = "0";
                }
            }
            //var startpost = new Date().getTime();
            //console.log("startpost-" + startpost);
            $http.post('services/my-candidates/getJobs',
                    {hotlistAssignmentSid: $scope.candidates[$scope.curCandidateIndex].assignment_sid, statusList: $scope.jobStatusList, isHot: $scope.ishot})
                    .success(function(jobs) {

                        //var starteach = new Date().getTime();
                        //console.log("starteach-" + starteach);

                        $scope.page_ishow = false;
                        //alert($scope.jobStatusList);
                        $scope.jobs = jobs.jobs;

                        for (var i = 0; i < $scope.jobs.length; i++) {

                            var jobstatus = $scope.jobs[i].jobstatus;

                            if ($scope.jobs[i].ishot === 1) {
                                $scope.jobs[i].ishot = 'true';
                            } else {
                                $scope.jobs[i].ishot = 'false';
                            }

                            $scope.jobs[i].fristStep = false;
                            $scope.jobs[i].secondStep = false;
                            $scope.jobs[i].thirdStep = false;
                            if (jobstatus == 'New') {
                                $scope.jobs[i].fristStep = true;
                                $scope.jobs[i].groupClass = "ui-accordion-info";
                            }
                            if (jobstatus == 'Submitted' || jobstatus == 'Selected' || jobstatus == 'Interested' || jobstatus == 'Phone Screening' || jobstatus == 'Interviewing' || jobstatus == 'Interviewed') {
                                $scope.jobs[i].secondStep = true;
                                $scope.jobs[i].groupClass = "ui-accordion-success";
                            }
                            if (jobstatus == 'Inactive' || jobstatus == 'Rejected' || jobstatus == 'Closed') {
                                $scope.jobs[i].thirdStep = true;
                                $scope.jobs[i].groupClass = "ui-accordion-danger";
                            }
                            $scope.jobs[i].statusList = $scope.hotlistJobStatusList.slice($scope.jobs[i].HotListJobStatus_sid + 1);
                            $scope.jobs[i].nextStep = $scope.jobs[i].statusList[0];
                        }

                        //var donepost = new Date().getTime();
                        //console.log("donepost-" + donepost);

                    });

        }

        $scope.editJob = function(job, candidate) {

            var length = Object.keys(job).length;
            //console.log($scope.loggedInUser);
            var candidateName = $scope.loggedInUser.tenant_name;
            //alert($scope.loggedInUser.tenant_name);
            //if (job.hourlyrate > 0) {
            if (job.hourlyrate !== "null" && job.hourlyrate !== "0" && job.hourlyrate !== 0) {
                job.salary = job.hourlyrate;
                job.salarytype = "hourlyRate";
            }

            if (job.annualsalary !== "null" && job.annualsalary !== "0" && job.annualsalary !== 0) {
                job.salary = job.annualsalary;
                job.salarytype = "annualSalary";
            }

            if (length > 0) {
                //$scope.master = contact;
                $scope.master = angular.copy(job);
            }

            var modalInstance;
            modalInstance = $modal.open({
                backdrop: true,
                windowClass: 'job-modal-window',
                templateUrl: "views/job-detail.html",
                controller: function($scope, $http, $modalInstance, $log) {

                    if (length > 0) {
                        $scope.master = angular.copy(job);
                    }

                    if (job.vendoremail === "null") {
                        //alert($scope.contact.email_work);
                        $scope.master.vendoremail = "";
                    }

                    $scope.$watch('master.source', function(newValue, oldValue) {
                        $("#source_value").val(newValue);
                    });

                    $scope.$watch('master.client', function(newValue, oldValue) {
                        //alert("ddd");
                        $("#client_value").val(newValue);
                        $("#client_value").removeClass("redbox");
                    });

                    $scope.$watch('master.vendor', function(newValue, oldValue) {
                        $("#vendor_value").val(newValue);
                    });

                    $scope.$watch('master.vendorcontact', function(newValue, oldValue) {
                        $("#checkcontact").removeClass("redbox");
                    });

                    $scope.$watch('master.vendorphone', function(newValue, oldValue) {
                        $("#checkphone").removeClass("redbox");
                    });

                    $scope.$watch('master.vendoremail', function(newValue, oldValue) {
                        $("#checkemail").removeClass("redbox");
                    });

                    //$scope.job = job;
                    $scope.candidateName = candidateName;

                    $scope.save = function(type) {

                        if (job.salarytype === "annualSalary") {
                            $scope.master.annualsalary = $scope.master.salary;
                            $scope.master.hourlyrate = "0";
                        } else {
                            $scope.master.hourlyrate = $scope.master.salary;
                            $scope.master.annualsalary = "0";
                        }
                        //alert($scope.job.annualSalary);
                        //save in database
                        $scope.master.keywords = $scope.master.keywords.replace(/'/g, "\\'");
                        $scope.master.description = $scope.master.description.replace(/'/g, "\\'");
                        $scope.master.client = $scope.master.client.replace(/'/g, "\\'");
                        $scope.master.vendor = $scope.master.vendor.replace(/'/g, "\\'");
                        $scope.master.joblink = $scope.master.joblink.replace(/'/g, "\\'");
                        $scope.master.title = $scope.master.title.replace(/'/g, "\\'");
                        $scope.master.vendorcontact = $scope.master.vendorcontact.replace(/'/g, "\\'");


                        $http.post('/services/my-candidates/editJob', {job: $scope.master})
                                .success(function(result) {
                                    // console.log(result);
                                    if (type === "both") {
                                        var hotListData = {
                                            HotListJob_id: result.hotlistjob_id,
                                            newHotLisJobtStatus_sid: 2,
                                            note: "",
                                            hourlyrate: $scope.master.annualSalary,
                                            annualsalary: $scope.master.annualSalary
                                        };

                                        $modalInstance.close(result);
                                        $scope.$parent.$broadcast('updateJobStatusWithEmail', "submitted", $scope.master, candidate);

                                    } else {
                                        $modalInstance.close();
                                        $scope.$parent.$broadcast('updateJobStatusNotify', job.sid, result.msg);
                                        //$scope.$parent.$broadcast('mynotify', result.msg);
                                    }

                                    //$scope.$parent.$broadcast('mynotify', result.msg);
                                    //$modalInstance.close();
                                })
                                .error(function(data, status) {
                                    $modalInstance.close({err: true, msg: 'Server error'});
                                });
                    }

                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {}
            });
        };

        $scope.updateishot = function(job, sourcetype) {
            job.ishot = job.ishot === 'false' ? 'true' : 'false';

            var hotListData = {
                HotListJob_id: job.sid,
                ishot: job.ishot
            };

            $http.post('services/my-candidates/updateIsHot',
                    {hotListData: hotListData})
                    .success(function(result) {
                        if (!result.err) {
                            $scope.notify('success', result.msg);
                        }
                    }).error(function() {
                $scope.notify('error', 'Server error');
            });

        }

        $scope.updateishotlist = function() {
            $scope.isHotList = $scope.isHotList === 'false' ? 'true' : 'false';

            //alert($scope.isHotList);
            //alert($scope.isHotList);
            $scope.ishot = $scope.isHotList;
            //alert($scope.ishot);

            var user = $scope.loggedInUser;
            user.isHotList = $scope.isHotList;
            $http.post('services/my-candidates/setSessionStatusChange', {user: user}).success(function(result) {
            });

            $scope.jobs = [];
            $scope.getJobs();
        }

        $scope.$on('updateJobStatusWithEmail', function(event, type, job, candidate) {
            $scope.updateJobStatusWithEmail(type, job, candidate);
        });

        $scope.updateJobStatusWithEmail = function(type, job, candidate) {

            if (job.salarytype === "annualSalary") {
                job.annualSalary = job.salary;
                job.hourlyRate = "";
            } else {
                job.hourlyRate = job.salary;
                job.annualSalary = "";
            }

            var hotListData = {
                HotListJob_id: job.sid,
                newHotLisJobtStatus_sid: "",
                note: "",
                hourlyrate: null,
                annualsalary: null
            };

            var emailtemplateid = 1;


            if (type === "submitted") {
                hotListData.newHotLisJobtStatus_sid = 2;

                if (job.vendoremail && job.vendoremail !== 'null') {
                    this.showPopWithEmail(3, type, job, hotListData, candidate);
                } else {
                    this.showPopNoEmail(type, job, hotListData, candidate);
                }

            } else if (type === "selected") {
                this.showPopNoEmail(type, job, hotListData, candidate);
            } else if (type === "nextstep") {
                this.showPopNoEmail(type, job, hotListData, candidate);
            } else if (type === "adjustrate") {
                hotListData.newHotLisJobtStatus_sid = -3;
                this.showPopNoEmail(type, job, hotListData, candidate);
            } else if (type === "inactive") {
                hotListData.newHotLisJobtStatus_sid = 10;
                this.showPopNoEmail(type, job, hotListData, candidate);
            } else if (type === "candidatef") {
                hotListData.newHotLisJobtStatus_sid = -1;

                if (candidate.cand_email && candidate.cand_email !== 'null') {
                    this.showPopWithEmail(emailtemplateid, type, job, hotListData, candidate);
                } else {
                    this.showPopNoEmail(type, job, hotListData, candidate);
                }

            } else if (type === "vendorf") {
                hotListData.newHotLisJobtStatus_sid = -2;
                emailtemplateid = 2;

                if (job.vendoremail && job.vendoremail !== 'null') {
                    this.showPopWithEmail(emailtemplateid, type, job, hotListData, candidate);
                } else {
                    this.showPopNoEmail(type, job, hotListData, candidate);
                }

            } else if (type === "interview") {
                hotListData.newHotLisJobtStatus_sid = 5;
                emailtemplateid = 4;

                if (candidate.cand_email && candidate.cand_email !== 'null') {
                    this.showPopWithEmail(emailtemplateid, type, job, hotListData, candidate);
                } else {
                    this.showPopNoEmail(type, job, hotListData, candidate);
                }

            }

        }

        $scope.showPopNoEmail = function(type, job, hotListData, candidate) {
            //alert("showPopNoEmail");

            var name = $scope.loggedInUser.name;

            if (type === "submitted") {
                var filename = "submitCandidate.html";
            } else if (type === "selected") {
                var filename = "selected.html";
            } else if (type === "nextstep") {
                var filename = "nextStep.html";
            } else if (type === "inactive") {
                var filename = "newNote.html";
            } else if (type === "candidatef") {
                var filename = "newNote.html";
            } else if (type === "vendorf") {
                var filename = "newNote.html";
            } else if (type === "interview") {
                var filename = "newNote.html";
            } else if (type === "adjustrate") {
                var filename = "adjustrate.html";
            } else {
                var filename = "newNote.html";
            }

            var jobdetail = job;

            var modalInstance;
            modalInstance = $modal.open({
                backdrop: true,
                windowClass: 'nextstep-modal-window',
                templateUrl: "views/" + filename,
                controller: function($scope, $http, $modalInstance, $log) {

                    $scope.type = type;

                    $scope.master = angular.copy(job);

                    if (type === "nextstep") {

                        $scope.job = job;
                        //alert(job.statusList[0].name);
                        $scope.job.nextStep = job.statusList[0];
                        //$scope.job.salarytype = "true";
                    } else if (type === "selected") {
                        $scope.master = angular.copy(job);
                        $scope.master.nextStep = 8;

                        //console.log(job);

                        if (job.hourlyrate_agreed !== "" && job.hourlyrate_agreed !== null && job.hourlyrate_agreed !== "0") {
                            $scope.master.salary = job.hourlyrate_agreed;
                            $scope.master.salarytype = "hourlyRate";
                        } else if (job.annualsalary_agreed !== "" && job.annualsalary_agreed !== null && job.annualsalary_agreed !== "0") {
                            $scope.master.salary = job.annualsalary_agreed;
                            $scope.master.salarytype = "annualSalary";
                        }else{
                            $scope.master.salarytype = "hourlyRate";
                        }

                        //$scope.master.salarytype = "true";
                    }

                    $scope.submit = function(job) {

                        hotListData.note = job.note_i;
                        if (type === "nextstep" || type === "selected") {
                            hotListData.newHotLisJobtStatus_sid = job.nextStep;
                        }

                        if (type === "submitted" || type === "selected" || type === "nextstep" || type === "adjustrate") {
                            //alert(job.salarytype);
                            if (typeof job.salarytype === "undefined") {
                                hotListData.hourlyrate = job.salary;
                            } else {
                                if (job.salarytype === "hourlyRate") {
                                    hotListData.hourlyrate = job.salary;
                                } else {
                                    hotListData.annualsalary = job.salary;
                                }
                            }
                        }

                        //console.log(hotListData);
                        $http.post('services/my-candidates/updateJobStatus',
                                {hotListData: hotListData})
                                .success(function(result) {
                                    //console.log(result);
                                    if (!result.err) {
                                        if (type === "submitted") {
                                            var canceler = $q.defer();
                                            $http.post('/services/my-candidates/sendNotificationEmails/', {name: name, job: job, candidate: candidate, HotListAssignment_id: candidate.assignment_sid, type: type});
                                            canceler.resolve();
                                        }

                                        $http.post('/services/my-candidates/editJob', {job: job})
                                                .success(function(result1) {
                                                    $scope.$parent.$broadcast('updateJobStatusNotify', hotListData.HotListJob_id, result.msg);
                                                    $modalInstance.dismiss();
                                                })
                                                .error(function(data, status) {
                                                    $scope.$parent.$broadcast('errornotify', 'Server error');
                                                });

                                    }
                                }).error(function() {
                            $scope.$parent.$broadcast('errornotify', 'Server error');
                        });
                    }

                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {}
            });

        }

        $scope.showPopWithEmail = function(eid, type, job, hotListData, candidate) {

            var name = $scope.loggedInUser.name;
            var tenant_name = $scope.loggedInUser.tenant_name;
            var modalInstance;

            //console.log(candidate);

            modalInstance = $modal.open({
                backdrop: true,
                windowClass: 'job-modal-window',
                templateUrl: "views/maildetail.html",
                controller: function($scope, $http, $modalInstance, $log) {


                    if (type === "submitted") {
                        var canceler = $q.defer();
                        $http.post('/services/my-candidates/sendNotificationEmails/', {name: name, job: job, candidate: candidate, HotListAssignment_id: candidate.assignment_sid, type: type});
                        canceler.resolve();
                    }

                    var e_id = {cm_sid: null, eid: eid};

                    if (type === "smail-candidatef" || type === "candidatef" || type === "interview") {
                        var mail_to = candidate.cand_email;
                    } else {
                        var mail_to = job.vendoremail;
                    }

                    $scope.mail = {
                        mail_to: mail_to,
                        mail_from: "",
                        mail_subject: "",
                        mail_content: "",
                        mail_resumelink: candidate.resumelink,
                        mail_type: type,
                        skip: 0,
                        attach: 0,
                        ishow: false
                    }

                    $http.post('services/my-candidates/getEmailTemplate', {datalist: e_id})
                            .success(function(result) {
                                if (!result.err) {
                                    var subject = result[0].subject;
                                    var body = result[0].body;
                                    //alert(eid);
                                    if (eid === 1) {
                                        subject = subject.replace("<<username>>", name);
                                        subject = subject.replace("<<tenantname>>", tenant_name);
                                        body = body.replace("<<candidatename>>", candidate.candidate);
                                        body = body.replace("<<username>>", name);
                                        body = body.replace("<<tenantname>>", tenant_name);
                                    } else if (eid === 2) {
                                        subject = subject.replace("<<username>>", name);
                                        subject = subject.replace("<<tenantname>>", tenant_name);
                                        if (job.vendorcontact) {
                                            body = body.replace("<<vendorcontact>>", job.vendorcontact);
                                        } else {
                                            body = body.replace("<<vendorcontact>>", "Vendor");
                                        }

                                        body = body.replace("<<candidatename>>", candidate.candidate);
                                        body = body.replace("<<username>>", name);
                                        body = body.replace("<<tenantname>>", tenant_name);

                                    } else if (eid === 3) {
                                        subject = subject.replace("<<candidatename>>", candidate.candidate);
                                        subject = subject.replace("<<jobID>>", job.title);
                                        body = body.replace("<<candidatename>>", candidate.candidate);
                                        body = body.replace("<<jobID>>", job.title);

                                        if (job.vendorcontact) {
                                            body = body.replace("<<vendorcontact>>", job.vendorcontact);
                                        } else {
                                            body = body.replace("<<vendorcontact>>", "Vendor");
                                        }

                                        body = body.replace("<<username>>", name);
                                        body = body.replace("<<tenantname>>", tenant_name);

                                    } else if (eid === 4) {
                                        subject = subject.replace("<<username>>", name);
                                        subject = subject.replace("<<tenantname>>", tenant_name);
                                        body = body.replace("<<candidatename>>", candidate.candidate);
                                        body = body.replace("<<username>>", name);
                                        body = body.replace("<<tenantname>>", tenant_name);
                                        body = body.replace("<<vendorcontact>>", job.vendorcontact ? job.vendorcontact : "N/A");
                                        body = body.replace("<<vendorname>>", job.vendor ? job.vendor : "N/A");
                                        body = body.replace("<<jobID>>", job.sid);
                                        body = body.replace("<<jobtitle>>", job.title);

                                        if (typeof job.joblink !== "undefined" && job.joblink !== null && job.joblink !== "") {
                                            body = body.replace("<<joblink>>", "<a href='" + job.joblink + "'>Job Link</a>");
                                        } else {
                                            body = body.replace("<<joblink>>", "N/A");
                                        }
                                    }

                                    body = body.replace(/\\n\\n/g, "<br /><br />");
                                    body = body.replace(/\n\n/g, "<br /><br />");

                                    $scope.mail.mail_subject = subject;
                                    $scope.mail.mail_content = body;
                                }
                            }).error(function() {
                        $scope.notify('error', 'Server error');
                    });

                    $scope.send = function(mail) {

                        if (mail.salarytype === "annualSalary") {
                            mail.annualSalary = mail.salary;
                            mail.hourlyRate = null;
                        } else {
                            mail.hourlyRate = mail.salary;
                            mail.annualSalary = null;
                        }

                        var hotListData1 = {
                            HotListJob_id: hotListData.HotListJob_id,
                            newHotLisJobtStatus_sid: hotListData.newHotLisJobtStatus_sid,
                            note: mail.mail_content,
                            hourlyrate: mail.hourlyRate,
                            annualsalary: mail.annualSalary
                        };

                        if (type === "submitted") {

                            //var canceler = $q.defer();
                            //$http.post('/services/my-candidates/sendNotificationEmails/', {name: name, job: job, candidate: candidate, HotListAssignment_id: candidate.assignment_sid, type: type});
                            //canceler.resolve();


                            if (mail.skip === '1') {
                                //alert(mail.skip);
                                $http.post('services/my-candidates/updateJobStatus',
                                        {hotListData: hotListData1})
                                        .success(function(result) {
                                            if (!result.err) {
                                                $scope.$parent.$broadcast('updateJobStatusNotify', hotListData1.HotListJob_id, result.msg);
                                                $modalInstance.dismiss('cancel');
                                            }
                                        }).error(function() {
                                });
                                return false;
                            }
                        }

                        $scope.mail.ishow = true;

                        if (type !== "smail-candidatef") {
                            $http.post('services/my-candidates/updateJobStatus',
                                    {hotListData: hotListData1})
                                    .success(function(result) {
                                        if (!result.err) {
                                            $scope.$parent.$broadcast('updateJobStatusNotify', hotListData1.HotListJob_id, result.msg);
                                            //$scope.$parent.$broadcast('mynotify', "Send mail successfull");
                                            //$modalInstance.dismiss('cancel');
                                        }
                                    }).error(function() {
                            });

                        }

                        var canceler = $q.defer();
                        var options = {
                            mail_from: candidate.cand_email,
                            mail_to: mail.mail_to,
                            mail_cc: mail.mail_cc,
                            mail_subject: mail.mail_subject,
                            mail_content: mail.mail_content,
                            mail_resumelink: mail.mail_resumelink,
                            attach: mail.attach,
                            type: type,
                        };
                        //console.log(options);
                        $http.post('/services/my-candidates/sendMail/', {options: options});
                        canceler.resolve();

                        $modalInstance.dismiss('cancel');
                        if (type === "smail-candidatef") {
                            $scope.$parent.$broadcast('mynotify', "Send mail successfull");
                        }
                        $scope.mail.ishow = false;
                    }
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {}
            });
        }

        //Called when the job status is selected
        $scope.changeJobStatusList = function(i) {
            //alert(i);
            $scope.newOne = false;

            if (i > 0 && $scope.hotlistJobStatusList[i].value) {
                if (i != $scope.hotlistJobStatusList.length - 1)
                    $scope.hotlistJobStatusList[0].value = false;
            }
            if ($scope.hotlistJobStatusList[0].value) {
                //alert($scope.hotlistJobStatusList[$scope.hotlistJobStatusList.length - 1].value);
                if ($scope.hotlistJobStatusList[$scope.hotlistJobStatusList.length - 1].value === true) {
                    //alert($scope.hotlistJobStatusList[$scope.hotlistJobStatusList.length - 1].value);
                    $scope.jobStatusList = "0,10";
                } else {
                    $scope.jobStatusList = "0";
                }
                for (var j = 1; j < $scope.hotlistJobStatusList.length - 1; j++) {
                    $scope.hotlistJobStatusList[j].value = false;
                }
            } else {
                var arr = [];
                for (var j = 1; j < $scope.hotlistJobStatusList.length; j++) {
                    if ($scope.hotlistJobStatusList[j].value)
                        arr.push(j);
                }
                if (arr.length == 0) {
                    //$scope.jobStatusList = "1,2,3,4,5,6,7,8,9";
                    $scope.hotlistJobStatusList[0].value = true;
                } else {
                    $scope.jobStatusList = arr.toString();
                }
            }

            var user = $scope.loggedInUser;
            user.jobStatusList = $scope.jobStatusList;
            $http.post('services/my-candidates/setSessionStatusChange', {user: user}).success(function(result) {
                //console.log(result);
            });

            $scope.jobs = [];
            $scope.getJobs();
        }

        //Add a new Job
        $scope.addJob = function(i) {

            var modalInstance = $modal.open({
                backdrop: true,
                windowClass: 'job-modal-window',
                templateUrl: 'views/job-detail.html',
                controller: 'JobDetailCtrl',
                resolve: {
                    candidate: function() {
                        return $scope.candidates[i];
                    },
                    users: function() {
                        return $scope.loggedInUser;
                    },
                    hotlistJobStatusList: function() {
                        return $scope.hotlistJobStatusList;
                    },
                    job: function() {
                        return {
                            hotlistSid: $scope.lastHotlistSid,
                            hotlistAssignmentSid: $scope.candidates[i].assignment_sid,
                            title: "",
                            source: "",
                            client: "",
                            vendor: "",
                            vendorphone: "",
                            vendoremail: "",
                            description: "",
                            salarytype: "",
                            hourlyrate: "",
                            annualsalary: "",
                            salary: "",
                            vendorcontact: "",
                            ID: "",
                            name: $scope.loggedInUser.name,
                            tenant_name: $scope.loggedInUser.tenant_name,
                            joblink: ""
                        }

                    }
                }
            });

            modalInstance.result.then(function(result) {
                if (typeof result.err !== "undefined" && result.err) {
                    $scope.notify('error', result.msg);
                } else {
                    $scope.candidates[i].no_found = $scope.candidates[i].no_found + 1;
                    $scope.notify('success', result.msg);
                    if (i === $scope.curCandidateIndex)
                        $scope.getJobs();
                }

            });
        };

        // Initialize scope
        //$scope.init();
        $scope.init(function() {
            $scope.search();
        });

    }
]);

//Controller for pop-up to add a new job
candidateMarketingControllers.controller('JobDetailCtrl', ['$scope', '$http', '$q', '$modalInstance', '$modal', 'candidate', 'job', 'users', 'hotlistJobStatusList', "markeData",
    function($scope, $http, $q, $modalInstance, $modal, candidate, job, users, hotlistJobStatusList, markeData) {
        //alert(candidate.candidate);
        var name = users.name;
        $scope.candidateName = candidate.candidate;
        //$scope.job = job;
        $scope.master = angular.copy(job);

        $scope.forms = {jobForm: null};

        //console.log(job);

        $scope.$watch('master.source', function(newValue, oldValue) {
            $("#source_value").val(newValue);
        });

        $scope.$watch('master.client', function(newValue, oldValue) {
            //alert("ddd");
            $("#client_value").val(newValue);
            $("#client_value").removeClass("redbox");
        });

        $scope.$watch('master.vendor', function(newValue, oldValue) {
            $("#vendor_value").val(newValue);
        });

        $scope.$watch('master.vendorcontact', function(newValue, oldValue) {
            $("#checkcontact").removeClass("redbox");
        });

        $scope.$watch('master.vendorphone', function(newValue, oldValue) {
            $("#checkphone").removeClass("redbox");
        });

        $scope.$watch('master.vendoremail', function(newValue, oldValue) {
            $("#checkemail").removeClass("redbox");
        });

        $scope.$on('getJobs', function(event, result) {
            //alert('getJobs');
            $scope.getJobs();
        });

        $scope.getJobs = function() {

            //console.log(users);
            var jobStatusList = users.jobStatusList;

            $http.post('services/my-candidates/getJobs',
                    {hotlistAssignmentSid: candidate.assignment_sid, statusList: jobStatusList, isHot: $scope.ishot})
                    .success(function(jobs) {

                        $scope.page_ishow = false;
                        //alert($scope.jobStatusList);
                        var jobs = jobs.jobs;

                        for (var i = 0; i < jobs.length; i++) {

                            var jobstatus = jobs[i].jobstatus;

                            if (jobs[i].ishot === 1) {
                                jobs[i].ishot = 'true';
                            } else {
                                jobs[i].ishot = 'false';
                            }

                            jobs[i].fristStep = false;
                            jobs[i].secondStep = false;
                            jobs[i].thirdStep = false;
                            if (jobstatus == 'New') {
                                jobs[i].fristStep = true;
                                jobs[i].groupClass = "ui-accordion-info";
                            }
                            if (jobstatus == 'Submitted' || jobstatus == 'Selected' || jobstatus == 'Interested' || jobstatus == 'Phone Screening' || jobstatus == 'Interviewing' || jobstatus == 'Interviewed') {
                                jobs[i].secondStep = true;
                                jobs[i].groupClass = "ui-accordion-success";
                            }
                            if (jobstatus == 'Inactive' || jobstatus == 'Rejected' || jobstatus == 'Closed') {
                                jobs[i].thirdStep = true;
                                jobs[i].groupClass = "ui-accordion-danger";
                            }
                            jobs[i].statusList = hotlistJobStatusList.slice(jobs[i].HotListJobStatus_sid + 1);
                            jobs[i].nextStep = jobs[i].statusList[0];
                        }

                        markeData.setJobList(jobs);

                        //var donepost = new Date().getTime();
                        //console.log("donepost-" + donepost);

                    });

        }

        //console.log($http);
        $scope.getDataFrom = "Import";

        $scope.getData = function(joburl) {

            if (joburl.indexOf("dice.com") === -1 && joburl.indexOf("monster.com") === -1) {
                $scope.master.uplicatemessage = "This job link cann't be imported, Please enter it manually.";
                return false;
            }


            $scope.getDataFrom = "Loading...";

            if (joburl.indexOf("dice.com") !== -1) {

                if (joburl.indexOf("JobSearch?") !== -1) {
                    var link = joburl.split("&source=");
                    link = link[0];
                    $(".joblink").val(link);
                } else if (joburl.indexOf("job/result") !== -1) {
                    var link = joburl.split("?");
                    link = link[0];
                    $(".joblink").val(link);
                }

            }

            // alert(joburl);

            $http.post('services/my-candidates/checkdUplicate', {assignment_sid: job.hotlistAssignmentSid, joblink: joburl}).success(function(result) {

                var type = result.type;
                var result = result.result;
                //alert(type);
                if (result.length > 0) {
                    //$scope.$parent.$broadcast('errornotify', result[0].CM_name + " has submitted this job for " + candidate.candidate + ". As such, this job can't be added to this candidate.");
                    if (type === 1) {
                        $scope.master.uplicatemessage = "Error: " + result[0].CM_name + " has submitted this job for " + candidate.candidate + ". As such, this job can't be added to this candidate.";
                    } else {
                        $scope.master.uplicatemessage = "Error: you've added this job for this candidate before, and can not add again.";
                    }

                } else {
                    $http.post('services/my-candidates/getDataWithUrl',
                            {joburl: {fullurl: joburl}})
                            .success(function(result) {
                                //console.log(result);
                                $scope.getDataFrom = "Import";
                                $scope.master.title = result.jobtitle;
                                $scope.master.ID = result.jobid;

                                $scope.master.alertmessage = false;

                                if (result.company === "") {
                                    $scope.master.checkvendor = "redbox";
                                    $scope.master.alertmessage = true;
                                } else {
                                    $scope.master.vendor = result.company;
                                }

                                if (result.contact === "") {
                                    $scope.master.checkcontact = "redbox";
                                    $scope.master.alertmessage = true;
                                } else {
                                    $scope.master.vendorcontact = result.contact;
                                }

                                if (result.phone === "") {
                                    $scope.master.checkphone = "redbox";
                                    $scope.master.alertmessage = true;
                                } else {
                                    $scope.master.vendorphone = result.phone;
                                }

                                if (result.keywords === "") {
                                    $scope.master.checkkeywords = "redbox";
                                    $scope.master.alertmessage = true;
                                } else {
                                    $scope.master.keywords = result.keywords;
                                }

                                $scope.master.checkclient = "redbox";
                                $scope.master.checkemail = "redbox";

                                $scope.master.keywords = result.keywords;
                                $scope.master.source = result.source;

                                var description = result.detailDescription;

                                description = description.replace(/<br>/g, "\n");
                                description = description.replace(/<p>(.*?)<\/p>/ig, "$1\n\n");
                                description = description.replace(/<P (.*?)>(.*?)<\/P>/ig, "$2\n\n");
                                description = description.replace(/&#xA0;/g, "");

                                description = description.replace('$("#CJT-jobBodyContent ul > br").remove();', '');
                                description = description.replace('$("#CJT-jobBodyContent li > br").remove();', '');
                                description = description.replace('$("#CJT-jobBodyContent span > br").remove();', '');
                                description = description.replace('$("#CJT-jobBodyContent p ~ br").remove();', '');

                                var reTag = /<(?:.|\s)*?>/g;
                                description = description.replace(reTag, "");

                                if (description.length > 4096) {
                                    description = description.substring(0, 4096);
                                }

                                $scope.master.description = description;
                            }).error(function() {
                    });
                }
            });

        }

        $scope.showPopNoEmail = function(type, job, hotListData, candidate) {

            if (type === "submitted") {
                var filename = "submitCandidate.html";
            }

            var modalInstance;
            modalInstance = $modal.open({
                backdrop: true,
                windowClass: 'nextstep-modal-window',
                templateUrl: "views/" + filename,
                controller: function($scope, $http, $modalInstance, $log) {

                    /* if (type === "nextstep") {
                     $scope.job = job;
                     $scope.job.nextStep = 0;
                     $scope.job.salarytype = "true";
                     }*/

                    $scope.submit = function(submitdetail) {

                        $modalInstance.dismiss('cancel');

                        hotListData.note = submitdetail.note_i;


                        if (type === "submitted") {

                            if (typeof submitdetail.salarytype === "undefined") {
                                hotListData.hourlyrate = submitdetail.salary;
                                hotListData.annualsalary = null;
                            } else {
                                if (submitdetail.salarytype === "hourlyRate") {
                                    hotListData.hourlyrate = submitdetail.salary;
                                    hotListData.annualsalary = null;
                                } else {
                                    hotListData.annualsalary = submitdetail.salary;
                                    hotListData.hourlyrate = null;
                                }
                            }
                        }

                        $http.post('/services/my-candidates/addJob', {job: job})
                                .success(function(result) {
                                    //console.log(result);
                                    //$scope.$emit('getJobs', []);
                                    hotListData.HotListJob_id = result.hotlistjob_id;

                                    $http.post('services/my-candidates/updateJobStatus',
                                            {hotListData: hotListData})
                                            .success(function(result1) {
                                                //console.log(result);
                                                if (!result1.err) {
                                                    //if (type === "both") {
                                                    //$scope.sendNotificaitonMail(job, candidate);
                                                    job.sid = result.hotlistjob_id;

                                                    var canceler = $q.defer();
                                                    $http.post('/services/my-candidates/sendNotificationEmails/', {name: job.name, job: job, candidate: candidate, HotListAssignment_id: candidate.assignment_sid, type: type});
                                                    canceler.resolve();

                                                    //}
                                                    $scope.$parent.$broadcast('getJobs', "");
                                                    $scope.$parent.$broadcast('updateJobStatusNotify', result.hotlistjob_id, result1.msg);
                                                    //$modalInstance.dismiss();
                                                }
                                            }).error(function() {
                                        $scope.$parent.$broadcast('errornotify', 'Server error');
                                    });

                                })
                                .error(function(data, status) {
                                    $modalInstance.close({err: true, msg: 'Server error'});
                                });
                        //console.log(hotListData);
                    }

                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                }
            });

        }

        $scope.showPopWithEmail = function(eid, type, job, hotListData, candidate) {

            var name = job.name;
            var tenant_name = job.tenant_name;
            var modalInstance;

            modalInstance = $modal.open({
                backdrop: true,
                windowClass: 'job-modal-window',
                templateUrl: "views/maildetail.html",
                controller: function($scope, $http, $modalInstance, $log) {

                    var e_id = {cm_sid: null, eid: eid};

                    if (type === "smail-candidatef" || type === "candidatef" || type === "interview") {
                        var mail_to = candidate.cand_email;
                    } else {
                        var mail_to = job.vendoremail;
                    }

                    //alert(candidate.resumelink);

                    $scope.mail = {
                        mail_to: mail_to,
                        mail_from: "",
                        mail_subject: "",
                        mail_content: "",
                        mail_resumelink: candidate.resumelink,
                        mail_type: type,
                        skip: 0,
                        ishow: false
                    }

                    $http.post('services/my-candidates/getEmailTemplate', {datalist: e_id})
                            .success(function(result) {

                                if (!result.err) {
                                    var subject = result[0].subject;
                                    var body = result[0].body;
                                    //alert(eid);
                                    if (eid === 1) {
                                        subject = subject.replace("<<username>>", name);
                                        subject = subject.replace("<<tenantname>>", tenant_name);
                                        body = body.replace("<<candidatename>>", candidate.candidate);

                                        body = body.replace("<<username>>", name);
                                        body = body.replace("<<tenantname>>", tenant_name);

                                    } else if (eid === 2) {
                                        subject = subject.replace("<<username>>", name);
                                        subject = subject.replace("<<tenantname>>", tenant_name);
                                        if (job.vendorcontact) {
                                            body = body.replace("<<vendorcontact>>", job.vendorcontact);
                                        } else {
                                            body = body.replace("<<vendorcontact>>", "Vendor");
                                        }
                                        //alert(candidate.candidate);
                                        body = body.replace("<<candidatename>>", candidate.candidate);
                                        body = body.replace("<<username>>", name);
                                        body = body.replace("<<tenantname>>", tenant_name);

                                    } else if (eid === 3) {
                                        subject = subject.replace("<<candidatename>>", candidate.candidate);
                                        subject = subject.replace("<<jobID>>", job.title);
                                        body = body.replace("<<candidatename>>", candidate.candidate);
                                        body = body.replace("<<jobID>>", job.title);

                                        if (job.vendorcontact) {
                                            body = body.replace("<<vendorcontact>>", job.vendorcontact);
                                        } else {
                                            body = body.replace("<<vendorcontact>>", "Vendor");
                                        }

                                        body = body.replace("<<username>>", name);
                                        body = body.replace("<<tenantname>>", tenant_name);

                                    }

                                    body = body.replace(/\\n\\n/g, "<br /><br />");
                                    body = body.replace(/\n\n/g, "<br /><br />");

                                    $scope.mail.mail_subject = subject;
                                    $scope.mail.mail_content = body;
                                }
                            }).error(function() {
                        $scope.notify('error', 'Server error');
                    });

                    $scope.send = function(mail) {

                        if (mail.salarytype === "annualSalary") {
                            mail.annualSalary = mail.salary;
                            mail.hourlyRate = null;
                        } else {
                            mail.hourlyRate = mail.salary;
                            mail.annualSalary = null;
                        }

                        job.keywords = job.keywords.replace(/'/g, "\\'");
                        job.description = job.description.replace(/'/g, "\\'");
                        job.client = job.client.replace(/'/g, "\\'");
                        job.vendor = job.vendor.replace(/'/g, "\\'");
                        job.joblink = job.joblink.replace(/'/g, "\\'");
                        job.title = job.title.replace(/'/g, "\\'");
                        job.vendorcontact = job.vendorcontact.replace(/'/g, "\\'");

                        $http.post('/services/my-candidates/addJob', {job: job})
                                .success(function(result) {
                                    //console.log(result);
                                    $modalInstance.dismiss('cancel');
                                    $scope.mail.ishow = true;
                                    job.sid = result.hotlistjob_id;

                                    var hotListData1 = {
                                        HotListJob_id: result.hotlistjob_id,
                                        newHotLisJobtStatus_sid: hotListData.newHotLisJobtStatus_sid,
                                        note: mail.mail_content,
                                        hourlyrate: mail.hourlyRate,
                                        annualsalary: mail.annualSalary
                                    };

                                    var canceler = $q.defer();
                                    $http.post('/services/my-candidates/sendNotificationEmails/', {name: name, job: job, candidate: candidate, HotListAssignment_id: candidate.assignment_sid, type: type});
                                    canceler.resolve();

                                    //alert(mail.skip);

                                    if (mail.skip === '1') {
                                        //$modalInstance.dismiss('cancel');
                                        //alert(mail.skip);
                                        $http.post('services/my-candidates/updateJobStatus',
                                                {hotListData: hotListData1})
                                                .success(function(result) {
                                                    if (!result.err) {
                                                        $scope.$parent.$broadcast('getJobs', "");
                                                        $scope.$parent.$broadcast('updateJobStatusNotify', hotListData1.HotListJob_id, result.msg);
                                                    }
                                                }).error(function() {
                                        });

                                        return false;
                                    }

                                    if (typeof mail.mail_cc === "undefined") {
                                        mail.mail_cc = "";
                                    }

                                    var options = {
                                        mail_to: mail.mail_to,
                                        mail_cc: mail.mail_cc,
                                        mail_subject: mail.mail_subject,
                                        mail_content: mail.mail_content,
                                        mail_resumelink: mail.mail_resumelink,
                                        type: type
                                    };

                                    var canceler = $q.defer();
                                    $http.post('/services/my-candidates/sendMail/', {options: options});
                                    canceler.resolve();

                                    //$modalInstance.dismiss('cancel');
                                    if (type === "smail-candidatef") {
                                        $scope.$parent.$broadcast('mynotify', "Send mail successfull");
                                    }

                                    if (type !== "smail-candidatef") {
                                        //$modalInstance.dismiss('cancel');
                                        $http.post('services/my-candidates/updateJobStatus',
                                                {hotListData: hotListData1})
                                                .success(function(result) {
                                                    if (!result.err) {
                                                        $scope.$parent.$broadcast('getJobs', "");
                                                        $scope.$parent.$broadcast('updateJobStatusNotify', hotListData1.HotListJob_id, result.msg);
                                                        //$scope.$parent.$broadcast('mynotify', "Send mail successfull");
                                                        //$modalInstance.dismiss('cancel');
                                                    }
                                                }).error(function() {
                                            $scope.$parent.$broadcast('errornotify', 'Server error');
                                        });

                                    }

                                })
                                .error(function(data, status) {
                                    $modalInstance.close({err: true, msg: 'Server error'});
                                });

                        //alert(mail.skip);


                        $scope.mail.ishow = false;
                    }

                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {}
            });
        }

        $scope.clearChar = function() {

            var link = $(".joblink").val();
            var keywords = link.replace(/ /g, '%20');
            keywords = keywords.replace(/#/g, '%23');
            $(".joblink").val(keywords);

        }

        $scope.save = function(type) {

            //var salarytype = $('#jobForm').find("input[name='salarytype']").val();
            if (job.salarytype === "annualSalary") {
                $scope.master.annualsalary = $scope.master.salary;
                $scope.master.hourlyrate = "";
            } else {
                $scope.master.hourlyrate = $scope.master.salary;
                $scope.master.annualsalary = "";
            }

            if (type !== "both") {
                //save in database
                $http.post('/services/my-candidates/addJob', {job: $scope.master})
                        .success(function(result) {
                            $modalInstance.close(result);
                        })
                        .error(function(data, status) {
                            $modalInstance.close({err: true, msg: 'Server error'});
                        });
            } else {

                $scope.master.type = type;
                $scope.jobFormData = angular.copy($scope.master);

                var hotListData = {
                    HotListJob_id: "",
                    newHotLisJobtStatus_sid: 2,
                    note: "",
                    hourlyrate: $scope.master.annualSalary,
                    annualsalary: $scope.master.annualSalary
                };
                $modalInstance.dismiss('cancel');
                if (typeof $scope.master.vendoremail !== "undefined" && $scope.master.vendoremail) {
                    //alert("dddd1--"+type);
                    $scope.showPopWithEmail(3, "submitted", $scope.master, hotListData, candidate);
                } else {
                    //alert("dddd2--"+type);
                    $scope.showPopNoEmail("submitted", $scope.master, hotListData, candidate);
                }

            }
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        }
    }
]);
