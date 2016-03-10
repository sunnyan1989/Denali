'use strict';

var ReportsControllers = angular.module('ReportsControllers', []);

//Report controller
ReportsControllers.controller('ReportCtrl', ['$scope',
    function($scope) {

    }
]);

ReportsControllers.controller('cm_activitydetailbycmCtrl', ['$scope', '$http', '$modal',
    function($scope, $http, $modal) {

        var today = new Date();
        //var d1 = today.toDateString();
        var d1 = new Date();
        today.setDate(today.getDate() - 7);
        //var d2 = today.toDateString();
        var d2 = today;
        
        //var d2 = oldday.toDateString();
        $scope.reportData = [];
        $scope.no_result_found = false;
        $scope.searchKeys = {
            cm_person_id: {sid: null, name: null},
            begin_date: d2,
            end_date: d1
        };
        $scope.CMList = [{sid: null, name: null}];

        $scope.init = function() {
            // get CM list
            var getCMListStatus = $http.post('services/services_reports/getCMList');
            getCMListStatus.success(function(data) {
                for (var j = 0; j < data.length; j++) {
                    $scope.CMList[j] = {sid: data[j].sid, name: data[j].name};
                }
                $scope.searchKeys.cm_person_id = $scope.CMList[0];
                $scope.search();
            });
        };

        $scope.search = function() {
            $scope.no_result_found = false;
            $http.post('/services/services_reports/report_cm_activitydetailbycm', $scope.searchKeys).success(function(reportlist) {
                var sameCandidate = [];
                var keyIndex;
                $scope.reportData = [];
                for (var i = 0; i < reportlist.length; i++) {
                    keyIndex = reportlist[i].Candidate_name + "/" + reportlist[i].Candidate_skill;
                    if (!sameCandidate.hasOwnProperty(keyIndex)) {
                        sameCandidate[keyIndex] = [];
                        reportlist[i].newName = keyIndex;
                        sameCandidate[keyIndex].push(reportlist[i]);
                    } else {
                        reportlist[i].newName = "";
                        sameCandidate[keyIndex].push(reportlist[i]);
                    }
                    /*if (sameCandidate.indexOf(keyIndex) === -1) {
                     //sameCandidate.push(keyIndex);
                     }else{
                     reportlist[i].Candidate_name = "";
                     reportlist[i].Candidate_skill = "";
                     }*/
                }
                sameCandidate.sort();


                for (var key in sameCandidate) {
                    var values = sameCandidate[key];
                    var length = values.length;

                    var sameJob = [];
                    var sameJobID = [];
                    var sameVendor = [];
                    var sameClient = [];
                    var sameSource = [];
                    var sameJobStatus = [];

                    angular.forEach(values, function(value, key) {
                        //value.rowspan = length;
                        //console.log(key);
                        /*if (sameJob.indexOf(value.jobtitle) === -1) {
                            sameJob.push(value.jobtitle);
                            value.newjobtitle = value.jobtitle;
                        }else{
                            value.newjobtitle = "N/A";
                        }*/
                        
                        if (sameJobID.indexOf(value.HotListJob_sid) === -1) {
                            sameJobID.push(value.HotListJob_sid);
                            value.newjobid = value.HotListJob_sid;
                            value.newjobtitle = value.jobtitle;
                            
                            if(value.jobvendor===""){
                                value.jobvendor = "N/A";
                            }
                            
                            if(value.jobclient===""){
                                value.jobclient = "N/A";
                            }
                            
                            if(value.jobsource===""){
                                value.jobsource = "N/A";
                            }
                            
                            value.newjobvendor = value.jobvendor;
                            value.newjobclient = value.jobclient;
                            value.newjobsource = value.jobsource;
                            value.newjobstatus = value.jobstatus;
                        }else{
                            //value.newjobid = "N/A";
                        }
                        
                        /*if (sameVendor.indexOf(value.jobvendor) === -1) {
                            sameVendor.push(value.jobvendor);
                            value.newjobvendor = value.jobvendor;
                        }else{
                            value.newjobvendor = "N/A";
                        }
                        
                        if (sameClient.indexOf(value.jobclient) === -1) {
                            sameClient.push(value.jobclient);
                            value.newjobclient = value.jobclient;
                        }else{
                            value.newjobclient = "N/A";
                        }
                        
                        if (sameSource.indexOf(value.jobsource) === -1) {
                            sameSource.push(value.jobsource);
                            value.newjobsource = value.jobsource;
                        }else{
                            value.newjobsource = "N/A";
                        }
                        
                        if (sameJobStatus.indexOf(value.jobstatus) === -1) {
                            sameJobStatus.push(value.jobstatus);
                            value.newjobstatus = value.jobstatus;
                        }else{
                            value.newjobstatus = "N/A";
                        }*/

                        $scope.reportData.push(value);
                    });

                    //$scope.reportData.push(value);
                }

                //$scope.reportData = reportlist;
                if (reportlist.length < 1) {
                    $scope.no_result_found = true;
                }

            });
        };

        // Initialize scope
        $scope.init();

    }
]);

