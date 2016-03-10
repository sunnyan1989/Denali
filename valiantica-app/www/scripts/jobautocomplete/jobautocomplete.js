/**
 * Angucomplete
 * Autocomplete directive for AngularJS
 * By Daryl Rowland
 */

angular.module('jobautocomplete', [])
        .directive('jobautocomplete', function($parse, $http, $sce, $timeout) {
            return {
                restrict: 'EA',
                scope: {
                    "id": "@id",
                    "placeholder": "@placeholder",
                    "selectvalue": "@selectvalue",
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
                template: '<div class="angucomplete-holder"><input id="{{id}}_value" ng-model="searchStr" type="text" value="{{selectvalue}}" placeholder="{{placeholder}}" class="{{inputClass}}" onmouseup="this.select();" ng-focus="resetHideResults()" ng-blur="hideResults()" /><div id="{{id}}_dropdown" class="angucomplete-dropdown" ng-if="showDropdown"><div class="angucomplete-searching" ng-show="searching">Searching...</div><div class="angucomplete-searching" ng-show="!searching && (!results || results.length == 0)">No results found</div><div class="angucomplete-row" ng-repeat="result in results" ng-click="selectResult(result)" ng-mouseover="hoverRow()" ng-class="{\'angucomplete-selected-row\': $index == currentIndex}"><div ng-if="imageField" class="angucomplete-image-holder"><img ng-if="result.image && result.image != \'\'" ng-src="{{result.image}}" class="angucomplete-image"/><div ng-if="!result.image && result.image != \'\'" class="angucomplete-image-default"></div></div><div class="angucomplete-title" ng-if="matchClass" ng-bind-html="result.title"></div><div class="angucomplete-title" ng-if="!matchClass">{{selectvalue}} {{ result.title }}</div><div ng-if="result.description && result.description != \'\'" class="angucomplete-description">{{result.description}}</div></div></div></div>',
                link: function($scope, elem, attrs) {
                    $scope.lastSearchTerm = null;
                    $scope.currentIndex = null;
                    $scope.justChanged = false;
                    $scope.searchTimer = null;
                    $scope.hideTimer = null;
                    $scope.searching = false;
                    $scope.pause = 500;
                    $scope.minLength = 3;
                    $scope.searchStr = $scope.selectvalue;

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

                        var keys = $scope.titleField;

                        if ($scope.titleField === "source") {
                            $scope.$parent.master.source = str;
                        } else if ($scope.titleField === "vendor") {
                            $scope.$parent.master.vendor = str;
                        } else if ($scope.titleField === "client") {
                            $scope.$parent.master.client = str;
                        }

                        if (responseData && responseData.length > 0) {
                            $scope.results = [];

                            for (var i = 0; i < responseData.length; i++) {
                                // Get title variables
                                var titleCode = [];

                                if (keys === "source") {
                                    var data = responseData[i].source;
                                    titleCode.push(responseData[i].source);
                                } else if (keys === "vendor") {
                                    var data = responseData[i].vendor;
                                    titleCode.push(responseData[i].vendor);
                                } else if (keys === "client") {
                                    var data = responseData[i].client;
                                    titleCode.push(responseData[i].client);
                                }

                                if (data != "" && data != " ") {
                                    var text = titleCode.join(' ');

                                    if ($scope.matchClass) {
                                        var re = new RegExp(str, 'i');
                                        var strPart = text.match(re)[0];
                                        text = $sce.trustAsHtml(text.replace(re, '<span class="' + $scope.matchClass + '">' + strPart + '</span>'));
                                    }
                                    //text = $sce.trustAsHtml('<span class="' + $scope.matchClass + '">' + text + '</span>');
                                    //text = $sce.trustAsHtml(text.replace(text, '<span class="' + $scope.matchClass + '">' + text + '</span>'));
                                    var resultRow = {
                                        title: text,
                                        originalObject: responseData[i]
                                    }
                                    $scope.results[$scope.results.length] = resultRow;
                                }
                            }

                        } else {
                            $scope.results = [];
                        }
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
                                //alert(str);
                                $scope.searchKeys = {
                                    keywords: str,
                                    type: $scope.titleField
                                };

                                $http.post("/services/my-candidates/getJobDescription", $scope.searchKeys).
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
                        $scope.hideTimer = $timeout(function() {
                            $scope.showDropdown = false;
                        }, $scope.pause);
                    };

                    $scope.resetHideResults = function() {
                        if ($scope.hideTimer) {
                            $timeout.cancel($scope.hideTimer);
                        }
                        ;
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


                        if ($scope.titleField === "source") {
                            $scope.$parent.master.source = result.title;
                        } else if ($scope.titleField === "vendor") {
                            $scope.$parent.master.vendor = result.title;
                        } else if ($scope.titleField === "client") {
                            $scope.$parent.master.client = result.title;
                        }

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

