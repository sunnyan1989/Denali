'use strict';

/* Services */
var mainServices = angular.module('mainServices', []);

mainServices.service('LoggedInUser', ['$http',
    function($http) {
        var user = null;
        this.post = function(callback) {
            if (user)
                return callback(user);
            else
                $http.post('/getLoggedInUser').
                        success(function(data) {
                            user = data;
                            callback(user);
                        }).
                        error(function() {
                            user = null;
                            callback(user);
                        });
        }
    }
]);

mainServices.factory('authInterceptor', ['$q', '$window',
    function($q, $window) {
        return {
            responseError: function(rejection) {
                console.log('In interceptor ' + rejection.status);
                if (rejection.status === 401) {
                    // handle the case where the user is not authenticated
                    $window.location.href = '/login.html';
                }
                return $q.reject(rejection);
            }
        };
    }]);