ReportsControllers.controller('cm_activitybyvendorCtrl', ['$scope', '$http', '$modal',
    function($scope, $http, $modal) {

        //$scope.curStatus = $scope.statusData[0];
        $scope.reportData = [];
        $scope.no_result_found = false;
        $scope.searchKeys = {
            job_status: {sid: null, name: null},
            vendor_i: null
        };
        $scope.JobStatusList = [{sid: null, name: null}];
        $scope.VendorList = [];

        $scope.init = function(done) {
            // get candidate list
            var getJobStatusList = $http.post('services/services_reports/getJobStatusList');
            getJobStatusList.success(function(data) {
                $scope.JobStatusList[0] = {sid: null, name: "All Job Status"};
                for (var j = 0; j < data.length; j++) {
                    $scope.JobStatusList[j + 1] = {sid: data[j].sid, name: data[j].name};
                }
                $scope.searchKeys.job_status = $scope.JobStatusList[0];
            });

            // get Vendor list
            var getVendorList = $http.post('services/services_reports/getDistinctVendorList');
            getVendorList.success(function(data) {
                $scope.VendorList[0] = "All Vendors";
                for (var j = 0; j < data.length; j++) {
                    $scope.VendorList[j + 1] = data[j].vendor;
                }
                $scope.searchKeys.vendor_i = $scope.VendorList[0];
                //console.log($scope.VendorList);
            });

            done();

        };

        $scope.search = function() {
            $scope.no_result_found = false;
            $http.post('/services/services_reports/report_cm_jobsbyvendor', $scope.searchKeys).success(function(reportlist) {
                $scope.reportData = reportlist;
                if (reportlist.length < 1) {
                    $scope.no_result_found = true;
                }
                //console.log(reportlist);
            });
        };

        $scope.init(function() {
            $scope.search();
        });

    }
]);

