'use strict';

var loginControllers = angular.module('loginControllers', []);

loginControllers.controller('MainCtrl', ['$scope', '$http', 'logger',
    function($scope, $http, logger) {
        $scope.brand = "Valiantica";
        $scope.notify = function(type, message) {
            switch (type) {
                case 'info':
                    return logger.log(message);
                case 'success':
                    return logger.logSuccess(message);
                case 'warning':
                    return logger.logWarning(message);
                case 'error':
                    return logger.logError(message);
            }
        };
    }
]);

loginControllers.controller('SigninCtrl', ['$scope', '$http', '$window', 
    function($scope, $http, $window) {
        
        $scope.signin = function() {
            $http.post("/services/login/signin", $scope.user).
                    success(function(result) {
                        //alert(result.msg);
                        if (result.err)
                            $scope.notify('error', result.msg);
                        else
                            $window.location.href = "/main.html";
                        
                    }).
                    error(function(data, status) {
                        $scope.notify('error', data);
                    });
        };
    }
]);

loginControllers.controller('SignupCtrl', ['$scope', '$http',
    function($scope, $http) {
        $scope.signup = function(tenant) {
            //console.log(tenant);
            
            $scope.tenant = tenant;
            
            $http.post("/services/login/signup", $scope.tenant).
                    success(function(result) {
                        if (result.err)
                            $scope.notify('error', result.msg);
                        else
                            $scope.notify('success', 'User created successfully, Please login to continue');
                        $scope.signupForm.$setPristine();
                        $scope.tenant = {};
                        //if (result.err)
                         //   $scope.notify('error', result.msg);
                        //$window.location.href = "/login.html";
                    })
        }
    }
]);

loginControllers.directive('match', function () {
        return {
            require: 'ngModel',
            restrict: 'A',
            scope: {
                match: '='
            },
            link: function(scope, elem, attrs, ctrl) {
                scope.$watch(function() {
                    var modelValue = ctrl.$modelValue || ctrl.$$invalidModelValue;
                    return (ctrl.$pristine && angular.isUndefined(modelValue)) || scope.match === modelValue;
                }, function(currentValue) {
                    ctrl.$setValidity('match', currentValue);
                });
            }
        };
    });

loginControllers.controller('ForgotPasswordCtrl', ['$scope',
    function($scope) {
        $scope.sendPassword = function() {

        }
    }
]);
