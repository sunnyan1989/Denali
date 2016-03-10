'use strict';
//Main app

var mainApp = angular.module('mainApp', ['ngRoute',
    'angularFileUpload',
    'mainControllers',
    'mainServices',
    'ReportsControllers',
    'DashboardControllers',
    'globalAdminControllers',
    'sharedControllers',
    'companyAdminControllers',
    'CandidateControllers',
    'candidateMarketingControllers',
    'ngAnimate',
    'angucomplete',
    'jobautocomplete',
    'ui.bootstrap',
    'ui.tree',
    'app.directives',
    'app.localization',
    'app.ui.services',
    'app.ui.form.directives',
    'app.chart.directives',
    'textAngular'
]);

mainApp.config(['$httpProvider',
    function($httpProvider) {
        /*delete $httpProvider.defaults.headers.common['X-Requested-With'];
         $httpProvider.defaults.headers.post['Accept'] = 'application/json, text/javascript';
         $httpProvider.defaults.headers.post['Content-Type'] = 'application/json; charset=utf-8';
         $httpProvider.defaults.headers.post['Access-Control-Max-Age'] = '1728000';
         $httpProvider.defaults.headers.common['Access-Control-Max-Age'] = '1728000';
         $httpProvider.defaults.headers.common['Accept'] = 'application/json, text/javascript';
         $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
         $httpProvider.defaults.useXDomain = true;*/
        $httpProvider.interceptors.push('authInterceptor');
    }
]);

mainApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
                when('/dashboard', {
                    templateUrl: '/views/dashboard.html',
                    controller: 'DashboardCtrl'
                }).
                when('/tenants', {
                    templateUrl: '/views/tenant-list.html',
                    controller: 'TenantListCtrl'
                }).
                when('/users', {
                    templateUrl: '/views/user-list.html',
                    controller: 'UserListCtrl'
                }).
                when('/tenant-profile', {
                    templateUrl: '/views/tenant-profile.html',
                    controller: 'TenantProfileCtrl'
                }).
                when('/user-profile', {
                    templateUrl: '/views/user-profile.html',
                    controller: 'UserProfileCtrl'
                }).
                when('/candidates', {
                    templateUrl: 'views/candidate-list.html',
                    controller: 'CandidateListCtrl'
                }).
                when('/candidates/mycandidates', {
                    controller: 'MycandidatesCtrl',
                    templateUrl: 'views/mycandidates.html'
                }).
                when('/candidates/hotlist', {
                    controller: 'HotlistCtrl',
                    templateUrl: 'views/hotlist.html'
                }).
                when('/candidates/new', {
                    controller: 'CandidateNewCtrl',
                    templateUrl: 'views/candidate-new.html'
                }).
                when('/candidates/my-candidates', {
                    controller: 'MyCandidatesCtrl',
                    templateUrl: 'views/my-candidates.html'
                }).
                when('/candidates/edit/:sid', {
                    controller: 'CandidateNewCtrl',
                    templateUrl: 'views/candidate-new.html'
                }).
                when('/directsales', {
                    templateUrl: 'views/directsales-list.html',
                    controller: 'DirectSalesListCtrl'
                }).
                when('/directsales/reqlist', {
                    controller: 'ReqlistCtrl',
                    templateUrl: 'views/reqlist.html'
                }).
                when('/directsales/new', {
                    controller: 'DirectSalesNewCtrl',
                    templateUrl: 'views/directsales-new.html'
                }).
                when('/directsales/my-directsales', {
                    controller: 'MyDirectsalesCtrl',
                    templateUrl: 'views/my-directsales.html'
                }).
                when('/reports/hotlist_by_cand', {
                    templateUrl: '/views/reports/hotlist_by_cand.html',
                    controller: 'cm_activitybycandidateCtrl'
                }).
                when('/reports/hotlist_by_cm', {
                    templateUrl: '/views/reports/hotlist_by_cm.html',
                    controller: 'cm_activitybycmCtrl'
                }).
                when('/reports/hotlistdetails_by_cm', {
                    templateUrl: '/views/reports/hotlistdetails_by_cm.html',
                    controller: 'cm_activitydetailbycmCtrl'
                }).
                when('/reports/hotlist_by_vendor', {
                    templateUrl: '/views/reports/hotlist_by_vendor.html',
                    controller: 'cm_activitybyvendorCtrl'
                }).
                when('/reports/hotlist_candidate_analysis', {
                    templateUrl: '/views/reports/hotlist_candidate_analysis.html',
                    controller: 'ReportCtrl'
                }).
                otherwise({
                    redirectTo: '/dashboard'
                });
    }
]);

