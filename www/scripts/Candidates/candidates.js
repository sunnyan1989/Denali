'use strict';
//Candidate controllers
var candidateControllers = angular.module('CandidateControllers', []);

candidateControllers.factory('Data', function() {
    var data =
            {
                candidateSid: "",
                lessbaseinfo: "Please add basic person information first",
                changesuccess: "Changes saved successfully.",
                db_error: "Database error, Please try again later."
            };

    return {
        getCandidateSid: function() {
            return data.candidateSid;
        },
        getAlertMessage: function() {
            return data.lessbaseinfo;
        },
        getDBMessage: function() {
            return data.db_error;
        },
        getSuccessMessage: function() {
            return data.changesuccess;
        },
        setCandidateSid: function(candidate_sid) {
            data.candidateSid = candidate_sid;
        }
    };

});

candidateControllers.controller('CandidateListCtrl', ['$scope', '$http', '$modal',
    function($scope, $http, $modal) {

        $scope.curStatus = $scope.statusData[1];
        $scope.candidateData = [];
        $scope.page_ishow = true;
        //$scope.no_result_found = false;
        $scope.searchKeys = {
            statusSid: $scope.curStatus.value,
            name: "",
            state: "",
        };
        $scope.search = function() {
            $scope.no_result_found = false;
            $scope.searchKeys.statusSid = $scope.curStatus.value;
            if ($scope.curStatus.value === "0")
                $scope.searchKeys.statusSid = "";
            $http.post('/services/candidates', $scope.searchKeys).success(function(candidate) {

                if (candidate.msg) {
                    $scope.notify('error', candidate.msg);
                }

                $scope.candidateData = candidate;

                if (candidate.length < 1) {
                    $scope.no_result_found = true;
                }

                $scope.page_ishow = false;
            });
        };
        $scope.search();
    }
]);


