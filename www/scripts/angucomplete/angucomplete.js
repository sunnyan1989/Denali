angular.module('angucomplete', [])
        .directive('angucomplete', function($parse, $http, $sce, $timeout) {

            return {
                restrict: 'EA',
                scope: {
                    "id": "@id",
                    "placeholder": "@placeholder",
                    "selectedObject": "=selectedobject",
                    "url": "@url",
                    "dataField": "@datafield",
                    "titleField": "@titlefield",
                    "descriptionField": "@descriptionfield",
                    "imageField": "@imagefield",
                    "imageUri": "@imageuri",
                    "inputClass": "@inputclass",
                    "userPause": "@pause",
                    "localData": "=localdata",
                    "searchFields": "@searchfields",
                    "minLengthUser": "@minlength",
                    "matchClass": "@matchclass"
                },
                //template: '<div class="angucomplete-holder"><input id="{{id}}_value" ng-model="searchStr" type="text" placeholder="{{placeholder}}" class="{{inputClass}}" onmouseup="this.select();" ng-focus="resetHideResults()" ng-blur="hideResults()" /><div id="{{id}}_dropdown" class="angucomplete-dropdown" ng-if="showDropdown"><div class="angucomplete-searching" ng-show="searching">Searching...</div><div class="angucomplete-searching" ng-show="!searching && (!results || results.length == 0)">No results found</div><div class="angucomplete-row" ng-repeat="result in results" ng-click="selectResult(result)" ng-mouseover="hoverRow()" ng-class="{\'angucomplete-selected-row\': $index == currentIndex}"><div ng-if="imageField" class="angucomplete-image-holder"><img ng-if="result.image && result.image != \'\'" ng-src="{{result.image}}" class="angucomplete-image"/><div ng-if="!result.image && result.image != \'\'" class="angucomplete-image-default"></div></div><div class="angucomplete-title" ng-if="matchClass" ng-bind-html="result.title"></div><div class="angucomplete-title" ng-if="!matchClass">{{ result.title }}</div><div ng-if="result.description && result.description != \'\'" class="angucomplete-description">{{result.description}}</div></div></div></div>',
                template: '<div class="angucomplete-holder"><input id="{{id}}_value" ng-model="searchStr" type="text" placeholder="{{placeholder}}" class="{{inputClass}}" onmouseup="this.select();" ng-focus="resetHideResults()" ng-blur="hideResults()" /><a href="" class="showall" ng-click="showAll()">Show All</a><div id="{{id}}_dropdown" class="angucomplete-dropdown" ng-if="showDropdown"><div class="angucomplete-searching" ng-show="searching">Searching...</div><div class="angucomplete-searching" ng-show="!searching && (!results || results.length == 0)">No results found</div><div class="angucomplete-row" ng-repeat="result in results" ng-click="selectResult(result)" ng-mouseover="hoverRow()" ng-class="{\'angucomplete-selected-row\': $index == currentIndex}"><div class="angucomplete-title" ng-if="matchClass" ng-bind-html="result.title"></div><div class="angucomplete-title" ng-if="!matchClass">{{ result.title }}</div><div ng-if="result.description && result.description != \'\'" class="angucomplete-description"></div></div></div></div>\n\
                ',
                link: function($scope, elem, attrs) {
                    $scope.lastSearchTerm = null;
                    $scope.currentIndex = null;
                    $scope.justChanged = false;
                    $scope.searchTimer = null;
                    $scope.hideTimer = null;
                    $scope.searching = false;
                    $scope.pause = 500;
                    $scope.minLength = 3;
                    $scope.searchStr = null;

                    if ($scope.minLengthUser && $scope.minLengthUser != "") {
                        $scope.minLength = $scope.minLengthUser;
                    }

                    if ($scope.userPause) {
                        $scope.pause = $scope.userPause;
                    }

                    isNewSearchNeeded = function(newTerm, oldTerm) {
                        return newTerm.length >= $scope.minLength && newTerm != oldTerm
                    }

                    $scope.processResults = function(responseData, str) {
                        if (responseData && responseData.length > 0) {
                            $scope.results = [];

                            var titleFields = [];
                            if ($scope.titleField && $scope.titleField != "") {
                                titleFields = $scope.titleField.split(",");
                            }

                            for (var i = 0; i < responseData.length; i++) {
                                // Get title variables
                                var titleCode = [];
                                var sid = "";

                                for (var t = 0; t < titleFields.length; t++) {
                                    //alert(responseData[i][titleFields[t]]);
                                    if (titleFields[t] === "sid") {
                                        sid = responseData[i][titleFields[t]];
                                    } else {
                                        if (titleFields[t] === "state") {
                                            if(responseData[i][titleFields[t]]){
                                               var state = ", " + responseData[i][titleFields[t]];
                                                titleCode.push(state); 
                                            }else{
                                                titleCode.push("");
                                            }
                                        } else {
                                            titleCode.push(responseData[i][titleFields[t]]);
                                        }
                                    }
                                }

                                var text = titleCode.join(' ');

                                if ($scope.matchClass) {
                                    var re = new RegExp(str, 'i');
                                    var strPart = text.match(re)[0];
                                    text = $sce.trustAsHtml(text.replace(re, '<span class="' + $scope.matchClass + '">' + strPart + '</span>'));
                                }

                                var resultRow = {
                                    sid: sid,
                                    title: text,
                                    originalObject: responseData[i]
                                }

                                $scope.results[$scope.results.length] = resultRow;
                            }

                        } else {
                            $scope.results = [];
                        }
                    }

                    $scope.processShowAllResults = function(responseData, str) {
                        if (responseData && responseData.length > 0) {
                            $scope.results = [];

                            var titleFields = [];
                            if ($scope.titleField && $scope.titleField != "") {
                                titleFields = $scope.titleField.split(",");
                            }

                            for (var i = 0; i < responseData.length; i++) {
                                // Get title variables
                                var titleCode = [];
                                var sid = "";

                                for (var t = 0; t < titleFields.length; t++) {
                                    //alert(responseData[i][titleFields[t]]);
                                    if (titleFields[t] === "sid") {
                                        sid = responseData[i][titleFields[t]];
                                    } else {
                                        if (titleFields[t] === "state") {
                                            //var state = ", " + responseData[i][titleFields[t]];
                                            //titleCode.push(state);
                                            
                                            if(responseData[i][titleFields[t]]){
                                               var state = ", " + responseData[i][titleFields[t]];
                                                titleCode.push(state); 
                                            }else{
                                                titleCode.push("");
                                            }
                                            
                                        } else {
                                            titleCode.push(responseData[i][titleFields[t]]);
                                        }
                                    }
                                }

                                var text = titleCode.join(' ');
                                //alert(text);
                                text = $sce.trustAsHtml(text.replace(text, '<span class="' + $scope.matchClass + '">' + text + '</span>'));
                                //alert(responseData[i]);
                                /*if ($scope.matchClass) {
                                 var re = new RegExp(str, 'i');
                                 var strPart = text.match(re)[0];
                                 text = $sce.trustAsHtml(text.replace(re, '<span class="' + $scope.matchClass + '">' + strPart + '</span>'));
                                 }*/

                                var resultRow = {
                                    sid: sid,
                                    title: text,
                                    originalObject: responseData[i]
                                }
                                //console.log("$scope.results");
                                //console.log($scope.results);
                                $scope.results[$scope.results.length] = resultRow;

                            }

                        } else {
                            $scope.results = [];
                        }
                    }

                    //$scope.selectData = [];

                    $scope.showAll = function() {

                        // this.resetHideResults();

                        $scope.searchKeys = {
                            statusSid: 1,
                            name: "",
                            state: "",
                        };

                        $http.post("/services/candidates/", $scope.searchKeys).
                                success(function(responseData, status, headers, config) {
                                    //console.log(responseData);
                                    $scope.searching = false;
                                    $scope.showDropdown = true;
                                    $scope.processShowAllResults((($scope.dataField) ? responseData[$scope.dataField] : responseData), "");
                                }).
                                error(function(data, status, headers, config) {
                                    console.log("error");
                                });
                    }

                    $scope.searchTimerComplete = function(str) {
                        // Begin the search

                        if (str.length >= $scope.minLength) {
                            if ($scope.localData) {
                                var searchFields = $scope.searchFields.split(",");

                                var matches = [];

                                for (var i = 0; i < $scope.localData.length; i++) {
                                    var match = false;

                                    for (var s = 0; s < searchFields.length; s++) {
                                        match = match || (typeof $scope.localData[i][searchFields[s]] === 'string' && typeof str === 'string' && $scope.localData[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0);
                                    }

                                    if (match) {
                                        matches[matches.length] = $scope.localData[i];
                                    }
                                }

                                $scope.searching = false;
                                $scope.processResults(matches, str);

                            } else {

                                $scope.searchKeys = {
                                    statusSid: 1,
                                    name: str,
                                    state: "",
                                };

                                $http.post("/services/candidates/", $scope.searchKeys).
                                        success(function(responseData, status, headers, config) {
                                            //console.log(responseData);
                                            $scope.searching = false;
                                            $scope.processResults((($scope.dataField) ? responseData[$scope.dataField] : responseData), str);
                                        }).
                                        error(function(data, status, headers, config) {
                                            console.log("error");
                                        });
                            }
                        }
                    }

                    $scope.hideResults = function() {
                        //alert("hideResults");
                        $scope.hideTimer = $timeout(function() {
                            $scope.showDropdown = false;
                        }, $scope.pause);
                    };

                    $scope.resetHideResults = function() {
                        //alert("resetHideResults");
                        if ($scope.hideTimer) {
                            $timeout.cancel($scope.hideTimer);
                        }
                    };

                    $scope.hoverRow = function(index) {
                        $scope.currentIndex = index;
                    }

                    $scope.keyPressed = function(event) {
                        if (!(event.which == 38 || event.which == 40 || event.which == 13)) {
                            if (!$scope.searchStr || $scope.searchStr == "") {
                                $scope.showDropdown = false;
                                $scope.lastSearchTerm = null
                            } else if (isNewSearchNeeded($scope.searchStr, $scope.lastSearchTerm)) {
                                $scope.lastSearchTerm = $scope.searchStr
                                $scope.showDropdown = true;
                                $scope.currentIndex = -1;
                                $scope.results = [];

                                if ($scope.searchTimer) {
                                    $timeout.cancel($scope.searchTimer);
                                }

                                $scope.searching = true;
                                $scope.searchTimer = $timeout(function() {
                                    $scope.searchTimerComplete($scope.searchStr);
                                }, $scope.pause);
                            }
                        } else {
                            event.preventDefault();
                        }
                    }

                    $scope.selectResult = function(result) {
                        if ($scope.matchClass) {
                            result.title = result.title.toString().replace(/(<([^>]+)>)/ig, '');
                        }
                        //alert(result.sid);
                        $scope.Keys = {
                            sid: result.sid,
                            isprimary: "NULL"
                        };
                        
                        $scope.$parent.skillsData = [];
                        
                        $http.post('/services/candidates/getSkillsList/', $scope.Keys).success(function(skillsdata) {
                            console.log("$scope.$parent.hotdatalist");
                            console.log($scope.$parent.hotdatalist);
                            for (var i = 0; i < skillsdata.length; i++) {
                                skillsdata[i].ishow = true;
                                for (var j = 0; j < $scope.$parent.hotdatalist.length; j++) {
                                    if ($scope.$parent.hotdatalist[j].second === false) {
                                        if ($scope.$parent.hotdatalist[j].personskillsid === skillsdata[i].sid) {
                                            skillsdata[i].ishow = false;
                                        }
                                    }
                                }
                                
                                if (skillsdata[i].ishow) {
                                    skillsdata[i].candidate = result.title;
                                    $scope.$parent.skillsData.push(skillsdata[i]);
                                }

                            }
                            //$scope.$parent.skillsData = skillsdata;
                            //$scope.$parent.jobname = result.title;
                        });

                        $scope.searchStr = $scope.lastSearchTerm = result.title;
                        $scope.selectedObject = result;
                        $scope.showDropdown = false;
                        $scope.results = [];
                        //$scope.$apply();
                    }

                    var inputField = elem.find('input');
                    inputField.on('keyup', $scope.keyPressed);
                    elem.on("keyup", function(event) {

                        if (event.which === 40) {
                            if ($scope.results && ($scope.currentIndex + 1) < $scope.results.length) {
                                $scope.currentIndex++;
                                $scope.$apply();
                                event.preventDefault;
                                event.stopPropagation();
                            }

                            $scope.$apply();
                        } else if (event.which == 38) {
                            if ($scope.currentIndex >= 1) {
                                $scope.currentIndex--;
                                $scope.$apply();
                                event.preventDefault;
                                event.stopPropagation();
                            }

                        } else if (event.which == 13) {
                            if ($scope.results && $scope.currentIndex >= 0 && $scope.currentIndex < $scope.results.length) {
                                $scope.selectResult($scope.results[$scope.currentIndex]);
                                $scope.$apply();
                                event.preventDefault;
                                event.stopPropagation();
                            } else {
                                $scope.results = [];
                                $scope.$apply();
                                event.preventDefault;
                                event.stopPropagation();
                            }

                        } else if (event.which == 27) {
                            $scope.results = [];
                            $scope.showDropdown = false;
                            $scope.$apply();
                        } else if (event.which == 8) {
                            $scope.selectedObject = null;
                            $scope.$apply();
                        }

                    });

                }
            };
        });
