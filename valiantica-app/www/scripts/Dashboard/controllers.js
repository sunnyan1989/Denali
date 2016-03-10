'use strict';

var DashboardControllers = angular.module('DashboardControllers', []);

//Dashboard controller
DashboardControllers.controller('DashboardCtrl', ['$scope', '$http', '$modal', '$filter',
    function($scope, $http, $modal, $filter) {

        var days = 30;
        var today = $filter('date')(new Date(), 'yyyy-MM-dd');
        var datestr = $filter('date')(today, 'MM/dd');
        var yearstr = $filter('date')(today, 'yyyy-MM-dd');
        //alert(today);

        var date = new Date();
        date.setDate(date.getDate() - days);
        var monthago = $filter('date')(date, 'yyyy-MM-dd');
        //alert(monthago);

        $scope.keys = {
            startdate: monthago,
            enddate: today
        };

        var ticks = [];
        var yearticks = [];
        var onlydateticks = [];
        $scope.line2 = {};
        $scope.line2.data = [];

        $scope.line3 = {};
        $scope.line3.data = [];

        for (var i = 0; i < days; i++) {
            if (i > 0) {
                var monthandday = new Date();
                monthandday.setDate(monthandday.getDate() - i);
                var datestr = $filter('date')(monthandday, 'MM/dd');
                var yearstr = $filter('date')(monthandday, 'yyyy-MM-dd');
            }
            var index = i + 1;
            ticks[i] = new Array(index, datestr);
            onlydateticks[i] = datestr;
            yearticks[i] = new Array(index, yearstr);
        }

        ticks = ticks.reverse();
        onlydateticks = onlydateticks.reverse();

        for (var n = 0; n < ticks.length; n++) {
            ticks[n][0] = n + 1;
        }

        $http.post('/services/services_dashboard/cmStatus', $scope.keys).success(function(data) {
            //console.log(data)
            $scope.$parent.$broadcast('createLineChart', data);
        });

        $http.post('/services/services_dashboard/getCMActivity', $scope.keys).success(function(data) {
            //console.log(data)
            $scope.$parent.$broadcast('createLineChartByActivity', data);
        });


        $scope.$on('createLineChart', function(event, data) {

            var nameArray = [];
            var arrayByname = [];
            var dateArray = [];
            for (var j = 0; j < data.length; j++) {
                var index1 = j + 1;
                var transaction = data[j].Transaction;
                var get_date = data[j].Date;
                var total = data[j].Total;
                if (nameArray.indexOf(transaction) === -1) {
                    arrayByname[transaction] = new Array([index1, total]);
                    nameArray.push(transaction);
                    var getdate = $filter('date')(get_date, 'MM/dd');
                    dateArray[transaction] = new Array(getdate);
                } else {
                    arrayByname[transaction].push([index1, total]);
                    var getdate = $filter('date')(get_date, 'MM/dd');
                    dateArray[transaction].push(getdate);
                }
            }

            for (var m = 0; m < nameArray.length; m++) {
                var data = [];
                for (var n = 0; n < ticks.length; n++) {
                    if (dateArray[nameArray[m]].indexOf(ticks[n][1]) !== -1) {
                        var num = dateArray[nameArray[m]].indexOf(ticks[n][1]);
                        var num1 = onlydateticks.indexOf(ticks[n][1]);
                        data[num1 + 1] = new Array(num1 + 1, arrayByname[nameArray[m]][num][1]);
                    } else {
                        var index1 = n + 1;
                        data[index1] = new Array(index1, 0);
                    }
                }
                $scope.line2.data[m] = {label: nameArray[m], data: data};
            }

            $scope.line2.options = {
                series: {
                    lines: {
                        show: true,
                        fill: true,
                        fillColor: {
                            colors: [
                                {
                                    opacity: 0
                                },
                                {
                                    opacity: 0.3
                                },
                                {
                                    opacity: 0.6
                                },
                                {
                                    opacity: 0.9
                                },
                                {
                                    opacity: 0.8
                                }
                            ]
                        }
                    },
                    points: {
                        show: true,
                        lineWidth: 2,
                        fill: true,
                        fillColor: "#ffffff",
                        symbol: "circle",
                        radius: 3
                    }
                },
                colors: ["#31C0BE", "#8170CA", "#E87352", "green", "orange"],
                tooltip: true,
                tooltipOpts: {
                    defaultTheme: false
                },
                grid: {
                    hoverable: true,
                    clickable: true,
                    tickColor: "#f9f9f9",
                    borderWidth: 1,
                    borderColor: "#eeeeee"
                },
                xaxis: {
                    ticks: ticks
                },
                legend: {
                    show: true,
                    position: "nw"

                }
            };
            
            $.plot("#chartbystatus", $scope.line2.data, $scope.line2.options);

        });

        $scope.$on('createLineChartByActivity', function(event, data) {

            var nameArray = [];
            var arrayByname = [];
            var dateArray = [];
            for (var j = 0; j < data.length; j++) {
                var index1 = j + 1;
                var cm = data[j].CM;
                var data_date = data[j].CreationDate;
                var noiftrans = data[j].NoOfTrans;
                if (nameArray.indexOf(cm) === -1) {
                    arrayByname[cm] = new Array([index1, noiftrans]);
                    nameArray.push(cm);
                    var getdate = $filter('date')(data_date, 'MM/dd');
                    dateArray[cm] = new Array(getdate);
                } else {
                    arrayByname[cm].push([index1, noiftrans]);
                    var getdate = $filter('date')(data_date, 'MM/dd');
                    dateArray[cm].push(getdate);
                }
            }
            for (var m = 0; m < nameArray.length; m++) {

                var data = [];
                for (var n = 0; n < ticks.length; n++) {
                    if (dateArray[nameArray[m]].indexOf(ticks[n][1]) !== -1) {
                        var num = dateArray[nameArray[m]].indexOf(ticks[n][1]);
                        var num1 = onlydateticks.indexOf(ticks[n][1]);
                        data[num1 + 1] = new Array(num1 + 1, arrayByname[nameArray[m]][num][1]);
                    } else {
                        var index1 = n + 1;
                        data[index1] = new Array(index1, 0);
                    }
                }

                $scope.line3.data[m] = {label: nameArray[m], data: data};
            }

            //console.log($scope.line3.data);

            $scope.line3.options = {
                series: {
                    lines: {
                        show: true,
                        fill: true,
                        fillColor: {
                            colors: [
                                {
                                    opacity: 0
                                },
                                {
                                    opacity: 0.3
                                },
                                {
                                    opacity: 0.6
                                },
                                {
                                    opacity: 0.9
                                },
                                {
                                    opacity: 0.8
                                }
                            ]
                        }
                    },
                    points: {
                        show: true,
                        lineWidth: 2,
                        fill: true,
                        fillColor: "#ffffff",
                        symbol: "circle",
                        radius: 3
                    }
                },
                colors: ["#31C0BE", "#8170CA", "#E87352", "green", "orange"],
                tooltip: true,
                tooltipOpts: {
                    defaultTheme: false
                },
                grid: {
                    hoverable: true,
                    clickable: true,
                    tickColor: "#f9f9f9",
                    borderWidth: 1,
                    borderColor: "#eeeeee"
                },
                xaxis: {
                    ticks: ticks,
                },
                legend: {
                    show: true,
                    position: "nw"

                }
            };

            $.plot("#chartbyactivity", $scope.line3.data, $scope.line3.options);

        });

    }
]);