candidateControllers.controller('HotlistCtrl', ['$scope', '$http', '$q', "Data", "$modal", '$filter',
    function($scope, $http, $q, Data, $modal, $filter) {

        $scope.curStatus = $scope.statusData[1];
        $scope.page_ishow = true;

        $(".mycandidates li").first().removeClass("active");

        //$scope.collapsed = true;

        $scope.list = [{
                sid: "",
                candidate: "",
                candidateskill: "",
                title: "",
                HotList_sid: "",
                assign_sid: "",
                assigned_cmperson: "",
                assgin_status: "",
                Found: "",
                New: "",
                Submitted: "",
                Responded: "",
                Selected: "",
                Closed: "",
                Rejected: "",
                Inactive: "",
                CountFound: 0,
                CountNew: 0,
                CountSubmitted: 0,
                CountResponded: 0,
                CountSelected: 0,
                CountClosed: 0,
                CountRejected: 0,
                CountInactive: 0,
                items: []
            }];

        $scope.list1 = [];

        $scope.search = function() {

            $scope.searchKeys = {
                statusSid: $scope.curStatus.value,
                name: "",
                skill: "",
                state: "",
            };

            //alert($scope.curStatus.value);

            $http.post('/services/candidates/hotList', $scope.searchKeys).success(function(result) {
               // console.log(result);

                if (result.msg) {
                    $scope.notify('error', result.msg);
                }

                $scope.page_ishow = false;
                $scope.no_result_found = false;

                if (typeof result[0].hotlist_id !== "undefined") {

                    $scope.HotList_sid = result[0].hotlist_id;
                } else {
                    $scope.HotList_sid = result[0].HotList_sid;
                    //alert(result[0].HotList_sid);
                }

                for (var i = 0; i < result.length; i++) {
                    result[i].title = result[i].candidate + " as " + result[i].candidateskill + ", and is assigned to " + result[i].Total + " people.";
                    if (i === 0) {
                        $scope.list[result[i].sid] = {sid: result[i].sid, candidate: result[i].candidate, personskillsid: result[i].Person_Skill_sid, candidateskill: result[i].candidateskill, second: false, collapsed: false, ishow: true, picture: result[i].candidate_picture, title: result[i].title, HotList_sid: result[i].HotList_sid, assign_sid: result[i].assign_sid, assigned_cmperson: result[i].assigned_cmperson, CountFound: 0, CountNew: 0, CountSubmitted: 0, CountResponded: 0, CountSelected: 0, CountClosed: 0, CountRejected: 0, CountInactive: 0, items: []};
                        //if (result[i].assigned_cmperson) {
                        //}
                    }
                    var index = $scope.findById($scope.list, result[i].sid);
                    //alert(index);
                    if (index === 0) {
                        $scope.list[result[i].sid] = {sid: result[i].sid, candidate: result[i].candidate, personskillsid: result[i].Person_Skill_sid, candidateskill: result[i].candidateskill, second: false, collapsed: false, ishow: true, picture: result[i].candidate_picture, title: result[i].title, HotList_sid: result[i].HotList_sid, assign_sid: result[i].assign_sid, assigned_cmperson: result[i].assigned_cmperson, CountFound: 0, CountNew: 0, CountSubmitted: 0, CountResponded: 0, CountSelected: 0, CountClosed: 0, CountRejected: 0, CountInactive: 0, items: []};
                        if (result[i].assigned_cmperson) {
                            //alert($scope.list[result[i].sid].CountFound);
                            $scope.list[result[i].sid].CountFound = $scope.list[result[i].sid].CountFound + result[i].Found;
                            $scope.list[result[i].sid].CountNew = $scope.list[result[i].sid].CountNew + result[i].New;
                            $scope.list[result[i].sid].CountSubmitted = $scope.list[result[i].sid].CountSubmitted + result[i].Submitted;
                            $scope.list[result[i].sid].CountResponded = $scope.list[result[i].sid].CountResponded + result[i].Responded;
                            $scope.list[result[i].sid].CountSelected = $scope.list[result[i].sid].CountSelected + result[i].Selected;
                            $scope.list[result[i].sid].CountClosed = $scope.list[result[i].sid].CountClosed + result[i].Closed;
                            $scope.list[result[i].sid].CountRejected = $scope.list[result[i].sid].CountRejected + result[i].Rejected;
                            $scope.list[result[i].sid].CountInactive = $scope.list[result[i].sid].CountInactive + result[i].Inactive;

                            $scope.list[result[i].sid].items.push({id: i, sid: result[i].sid, candidate: result[i].candidate, cmp_sid: result[i].cmp_sid, assigned_userid: result[i].assigned_userid, picture: result[i].assigned_picture, second: true, assgin_status: result[i].assgin_status, HotList_sid: result[i].HotList_sid, assign_sid: result[i].assign_sid, assigned_cmperson: result[i].assigned_cmperson, title: result[i].assigned_cmperson + " - " + result[i].assgin_status, Found: result[i].Found, New: result[i].New, Submitted: result[i].Submitted, Responded: result[i].Responded, Selected: result[i].Selected, Closed: result[i].Closed, Rejected: result[i].Rejected, Inactive: result[i].Inactive, items: []});
                        }

                    } else {
                        if (result[i].assigned_cmperson) {
                            $scope.list[result[i].sid].CountFound = $scope.list[result[i].sid].CountFound + result[i].Found;
                            $scope.list[result[i].sid].CountNew = $scope.list[result[i].sid].CountNew + result[i].New;
                            $scope.list[result[i].sid].CountSubmitted = $scope.list[result[i].sid].CountSubmitted + result[i].Submitted;
                            $scope.list[result[i].sid].CountResponded = $scope.list[result[i].sid].CountResponded + result[i].Responded;
                            $scope.list[result[i].sid].CountSelected = $scope.list[result[i].sid].CountSelected + result[i].Selected;
                            $scope.list[result[i].sid].CountClosed = $scope.list[result[i].sid].CountClosed + result[i].Closed;
                            $scope.list[result[i].sid].CountRejected = $scope.list[result[i].sid].CountRejected + result[i].Rejected;
                            $scope.list[result[i].sid].CountInactive = $scope.list[result[i].sid].CountInactive + result[i].Inactive;

                            $scope.list[result[i].sid].items.push({id: i, sid: result[i].sid, candidate: result[i].candidate, cmp_sid: result[i].cmp_sid, assigned_userid: result[i].assigned_userid, picture: result[i].assigned_picture, second: true, assgin_status: result[i].assgin_status, HotList_sid: result[i].HotList_sid, assign_sid: result[i].assign_sid, assigned_cmperson: result[i].assigned_cmperson, title: result[i].assigned_cmperson + " - " + result[i].assgin_status, Found: result[i].Found, New: result[i].New, Submitted: result[i].Submitted, Responded: result[i].Responded, Selected: result[i].Selected, Closed: result[i].Closed, Rejected: result[i].Rejected, Inactive: result[i].Inactive, items: []});
                        }
                    }
                }



                for (var j = 0; j < $scope.list.length; j++) {
                    if (typeof $scope.list[j] !== "undefined") {
                        $scope.list1.push($scope.list[j]);
                    }
                }

                $scope.list1.splice(0, 1);

                if ($scope.list1.length === 0) {
                    $scope.no_result_found = true;
                }

                //alert("search");

            });
        };

        $scope.filterHotListData = function() {

            for (var i = 0; i < $scope.list1.length; i++) {
                var filterKeywords = $scope.filterKeywords.toLowerCase();
                var title = $scope.list1[i].title.toLowerCase();
                // alert(filterKeywords + "--" + title);
                var whereint = title.indexOf(filterKeywords);
                if (whereint < 0) {
                    $scope.list1[i].ishow = false;
                } else {
                    $scope.list1[i].ishow = true;
                }
            }

        };

        $scope.findById = function(source, sid) {
            var exits = 0;
            //for (var i = 1; i <= source.length; i++) {
            if (typeof source[sid] !== "undefined" && source[sid].sid === sid) {
                exits = 1;
            }
            // }
            return exits;
        }

        $scope.search();

        $scope.$on('mynotify', function(event, result) {
            $scope.notify('success', Data.getSuccessMessage());
            if (result === "search") {
                $scope.search();
            }

        });

        $scope.$on('dbnotify', function(event, result) {
            $scope.notify('error', Data.getDBMessage());
        });

        $scope.$on('searchnotify', function(event, result) {

            $scope.search();
        });

        $scope.$on('UPDATE_PARENT_HOTLIST', function(event, type, hotlistid, data, item) {
            // $scope.search();
            //alert(hotlistid);
            //console.log("getSingleAssignment");
            //console.log(item);
            if (type === "addAssign") {

                $scope.searchKeys = {
                    /*HotListAssignment_id: data[0].hotlistassignment_sid*/
                    HotListItem_sid: data.HotListItem_sid
                };

                $http.post('/services/candidates/getSingleAssignment', $scope.searchKeys).success(function(result) {

                    $scope.list[result[0].HotListItem_sid].items = [];

                    for (var i = 0; i < result.length; i++) {
                        $scope.list[result[i].HotListItem_sid].items.push({id: 0, cmp_sid: result[i].Person_sid, candidate: item.candidate, assigned_userid: result[i].assigned_userid, sid: result[i].HotListItem_sid, picture: result[i].cm_picture, second: true, assgin_status: result[i].status, HotList_sid: result[i].HotList_sid, assign_sid: result[i].sid, assigned_cmperson: result[i].cm_person, title: result[i].cm_person + " - " + result[i].status, Found: 0, New: 0, Submitted: 0, Responded: 0, Selected: 0, Closed: 0, Rejected: 0, Inactive: 0, items: []});
                    }

                    for (var j = 0; j < $scope.list.length; j++) {
                        if (typeof $scope.list[j] !== "undefined") {
                            //console.log($scope.list1);
                            if ($scope.list[j].sid == result[0].HotListItem_sid) {
                                var length = $scope.list[result[0].HotListItem_sid].items.length;
                                var length1 = $scope.list.length;
                                //alert(j);
                                $scope.list[j].collapsed = true;
                                $scope.list[j].title = $scope.list[j].title.replace(/assigned to[\s\S]+?people/i, 'assigned to ' + length + ' people');
                            }
                            $scope.list1.push($scope.list[j]);
                        }
                    }

                    $scope.list1.splice(0, 1);

                });


            } else if (type === "addHostList") {

                $scope.searchKeys = {
                    HotListItem_sid: data[0].hotlistitem_sid
                };

                $http.post('/services/candidates/getSingleHotItem', $scope.searchKeys).success(function(result) {
                    //console.log(result);
                    var title = result[0].candidate + " as " + result[0].candidateskill + ", and is assigned to 0 people.";
                    $scope.list[result[0].sid] = {sid: result[0].sid, candidate: result[0].candidate, second: false, collapsed: false, ishow: true, personskillsid: result[0].Person_Skill_sid, picture: result[0].can_picture, title: title, HotList_sid: result[0].HotList_sid, assign_sid: "", assigned_cmperson: "", CountFound: 0, CountNew: 0, CountSubmitted: 0, CountResponded: 0, CountSelected: 0, CountClosed: 0, CountRejected: 0, CountInactive: 0, items: []};
                    $scope.list1.push($scope.list[result[0].sid]);
                });

                $scope.no_result_found = false;

            }
        });

        $scope.updateAssignStatus = function(scope, item, indexid) {

            if (item.assgin_status === "Inactive") {
                var statusid = 1;
                item.assgin_status = "New";
                var e_id = {cm_sid: null, eid: 6};
            } else {
                var statusid = 6;
                item.assgin_status = "Inactive";
                var e_id = {cm_sid: null, eid: 7};
            }

            $scope.values = {
                HotList_sid: item.HotList_sid,
                HotListAssignment_sid: item.assign_sid,
                newHotListStatus_sid: statusid
            }

            $http.post('/services/candidates/updateItemStatus', $scope.values).success(function(result) {

                for (var i = 0; i < $scope.list.length; i++) {
                    if ($scope.list1[i].sid === item.sid) {
                        $scope.list1[i].items[indexid].assgin_status = item.assgin_status;
                        $scope.list1[i].items[indexid].title = item.assigned_cmperson + " - " + item.assgin_status
                    }
                }

            });

            //var name = $scope.loggedInUser.name;
            //var mailist = "";

            if (item.assigned_userid) {
                // mailist.push(item.assigned_userid);
                //mailist = item.assigned_userid;
                var canceler = $q.defer();
                $http.post('/services/candidates/sendAssignedEmails/', {item: item, datalist: e_id});
                canceler.resolve();
            }



            /*$http.post('services/my-candidates/getEmailTemplate', {item: item, datalist: e_id})
             .success(function(result) {
             if (!result.err) {
             var subject = result[0].subject;
             var body = result[0].body;
             body = body.replace("<<username>>", item.assigned_cmperson);
             body = body.replace("<<candidatename>>", item.candidate);
             body = body.replace(/\\n\\n/g, "<br /><br />");
             body = body.replace(/\n\n/g, "<br /><br />");
             
             var options = {
             mail_to: mailist,
             mail_subject: subject,
             mail_content: body
             };
             
             $http.post('/services/candidates/sendMail/', {options: options});
             }
             }).error(function() {
             //$scope.notify('error', 'Server error');
             });*/

            //if (item.assgin_status !== "Inactive") {
            //scope.remove();
            //}

        };

        $scope.updateHotListStatus = function(scope, item, indexid) {

            var statusid = 2;

            $scope.values = {
                HotList_sid: item.HotList_sid,
                HotListItem_sid: item.sid,
                newHotListStatus_sid: statusid
            };

            //alert(item.sid);

            $http.post('/services/candidates/updateHotListStatus', $scope.values).success(function(result) {

                if (result.msg) {
                    $scope.$parent.$broadcast('dbnotify', "");
                } else {


                    if ($scope.list1.length === 1) {
                        $scope.$parent.$broadcast('mynotify', "search");
                    } else {
                        $scope.$parent.$broadcast('mynotify', "");
                    }
                    scope.remove();
                }
            });

        };

        $scope.addAssignPerson = function(HotList_sid, item) {
            //console.log(item);
            var name = $scope.loggedInUser.name;

            var modalInstance;
            modalInstance = $modal.open({
                backdrop: true,
                windowClass: 'app-modal-window',
                templateUrl: "views/addCM.html",
                controller: function($scope, Data, $http, $modalInstance, $log) {

                    $scope.HotList_sid = HotList_sid;
                    $scope.HotListItem_sid = item.sid;
                    $scope.candidateData = []
                    $http.post('/services/candidates/getCMList', []).success(function(candidate) {
                        //console.log(item);
                        for (var i = 0; i < candidate.length; i++) {
                            candidate[i].ishow = true;
                            for (var j = 0; j < item.items.length; j++) {
                                //alert(item.items[j].cmp_sid + "--" + candidate[i].sid);
                                if (item.items[j].cmp_sid === candidate[i].sid) {
                                    candidate[i].ishow = false;
                                }
                            }
                            if (candidate[i].ishow) {
                                $scope.candidateData.push(candidate[i]);
                            }
                        }

                    });

                    $scope.save = function(formId) {

                        $scope.listids = {
                            HotList_sid: $scope.HotList_sid,
                            HotListItem_sid: "",
                            Person_sid: ""
                        };

                        $scope.listids.HotList_sid = $('#' + formId).find("input[name='HotList_sid']").val();
                        $scope.listids.HotListItem_sid = $('#' + formId).find("input[name='HotListItem_sid']").val();

                        var ids = [];
                        var mailist = [];

                        $(".Person_sid").each(function(index, value) {
                            //alert(value);
                            var vals = $(this).val();
                            if (vals) {
                                //alert(index);
                                var mailvalue = $(".Person_email_" + index).val();
                                //alert(mailvalue);
                                ids.push(vals);
                                mailist.push(mailvalue);
                            }
                            //console.log(index + ": " + $(this).text());
                        });

                        $scope.listids.Person_sid = ids;
                        var e_id = {cm_sid: null, eid: 6};

                        $http.post('services/my-candidates/getEmailTemplate', {datalist: e_id})
                                .success(function(result) {
                                    if (!result.err) {
                                        var subject = result[0].subject;
                                        var body = result[0].body;
                                        body = body.replace("<<username>>", name);
                                        body = body.replace("<<candidatename>>", item.candidate);
                                        body = body.replace(/\\n\\n/g, "<br /><br />");
                                        body = body.replace(/\n\n/g, "<br /><br />");
                                        var options = {
                                            mail_to: mailist,
                                            mail_subject: subject,
                                            mail_content: body,
                                            assign: true
                                        };

                                        $http.post('/services/candidates/sendMail/', {options: options});
                                    }
                                }).error(function() {
                            //$scope.notify('error', 'Server error');
                        });

                        $http.post('/services/candidates/addAssignment', $scope.listids).success(function(result) {
                            $modalInstance.dismiss('cancel');
                            $scope.$parent.$broadcast('UPDATE_PARENT_HOTLIST', "addAssign", HotList_sid, result, item);
                            $scope.$parent.$broadcast('mynotify', result[0]);
                        });

                    };
                    $scope.assignmentData = [];
                    $scope.add = function(person) {
                        //alert("add");
                        if ($scope.assignmentData.indexOf(person) === -1) {
                            $scope.assignmentData.push(person);
                        }

                        $scope.assignmentcount = $scope.assignmentData.length;
                    };

                    $scope.removed = function(singleData) {
                        $scope.assignmentData.splice($scope.assignmentData.indexOf(singleData), 1);
                        if ($scope.assignmentData.length < 1) {
                            $scope.assignmentcount = "";
                        }
                    };

                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                    hotlist: function() {
                        return $scope.hotlist;
                    }
                }
            });
        };

        $scope.dupHotList = function() {
            $http.post('/services/candidates/dupHotList', {}).success(function(result) {
                if (result.msg) {
                    $scope.$parent.$broadcast('dbnotify', "");
                } else {
                    $scope.$parent.$broadcast('mynotify', "");
                    $scope.search();
                }
            });
        };

        $scope.toggleAll = function(flag) {

            for (var j = 0; j < $scope.list1.length; j++) {
                if ($scope.list1[j].second === false) {
                    $scope.list1[j].collapsed = flag;
                }
            }

        };

        $scope.togglecollapse = function(index) {
            $scope.list[index].collapsed = $scope.list[index].collapsed === false ? true : false;
        };

        $scope.addHostList = function(hl_sid, hotdatalist) {

            //console.log("$scope.list1");

            var hotdatalist = $scope.list1;

            var modalInstance;
            modalInstance = $modal.open({
                backdrop: true,
                windowClass: 'modal',
                templateUrl: "views/addCandidate.html",
                controller: function($scope, Data, $http, $modalInstance, $log) {

                    $scope.HotList_sid = hl_sid;
                    //alert(hl_sid);
                    $scope.hotdatalist = hotdatalist;
                    //console.log($scope.hotdatalist);
                    $scope.save = function(formId) {

                        $scope.listids = {
                            HotList_sid: $scope.HotList_sid,
                            ids: []
                        };
                        $('#' + formId).find("input[name='Person_Skill_sid[]']").each(function(idx, input) {
                            //alert($(input).val());
                            $scope.listids.ids[idx] = $(input).val();
                        });
                        //console.log($scope.listids);
                        $http.post('/services/candidates/addHostListItem', $scope.listids).success(function(result) {

                            $scope.$parent.$broadcast('UPDATE_PARENT_HOTLIST', "addHostList", hl_sid, result, "");
                            $scope.$parent.$broadcast('mynotify', result[0]);
                            $modalInstance.dismiss('cancel');
                        });
                    };

                    $scope.skills = [];
                    $scope.add = function(skill) {
                        //console.log(skill);
                        skill.jobname = $scope.jobname;
                        if ($scope.skills.indexOf(skill) === -1) {
                            $scope.skills.push(skill);
                        }
                        $scope.skillscount = $scope.skills.length;
                        //$scope.skill.push(skillObejct);
                    };

                    $scope.removed = function(singleSkill) {
                        $scope.skills.splice($scope.skills.indexOf(singleSkill), 1);
                        if ($scope.skills.length < 1) {
                            $scope.skillscount = "";
                        }
                    };

                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                    contact: function() {
                        return $scope.contact;
                    }
                }
            });

        };

    }
]);

