'use strict';
//Login app
var loginApp = angular.module('loginApp', ['ngRoute', 'loginControllers', 'app.ui.services']);

loginApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
                when('/signin', {
                    templateUrl: '/views/signin.html',
                    controller: 'SigninCtrl'
                }).
                when('/signup', {
                    templateUrl: 'views/signup.html',
                    controller: 'SignupCtrl'
                }).
                when('/forgot-password', {
                    templateUrl: 'views/forgot-password.html',
                    controller: 'ForgotPasswordCtrl'
                }).
                otherwise({
                    redirectTo: '/signin'
                });
    }
]);

