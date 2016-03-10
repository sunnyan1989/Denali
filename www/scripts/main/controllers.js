'use strict';

var mainControllers = angular.module('mainControllers', []);

mainControllers.controller('MainCtrl', ['$scope', 'LoggedInUser', 'logger',
    function($scope, LoggedInUser, logger) {
        $scope.brand = "Valiantica";
        //sets the loggedInUser information in main scope

        $scope.isuser = 0;
        $scope.istenantadmin = 0;
        $scope.isglobaladmin = 0;
        $scope.isforcm = 0;
        $scope.isforeq = 0;
        $scope.isMarketing = 0;
        $scope.isManager = 0;
        $scope.isAccounting = 0;
        $scope.isSales = 0;
        $scope.isRecruiter = 0;

        //alert($scope.isuser);

        LoggedInUser.post(function(data) {
            //alert(data);
            $scope.loggedInUser = data;

            $scope.isuser = data.isuser;
            $scope.istenantadmin = data.istenantadmin;
            $scope.isglobaladmin = data.isglobaladmin;
            $scope.isforcm = data.isforcm;
            $scope.isforeq = data.isforeq;

            console.log(data.roles.toString());

            var k = data.roles.indexOf("Candidate Marketing");
            if (k !== -1) {
                $scope.isMarketing = 1;
            }

            var k = data.roles.indexOf("Manager");
            if (k !== -1) {
                $scope.isManager = 1;
            }

            var k = data.roles.indexOf("Sales");
            if (k !== -1) {
                $scope.isSales = 1;
            }

            var k = data.roles.indexOf("Recruiter");
            if (k !== -1) {
                $scope.isRecruiter = 1;
            }

            var k = data.roles.indexOf("Accounting");
            if (k !== -1) {
                $scope.isAccounting = 1;
            }

            //alert($scope.isAccounting);

        });

        //method to report status messages on a page
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

        //sets global status data
        $scope.statusData = [
            {name: 'All', value: null},
            {name: 'Active', value: '1'},
            {name: 'Inactive', value: '2'},
        ];
        //global status list for lookup based on statusid
        $scope.statusList = ['All', 'Active', 'Inactive'];

    }
]);


mainControllers.controller('HeaderCtrl', ['$scope', '$http', '$window',
    function($scope, $http, $window) {
        $scope.signout = function() {
            $http.post('/services/login/signout').success(function(result) {
                //alert(result.msg);
                //alert(result[0].caller_sid);
                if (result.msg) {
                    $scope.notify('error', result.msg);
                } else {
                    //$window.location.href = '/login.html';
                }
            });
            $window.location.href = '/login.html';
        }
    }
]);

/*
 * Controller for user profile page
 */
mainControllers.controller('UserProfileCtrl', ['$scope', '$http', '$modal',
    function($scope, $http, $modal) {
        $scope.init = function() {
            $http.post('/services/users/getProfile')
                    .success(function(user) {
                        if (user.msg) {
                            $scope.notify('error', user.msg);
                        }
                        $scope.user = user[0];
                    });
        };

        $scope.edit = function() {
            var modalInstance = $modal.open({
                templateUrl: 'views/user-profile-edit.html',
                controller: 'UserProfileEditCtrl',
                resolve: {
                    user: function() {
                        return $scope.user;
                    }
                }
            });

            modalInstance.result.then(function(result) {
                if (result.err)
                    $scope.notify('error', result.msg);
                else
                    $scope.notify('success', result.msg);
                $scope.init();
            }, function() {
                $scope.init();
            });

        };

        $scope.init();
    }
]);

/**
 * Controller for user profile edit page
 */
mainControllers.controller('UserProfileEditCtrl',
        ['$scope', '$http', '$modalInstance', 'user', 'FileUploader', 'LoggedInUser',
            function($scope, $http, $modalInstance, user, FileUploader, LoggedInUser) {
                $scope.user = user;
                $scope.user.changePassword = false;
                //$scope.master = angular.copy($scope.user);
                $scope.forms = {basicForm: null, passwordForm: null};

                $scope.uploader = new FileUploader({
                    url: '/services/users/updateUsersLogo'
                });

                $scope.loggedInUser = {
                    picturelink: ''
                };

                $scope.uploader.filters.push({
                    name: 'imageFilter',
                    fn: function(item, options) {
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                    }
                });

                $scope.save = function() {
                    var u = {
                        name: $scope.user.name,
                        userid: $scope.user.userid,
                        picturelink: '',
                        changePassword: $scope.user.changePassword,
                        password: $scope.user.password,
                        newPassword: $scope.user.newPassword
                    };

                    $scope.uploader.onCompleteItem = function(item, result) {
                        if (result.err) {
                            //alert(result.err);
                            //$modalInstance.close(result);
                        }
                        else {
                            //alert(result.logolink);
                            u.picturelink = result.picturelink;
                            $http.post('/services/users/updateProfile', {user: u})
                                    .success(function(result) {
                                        //alert(u.picturelink);
                                        $scope.loggedInUser.picturelink = u.picturelink;
                                        //$modalInstance.close({err: false, msg: 'Updated User: ' + u.name + ' successfully'});
                                        $modalInstance.close(result);
                                    })
                                    .error(function(data, status) {
                                        $modalInstance.close({err: true, msg: 'Server error'});
                                    });

                        }
                    };

                    var queueLength = $scope.uploader.queue.length;

                    if (queueLength) {
                        var item = $scope.uploader.queue[queueLength - 1]; // upload last item in queue	
                        item.upload();
                    } else {
                        $http.post('/services/users/updateProfile', {user: u})
                                .success(function(result) {
                                    $modalInstance.close(result);
                                })
                                .error(function(data, status) {
                                    $modalInstance.close({err: true, msg: 'Failed to update User: ' + u.name});
                                });
                    }

                    //save in database
                };

                $scope.reset = function() {
                    $scope.user = angular.copy($scope.master);
                    if ($scope.forms.basicForm != null)
                        $scope.forms.basicForm.$setPristine();
                    if ($scope.forms.passwordForm != null)
                        $scope.forms.passwordForm.$setPristine();
                };

                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
            }
        ]);