candidateControllers.controller('CandidateNewCtrl', ["$scope", "Data", "$routeParams", "$http", "$modal", "$log", "FileUploader",
    function($scope, Data, $routeParams, $http, $modal, $log, FileUploader) {
        //open base information modal window
        if (typeof $routeParams.sid !== 'undefined') {

            $scope.Keys = {
                sid: $routeParams.sid
            };

            $scope.editName = false;

            $http.post('/services/candidates/getPersonInfo', $scope.Keys).success(function(persondata) {
                //$scope.person.candidate_sid = persondata[0].sid;

                if (persondata[0].birthday === "0000-00-00") {
                    persondata[0].birthday = "";
                }

                if (persondata[0].linkedin === "null") {
                    persondata[0].linkedin = "";
                }

                $scope.person = persondata[0];
                $scope.person.candidate_sid = $routeParams.sid;
                $scope.master = angular.copy($scope.person);
                $scope.$watch('person.candidate_sid', function(newValue) {
                    //alert(newValue);
                    if (newValue)
                        Data.setCandidateSid(newValue);
                });
            });

        }

        $scope.$on('mynotify', function(event, result) {
            $scope.editName = false;
            $scope.notify('success', Data.getSuccessMessage());
        });

        /*$scope.$on('dbnotify', function(event, result) {
         $scope.notify('error', Data.getDBMessage());
         });*/

        $scope.$on('dbnotify', function(event, result) {
            $scope.notify('error', result);
        });

        $scope.uploader = new FileUploader({
            url: '/services/candidates/updatePersonPicture'
        });

        $scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function(item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });


        $scope.NameUpdate = function() {
            $scope.editName = true;
        }

        $scope.submit = function(person) {

            var candidateSid = Data.getCandidateSid();
            if (parseInt(candidateSid) > 0) {
                //alert(candidateSid);
                $scope.person.sid = candidateSid;
                $scope.person.action = "Update";
            } else {
                $scope.person.action = "New";
            }

            $scope.uploader.onCompleteItem = function(item, result) {
                if (result.err) {
                    //alert(result.err);
                    //$modalInstance.close(result);
                }
                else {

                    $scope.person.picturelink = result.picturelink;
                    $http.post('/services/candidates/addNew', $scope.person).success(function(candidate) {
                        $scope.person.candidate_sid = candidate[0].candidate_sid;
                        var newValue = candidate[0].candidate_sid;
                        $scope.$watch('person.candidate_sid', function(newValue) {
                            if (newValue)
                                Data.setCandidateSid(newValue);
                        });
                        $scope.$parent.$broadcast('mynotify', "");
                    });

                }
            };
            //$scope.master = angular.copy($scope.person);
            var queueLength = $scope.uploader.queue.length;

            if (queueLength) {
                var item = $scope.uploader.queue[queueLength - 1]; // upload last item in queue	
                item.upload();
            } else {

                //alert($scope.person.action);
                $http.post('/services/candidates/addNew', $scope.person).success(function(candidate) {
                    $scope.person.candidate_sid = candidate[0].candidate_sid;
                    var newValue = candidate[0].candidate_sid;
                    $scope.$watch('person.candidate_sid', function(newValue) {
                        if (newValue)
                            Data.setCandidateSid(newValue);
                    });
                    $scope.$parent.$broadcast('mynotify', "");
                });
            }

        };

        $scope.reset = function() {
            $scope.person = angular.copy($scope.master);
            $scope.baseInfoForm.$setPristine();
            $scope.uploader.queue[$scope.uploader.queue.length - 1].file.name = "";
        }
        // end base information modal window

    }
]).controller('CollapseContact', ["$scope", "Data", "$routeParams", "$http", "$modal", "$log",
    function($scope, Data, $routeParams, $http, $modal, $log) {
        $scope.custom = false;

        if (typeof $routeParams.sid !== 'undefined') {
            $scope.Keys = {
                sid: $routeParams.sid,
                isprimary: null
            };
            $scope.contactData = [];

            $http.post('/services/candidates/getContactList', $scope.Keys).success(function(contactdata) {
                $scope.custom = true;
                $scope.contactData = contactdata;
            });
        } else {
            $scope.Keys = {
                sid: Data.getCandidateSid(),
                isprimary: false
            };
        }

        $scope.$on('UPDATE_PARENT_CONTACT', function(event, data) {
            //alert(data);
            if (data === "false") {
                $scope.Keys.isprimary = null;
                $scope.custom = false;
                $scope.Keys.sid = Data.getCandidateSid();
            } else {
                $scope.Keys.isprimary = null;
                $scope.custom = true;
                $scope.Keys.sid = Data.getCandidateSid();
            }

            $scope.contactData = [];

            $http.post('/services/candidates/getContactList', $scope.Keys).success(function(contactdata) {
                //$scope.custom = true;
                $scope.contactData = contactdata;
            });
        });

        $scope.togglecollapse = function() {
            $scope.custom = $scope.custom === false ? true : false;
            var isprimary = $scope.custom === false ? null : true;

            $scope.Keys = {
                sid: Data.getCandidateSid(),
                isprimary: isprimary
            };
        };

        $scope.open = function(contact) {

            var length = Object.keys(contact).length;

            if (Data.getCandidateSid() === "") {
                /*$scope.notify('dbnotify', Data.getAlertMessage());*/
                $scope.$parent.$broadcast('dbnotify', Data.getAlertMessage());
                return;
            }
            if (length > 0) {
                //$scope.master = contact;
                $scope.master = angular.copy(contact);
            }

            var modalInstance;
            modalInstance = $modal.open({
                backdrop: true,
                windowClass: 'modal',
                templateUrl: "views/newContact.html",
                controller: function($scope, Data, $http, $modalInstance, $log) {

                    if (length > 0) {
                        //$scope.master = contact;
                        $scope.master = angular.copy(contact);
                        $scope.master.action = "Update";
                        if ($scope.master.isprimary === 1) {
                            $scope.master.isprimary = "true";
                        } else {
                            $scope.master.isprimary = "false";
                        }

                        if ($scope.master.email_work === "null") {
                            //alert($scope.contact.email_work);
                            $scope.master.email_work = "";
                        }

                        if ($scope.master.email_emergency === "null") {
                            $scope.master.email_emergency = "";
                        }

                    } else {
                        $scope.master = {
                            isprimary: "",
                            action: "",
                            person_sid: ""
                        };
                        $scope.master.isprimary = "true";
                        $scope.master.action = "New";
                        $scope.master.person_sid = Data.getCandidateSid();
                    }

                    $scope.submit = function(contact) {
                        $scope.contact = contact;
                        $http.post('/services/candidates/newContact', $scope.contact).success(function(result) {
                            //alert("contact.isprimary--"+contact.isprimary)
                            $scope.$parent.$broadcast('UPDATE_PARENT_CONTACT', contact.isprimary);
                            $modalInstance.dismiss('cancel');
                            $scope.$parent.$broadcast('mynotify', result[0]);
                        });
                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                    contact: function() {
                        return $scope.contact;
                    }
                }
            });

        };
        // end Contact modal window

    }
]).controller('CollapseEducation', ["$scope", "Data", "$routeParams", "$http", "$modal", "$log", "$filter",
    function($scope, Data, $routeParams, $http, $modal, $log, $filter) {
        //$scope.custom = false;

        if (typeof $routeParams.sid !== 'undefined') {
            $scope.Keys = {
                sid: $routeParams.sid,
                isprimary: null
            };
            $http.post('/services/candidates/getEducationList', $scope.Keys).success(function(educationdata) {
                $scope.educationData = educationdata;
            });
        } else {
            $scope.Keys = {
                sid: Data.getCandidateSid(),
                isprimary: null
            };
        }

        $scope.$on('UPDATE_PARENT_EDUCATION', function(event, data) {
            $scope.Keys.sid = Data.getCandidateSid();
            $http.post('/services/candidates/getEducationList', $scope.Keys).success(function(educationdata) {
                $scope.educationData = educationdata;
            });
        });

        // open Contact modal window
        $scope.open = function(education) {
            var length = Object.keys(education).length;
            if (Data.getCandidateSid() === "") {
                $scope.$parent.$broadcast('dbnotify', Data.getAlertMessage());
                return;
            }
            if (length > 0) {
                //$scope.education = education;
                $scope.master = angular.copy(education);
            }

            var modalInstance;
            modalInstance = $modal.open({
                backdrop: true,
                windowClass: 'modal',
                templateUrl: "views/newEducation.html",
                controller: function($scope, Data, $http, $modalInstance, $log) {

                    if (length > 0) {
                        //$scope.education = education;
                        $scope.master = angular.copy(education);
                        $scope.master.action = "Update";
                        $scope.master.MajorTypeData = [];
                        $scope.master.DegreeTypeData = [];
                        $scope.master.MajorType = education.MajorType_sid;
                        $scope.master.DegreeType = education.DegreeType_sid;

                    } else {
                        $scope.master = {
                            MajorTypeData: [],
                            DegreeTypeData: [],
                            action: "",
                            person_sid: ""
                        };
                        $scope.master.action = "New";
                        $scope.master.person_sid = Data.getCandidateSid();
                    }

                    $http.post('/services/candidates/getMajorType', []).success(function(majortypedata) {
                        for (var i = 0; i < majortypedata.length; i++) {
                            $scope.master.MajorTypeData[parseInt(majortypedata[i].sid)] = majortypedata[i].name;
                        }
                    });

                    $http.post('/services/candidates/getDegreeType', []).success(function(degreetypedata) {
                        for (var i = 0; i < degreetypedata.length; i++) {
                            $scope.master.DegreeTypeData[parseInt(degreetypedata[i].sid)] = degreetypedata[i].name;
                        }
                    });

                    if (length > 0) {
                        $scope.master.MajorType = education.MajorType_sid;
                        $scope.master.DegreeType = education.DegreeType_sid;
                    }

                    $scope.submit = function(education) {
                        $scope.education = education;
                        //education.graduationdate = $filter('date')(education.graduationdate,'yyyy-MM-dd'); 
                        //alert(education.graduationdate);
                        //$scope.education.person_sid = Data.getCandidateSid();
                        $scope.education.MajorType_sid = $scope.education.MajorType;
                        $scope.education.DegreeType_sid = $scope.education.DegreeType;
                        $http.post('/services/candidates/newEducation', $scope.education).success(function(result) {
                            //alert("success");
                            $scope.$parent.$broadcast('UPDATE_PARENT_EDUCATION', $scope.education);
                            $modalInstance.dismiss('cancel');
                            $scope.$parent.$broadcast('mynotify', result[0]);
                        });
                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                    education: function() {
                        return $scope.master;
                    }
                }
            });
        };
        // end Contact modal window
    }
]).controller('CollapseLegalStatus', ["$scope", "Data", "$routeParams", "$http", "$modal", "$log",
    function($scope, Data, $routeParams, $http, $modal, $log) {

        $scope.custom = false;

        if (typeof $routeParams.sid !== 'undefined') {
            $scope.Keys = {
                sid: $routeParams.sid,
                isprimary: null
            };

            $http.post('/services/candidates/getLegalStatusList', $scope.Keys).success(function(legaldata) {
                $scope.custom = true;
                for (var i = 0; i < legaldata.length; i++) {
                    if (legaldata[i].enddate === "0000-00-00") {
                        legaldata[i].enddate = "";
                    }
                }
                $scope.legalData = legaldata;
            });
        } else {
            $scope.Keys = {
                sid: Data.getCandidateSid(),
                isprimary: false
            };
        }

        $scope.$on('UPDATE_PARENT_LEGAL', function(event, data) {
            if (data === "false") {
                $scope.Keys.isprimary = null;
                $scope.custom = false;
            } else {
                $scope.Keys.isprimary = null;
                $scope.custom = true;
            }

            $scope.Keys.sid = Data.getCandidateSid();

            $scope.contactData = [];

            $http.post('/services/candidates/getLegalStatusList', $scope.Keys).success(function(legaldata) {
                //$scope.custom = true;
                for (var i = 0; i < legaldata.length; i++) {
                    if (legaldata[i].enddate === "0000-00-00") {
                        legaldata[i].enddate = "";
                    }
                }
                $scope.legalData = legaldata;
            });

        });

        $scope.togglecollapse = function() {
            $scope.custom = $scope.custom === false ? true : false;
            var isprimary = $scope.custom === false ? null : true;

            $scope.Keys = {
                sid: Data.getCandidateSid(),
                isprimary: isprimary
            };

        };

        // open Contact modal window
        $scope.open = function(legalStatus) {

            var length = Object.keys(legalStatus).length;

            if (Data.getCandidateSid() === "") {
                $scope.$parent.$broadcast('dbnotify', Data.getAlertMessage());
                return;
            }
            if (length > 0) {
                //$scope.legalStatus = legalStatus;
                $scope.master = angular.copy(legalStatus);
            }

            var modalInstance;
            modalInstance = $modal.open({
                backdrop: true,
                windowClass: 'modal',
                templateUrl: "views/newLegalStatus.html",
                controller: function($scope, Data, $http, $modalInstance, $log) {

                    if (length > 0) {
                        //$scope.legalStatus = legalStatus;
                        $scope.master = angular.copy(legalStatus);
                        $scope.master.action = "Update";
                        $scope.master.LegalStatusTypeData = [];
                        if ($scope.master.isprimary === 1) {
                            $scope.master.isprimary = "true";
                        } else {
                            $scope.master.isprimary = "false";
                        }
                    } else {
                        $scope.master = {
                            LegalStatusTypeData: [],
                            isprimary: "",
                            action: "",
                            person_sid: ""
                        };
                        $scope.master.isprimary = "true";
                        $scope.master.action = "New";
                        $scope.master.person_sid = Data.getCandidateSid();
                    }



                    if (length > 0) {
                        $scope.master.LegalStatusType = legalStatus.LegalStatusType_sid;
                    }

                    $http.post('/services/candidates/getLegalStatusType', []).success(function(legalStatusTypedata) {
                        for (var i = 0; i < legalStatusTypedata.length; i++) {
                            $scope.master.LegalStatusTypeData[parseInt(legalStatusTypedata[i].sid)] = legalStatusTypedata[i].name;
                        }
                    });

                    $scope.submit = function(legalStatus) {
                        //$scope.legalStatus.person_sid = Data.getCandidateSid();
                        $scope.master = legalStatus;
                        $scope.master.LegalStatusType_sid = legalStatus.LegalStatusType;
                        $http.post('/services/candidates/newLegalStatus', $scope.master).success(function(result) {
                            $scope.$parent.$broadcast('UPDATE_PARENT_LEGAL', legalStatus.isprimary);
                            $scope.$parent.$broadcast('mynotify', result[0]);
                            $modalInstance.dismiss('cancel');
                        });
                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                    legalStatus: function() {
                        return $scope.master;
                    }
                }
            });
        };
        // end Contact modal window
    }
]).controller('CollapseEmployment', ["$scope", 'Data', "$routeParams", "$http", "$modal", "$log",
    function($scope, Data, $routeParams, $http, $modal, $log) {

        // $scope.custom = false;

        $scope.employmentData = [];

        if (typeof $routeParams.sid !== 'undefined') {
            $scope.Keys = {
                sid: $routeParams.sid,
                isprimary: "NULL"
            };
            $http.post('/services/candidates/getEmploymentList', $scope.Keys).success(function(employmentdata) {

                for (var i = 0; i < employmentdata.length; i++) {
                    if (employmentdata[i].startdate === "0000-00-00") {
                        employmentdata[i].startdate = "";
                    }
                    if (employmentdata[i].enddate === "0000-00-00") {
                        employmentdata[i].enddate = "";
                    }
                }

                $scope.employmentData = employmentdata;
            });
        } else {
            $scope.Keys = {
                sid: Data.getCandidateSid(),
                isprimary: false
            };
        }

        $scope.$on('UPDATE_PARENT_EMPLOYMENT', function(event, data) {
            $scope.Keys.sid = Data.getCandidateSid();
            $http.post('/services/candidates/getEmploymentList', $scope.Keys).success(function(employmentdata) {

                for (var i = 0; i < employmentdata.length; i++) {
                    if (employmentdata[i].startdate === "0000-00-00") {
                        employmentdata[i].startdate = "";
                    }
                    if (employmentdata[i].enddate === "0000-00-00") {
                        employmentdata[i].enddate = "";
                    }
                }

                $scope.employmentData = employmentdata;
            });
        });

        // open Contact modal window
        $scope.open = function(employment) {

            var length = Object.keys(employment).length;

            if (Data.getCandidateSid() === "") {
                $scope.$parent.$broadcast('dbnotify', Data.getAlertMessage());
                return;
            }
            if (length > 0) {
                //$scope.employment = employment;
                $scope.master = angular.copy(employment);
            }
            var modalInstance;
            modalInstance = $modal.open({
                backdrop: true,
                windowClass: 'modal',
                templateUrl: "views/newEmployment.html",
                controller: function($scope, Data, $http, $modalInstance, $log) {

                    if (length > 0) {
                        //$scope.employment = employment;
                        $scope.master = angular.copy(employment);
                        $scope.master.action = "Update";
                        $scope.master.JobTypeData = [];
                    } else {
                        $scope.master = {
                            JobTypeData: [],
                            isprimary: "",
                            action: "",
                            person_sid: ""
                        };
                        $scope.master.action = "New";
                        $scope.master.person_sid = Data.getCandidateSid();
                    }

                    if ($scope.master.isprimary === 1) {
                        $scope.master.isprimary = "true";
                    } else {
                        $scope.master.isprimary = "false";
                    }

                    $http.post('/services/candidates/getJobType', []).success(function(jobtypedata) {
                        for (var i = 0; i < jobtypedata.length; i++) {
                            $scope.master.JobTypeData[parseInt(jobtypedata[i].sid)] = jobtypedata[i].name;
                        }
                    });


                    if (length > 0) {
                        $scope.master.JobType = employment.JobType_sid;
                    }

                    $scope.submit = function(employment) {
                        $scope.master = employment;
                        //alert(employment.startdate+"--"+employment.enddate)
                        //$scope.employment.person_sid = Data.getCandidateSid();
                        $scope.master.JobType_sid = employment.JobType;
                        $http.post('/services/candidates/newEmployment', $scope.master).success(function(result) {
                            $scope.$parent.$broadcast('UPDATE_PARENT_EMPLOYMENT', $scope.employment);
                            $scope.$parent.$broadcast('mynotify', result[0]);
                            $modalInstance.dismiss('cancel');
                        });
                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                    employment: function() {
                        return $scope.employment;
                    }
                }
            });

        };

        // end Contact modal window
    }
]).controller('CollapseSkills', ["$scope", "Data", "$routeParams", "$http", "$modal", "$log", "FileUploader",
    function($scope, Data, $routeParams, $http, $modal, $log, FileUploader) {

        $scope.custom = false;

        if (typeof $routeParams.sid !== 'undefined') {
            $scope.Keys = {
                sid: $routeParams.sid,
                isprimary: null
            };
            $http.post('/services/candidates/getSkillsList', $scope.Keys).success(function(skillsdata) {
                $scope.custom = true;
                $scope.skillsData = skillsdata;
            });
        } else {
            $scope.Keys = {
                sid: Data.getCandidateSid(),
                isprimary: false
            };
        }

        $scope.$on('UPDATE_PARENT_SKILLS', function(event, data) {
            // alert(data);
            if (data === "false") {
                $scope.Keys.isprimary = null;
                $scope.custom = false;
            } else {
                $scope.Keys.isprimary = null;
                $scope.custom = true;
            }
            $scope.Keys.sid = Data.getCandidateSid();
            //$scope.skillsData = [];
            $http.post('/services/candidates/getSkillsList', $scope.Keys).success(function(skillsdata) {
                //$scope.custom = true;
                $scope.skillsData = skillsdata;
            });

            //console.log($scope.skillsData);

        });

        $scope.togglecollapse = function() {
            $scope.custom = $scope.custom === false ? true : false;
            var isprimary = $scope.custom === false ? null : true;

            $scope.Keys = {
                sid: Data.getCandidateSid(),
                isprimary: isprimary
            };

        };

        // open Contact modal window
        $scope.open = function(skills) {

            var length = Object.keys(skills).length;

            if (Data.getCandidateSid() === "") {
                $scope.$parent.$broadcast('dbnotify', Data.getAlertMessage());
                return;
            }
            if (length > 0) {
                //console.log(skills);

                //alert(skills.hourlyrate_desired + " " + skills.annualsalary_desired);

                if (skills.hourlyrate_desired !== "null" && skills.hourlyrate_desired !== "0" && skills.hourlyrate_desired !== 0) {
                    skills.salary_desired = skills.hourlyrate_desired;
                    skills.salarytype = "hourlyRate";
                }

                if (skills.annualsalary_desired !== "null" && skills.annualsalary_desired !== "0" && skills.annualsalary_desired !== 0) {
                    skills.salary_desired = skills.annualsalary_desired;
                    skills.salarytype = "annualSalary";
                }

                //alert(skills.salarytype);


                $scope.master = angular.copy(skills);

                //$scope.skills = skills;
            }
            var modalInstance;
            modalInstance = $modal.open({
                backdrop: true,
                windowClass: 'modal',
                templateUrl: "views/newSkills.html",
                controller: function($scope, Data, $http, $modalInstance, $log) {

                    $scope.uploader = new FileUploader({
                        url: '/services/candidates/updateResume'
                    });

                    $scope.uploader.filters.push({
                        name: 'imageFilter',
                        fn: function(item, options) {
                            /*var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                             console.log(type);
                             return '|png|plain|pdf|vnd.openxmlformats-officedocument.wordprocessingml.document|'.indexOf(type) !== -1;*/
                            return true;
                        }
                    });

                    if (length > 0) {
                        //$scope.skills = skills;
                        $scope.master = angular.copy(skills);
                        $scope.master.action = "Update";
                        $scope.master.JobTypeData = [];
                        $scope.master.EmploymentTypeData = [];
                        if ($scope.master.isprimary === 1) {
                            $scope.master.isprimary = "true";
                        } else {
                            $scope.master.isprimary = "false";
                        }
                    } else {
                        $scope.master = {
                            JobTypeData: [],
                            EmploymentTypeData: [],
                            isprimary: "",
                            action: "",
                            person_sid: ""
                        };
                        $scope.master.isprimary = "true";
                        $scope.master.action = "New";
                        $scope.master.person_sid = Data.getCandidateSid();
                    }
                    //$scope.skills.JobTypeData = [];
                    $http.post('/services/candidates/getJobType', []).success(function(jobtypedata) {
                        for (var i = 0; i < jobtypedata.length; i++) {
                            $scope.master.JobTypeData[parseInt(jobtypedata[i].sid)] = jobtypedata[i].name;
                        }
                    });
                    //$scope.skills.EmploymentTypeData = [];
                    $http.post('/services/candidates/getEmploymentType', []).success(function(employmenttypedata) {
                        for (var i = 0; i < employmenttypedata.length; i++) {
                            $scope.master.EmploymentTypeData[parseInt(employmenttypedata[i].sid)] = employmenttypedata[i].name;
                        }
                    });

                    if (length > 0) {
                        $scope.master.JobType = skills.JobType_sid;
                        $scope.master.EmploymentType = skills.EmploymentType_sid;
                    }

                    $scope.submit = function(skills) {

                        if (typeof skills.salary_desired === "undefined") {
                            skills.salary_desired = "";
                        }
                        if (typeof skills.salarytype === "undefined" || skills.salarytype === "hourlyRate") {
                            skills.hourlyrate_desired = skills.salary_desired;
                            skills.annualsalary_desired = "0";
                        } else {
                            skills.annualsalary_desired = skills.salary_desired;
                            skills.hourlyrate_desired = "0";
                        }

                        $scope.master = skills;
                        $scope.master.JobType_sid = skills.JobType;
                        $scope.master.EmploymentType_sid = skills.EmploymentType;

                        $scope.uploader.onCompleteItem = function(item, result) {
                            if (result.err) {
                                //alert(result.err);
                                //$modalInstance.close(result);
                            }
                            else {
                                $scope.master.resumelink = result.resumelink;
                                $http.post('/services/candidates/newSkills', $scope.master).success(function(result) {
                                    $scope.$parent.$broadcast('UPDATE_PARENT_SKILLS', skills.isprimary);
                                    $scope.$parent.$broadcast('mynotify', result[0]);
                                    $modalInstance.dismiss('cancel');
                                });

                            }
                        };
                        //$scope.master = angular.copy($scope.person);
                        var queueLength = $scope.uploader.queue.length;

                        if (queueLength) {
                            var item = $scope.uploader.queue[queueLength - 1]; // upload last item in queue	
                            item.upload();
                        } else {
                            $http.post('/services/candidates/newSkills', $scope.master).success(function(result) {
                                $scope.$parent.$broadcast('UPDATE_PARENT_SKILLS', skills.isprimary);
                                $scope.$parent.$broadcast('mynotify', result[0]);
                                $modalInstance.dismiss('cancel');
                            });
                        }
                        //$scope.skills.person_sid = Data.getCandidateSid();
                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                },
                resolve: {
                    skills: function() {
                        return $scope.master;
                    }
                }
            });
        };
        // end Contact modal window
    }
]).controller("DatepickerDemoCtrl", ["$scope", function($scope) {
        return $scope.today = function() {
            return $scope.dt = new Date
        }, $scope.today(), $scope.showWeeks = !0, $scope.toggleWeeks = function() {
            return $scope.showWeeks = !$scope.showWeeks
        }, $scope.clear = function() {
            return $scope.dt = null
        }, $scope.disabled = function(date, mode) {
            return"day" === mode && (0 === date.getDay() || 6 === date.getDay())
        }, $scope.toggleMin = function() {
            var _ref;
            return $scope.minDate = null != (_ref = $scope.minDate) ? _ref : {"null": new Date}
        }, $scope.toggleMin(), $scope.open = function($event) {
            return $event.preventDefault(), $event.stopPropagation(), $scope.opened = !0
        }, $scope.dateOptions = {"year-format": "'yy'", "starting-day": 1}, $scope.formats = ["yyyy/MM/dd", "yyyy/MM/dd", "shortDate"], $scope.format = 'MM/dd/yyyy'
    }]);