ReportsControllers.controller('cm_activitybycmCtrl', ['$scope', '$http', '$modal',
    function($scope, $http, $modal) {

        //$scope.curStatus = $scope.statusData[0];
        $scope.reportData = [];
        $scope.no_result_found = false;
        $scope.searchKeys = {
            cm_person_id: {sid: null, name: null},
            candidate_id: {sid: null, name: null},
            candidate_status: {sid: null, name: null},
            begin_date: null,
            end_date: null
        };
        $scope.CandidateList = [{sid: null, name: null}];
        $scope.CMList = [{sid: null, name: null}];
        $scope.CandStatusList = [{sid: null, name: null}];

        $scope.init = function(done) {
            // get candidate list
            var getCandidateListStatus = $http.post('services/services_reports/getCandidateList');
            //console.log("start candidate");
            getCandidateListStatus.success(function(data) {
                $scope.CandidateList[0] = {sid: null, name: "All Candidates"};
                for (var j = 0; j < data.length; j++) {
                    $scope.CandidateList[j + 1] = {sid: data[j].sid, name: data[j].name};
                }
                $scope.searchKeys.candidate_id = $scope.CandidateList[0];
                //console.log("got candidate");
            });

            // get CM list
            var getCMListStatus = $http.post('services/services_reports/getCMList');
            //console.log("start cm");
            getCMListStatus.success(function(data) {
                //$scope.CMList[0] = {sid: null, name: "All CMs"};
                for (var j = 0; j < data.length; j++) {
                    $scope.CMList[j] = {sid: data[j].sid, name: data[j].name};
                }
                $scope.searchKeys.cm_person_id = $scope.CMList[0];
                //console.log("got cm");
                $scope.search();
            });

            // get Candidate Status list
            var getCandStatusList = $http.post('services/services_reports/getCandStatusList');
            //console.log("start status");
            getCandStatusList.success(function(data) {
                $scope.CandStatusList[0] = {sid: null, name: "All Status"};
                for (var j = 0; j < data.length; j++) {
                    $scope.CandStatusList[j + 1] = {sid: data[j].sid, name: data[j].name};
                }
                $scope.searchKeys.candidate_status = $scope.CandStatusList[0];
                //console.log("got status");
            });
        };

        $scope.search = function() {
            $scope.no_result_found = false;
            //console.log("search - ");
            $http.post('/services/services_reports/report_cm_activitybycm', $scope.searchKeys).success(function(reportlist) {
                $scope.reportData = reportlist;
                if (reportlist.length < 1) {
                    $scope.no_result_found = true;
                }
                //console.log(reportlist);
            });
        };

        // Initialize scope
        //$scope.init().success(function() {
        $scope.init();
        //$scope.search();
        //});

    }
]);

ReportsControllers.controller('cm_activitybycandidateCtrl', ['$scope', '$http', '$modal',
    function($scope, $http, $modal) {

        $scope.curStatus = $scope.statusData[0];
        //$scope.CandidateList = [];
        //$scope.CMList = [];
        $scope.reportData = [];
        $scope.no_result_found = false;
        $scope.searchKeys = {
            statusSid: $scope.curStatus.value,
            //candidate_id: [],
            //cm_person_id: [],
            begin_date: null,
            end_date: null
        };
        $scope.CandidateList = [{
                sid: "",
                name: ""
            }];

        $scope.CMList = [{
                sid: "",
                name: ""
            }];

        $scope.init = function(done) {
            var promises = [];
            // get candidate list
            var getCandidateListStatus = $http.post('services/services_reports/getCandidateList');
            promises.push(getCandidateListStatus);
            getCandidateListStatus.success(function(data) {
                $scope.CandidateList[0] = {sid: null, name: "All Candidates"};
                for (var j = 0; j < data.length; j++) {
                    $scope.CandidateList[j + 1] = {sid: data[j].sid, name: data[j].name};
                }
                //$scope.CandidateList.splice(0, 1);
                $scope.searchKeys.candidate_id = $scope.CandidateList[0];
            });


            // get CM list
            var getCMListStatus = $http.post('services/services_reports/getCMList');
            promises.push(getCMListStatus);
            getCMListStatus.success(function(data) {
                //console.log(data);
                $scope.CMList[0] = {sid: null, name: "All CMs"};
                for (var j = 0; j < data.length; j++) {
                    $scope.CMList[j + 1] = {sid: data[j].sid, name: data[j].name};
                }
                //$scope.CMList.splice(0, 1);
                $scope.searchKeys.cm_person_id = $scope.CMList[0];
            });
        };

        $scope.search = function() {
            $scope.no_result_found = false;
            $scope.searchKeys.statusSid = $scope.curStatus.value;
            if ($scope.curStatus.value === "0")
                $scope.searchKeys.statusSid = "";

            $http.post('/services/services_reports/report_cm_activitybycandidate', $scope.searchKeys).success(function(reportlist) {
                $scope.reportData = reportlist;
                if (reportlist.length < 1) {
                    $scope.no_result_found = true;
                }
            });
        };

        // Initialize scope
        //$scope.init(function() {
        $scope.init();
        $scope.search();
        //});

    }
]);
