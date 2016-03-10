'use strict';
//Global admin controllers
var companyAdminControllers = angular.module('companyAdminControllers', []);
/*
 * Controller for User List page
 */
companyAdminControllers.controller('UserListCtrl', ['$scope', '$http', '$modal',
    function($scope, $http, $modal) {

        //console.log($scope.loggedInUser);
        var tenant_sid = $scope.loggedInUser.tenant_sid;
        $scope.curStatus = $scope.statusData[1];
        $scope.userTypeData = [
            {name: 'All'},
            {name: 'User', key: 'isuser'},
            {name: 'Admin', key: 'isTenantAdmin'},
            {name: 'For CM', key: 'isForCM'},
            {name: 'For REQ', key: 'isForREQ'},
        ];
        $scope.curUserType = $scope.userTypeData[0];
        $scope.searchKeys = {
            statusSid: $scope.curStatus.value,
            name: '',
            userId: '',
            isTenantAdmin: '',
            isuser: '',
            isForCM: '',
            isForREQ: '',
            curUserType: ''
        };
        $scope.users = [];
        $scope.roles = [];

        $scope.page_ishow = true;

        $scope.init = function(done) {

            $http.post('services/users/getRoles').success(function(roles) {
                $scope.roles[0] = "None"
                for (var i = 0; i < roles.length; i++) {
                    if (roles[i].sid !== 1) {
                        $scope.roles[parseInt(roles[i].sid)] = roles[i].name;
                    }
                }
                done();
            });

        }
        //Get tenants filtered by search fields
        $scope.search = function() {
            $scope.searchKeys.statusSid = $scope.curStatus.value;
            $scope.searchKeys.isTenantAdmin = '';
            $scope.searchKeys.isForCM = '';
            $scope.searchKeys.isForREQ = '';
            $scope.searchKeys.isuser = '';
            $scope.searchKeys.name = $scope.searchKeys.name;
            $scope.searchKeys.curUserType = $scope.searchKeys.curUserType;
            //alert($scope.curUserType.key);
            if ($scope.curUserType.name != 'All')
                $scope.searchKeys[$scope.curUserType.key] = 1;

            $http.post('/services/users', $scope.searchKeys).success(function(users) {

                if (users.msg) {
                    $scope.notify('error', users.msg);
                }

                $scope.users = users;
                $scope.page_ishow = false;

            });
        };

        //Open popup to update or add user
        $scope.openUserDetailPage = function(user, type) {
            var userDetailInstance = $modal.open({
                templateUrl: 'views/user-detail.html',
                controller: 'UserDetailCtrl',
                resolve: {
                    user: function() {
                        return user;
                    },
                    type: function() {
                        return type;
                    },
                    tenant_sid: function() {
                        return tenant_sid;
                    },
                    roles: function() {
                        return $scope.roles;
                    }
                }
            });
            userDetailInstance.result.then(function(result) {
                if (result.err)
                    $scope.notify('error', result.msg);
                else {
                    $scope.notify('success', result.msg);
                    $scope.search();
                }
            }, function() {
                //$scope.search();
            });

        };

        //Add a new user
        $scope.add = function() {
            $scope.openUserDetailPage(null, 'add');
        }

        //edit a user
        $scope.edit = function(user) {
            $scope.openUserDetailPage(user, 'update');
        }

        $scope.init(function() {
            $scope.search();
        });

    }
]);

/*
 * Controller for user detail page
 */
companyAdminControllers.controller('UserDetailCtrl',
        ['$scope', '$http', '$modalInstance', 'user', 'type', 'tenant_sid', 'roles', 'FileUploader',
            function($scope, $http, $modalInstance, user, type, tenant_sid, roles, FileUploader) {

                if (type === 'add')
                    $scope.title = 'Create New User';
                if (type === 'update')
                    $scope.title = 'Edit User';
                $scope.roles = roles;

                if (user) {

                    $scope.master = angular.copy(user);

                    var rolesids = [];
                    angular.forEach($scope.roles, function(value, key) {
                        if (user.roles) {
                            if (user.roles.indexOf(value) !== -1) {
                                rolesids.push(key.toString());
                            }
                        }
                    });

                    $scope.master.statusid = user.statusid.toString();
                    $scope.master.oldstatusid = user.statusid.toString();
                    $scope.master.isuser = user.isuser.toString();
                    $scope.master.isforcm = user.isforcm.toString();
                    $scope.master.isforeq = user.isforeq.toString();
                    $scope.master.istenantadmin = user.istenantadmin.toString();
                    $scope.master.changePassword = true;
                    $scope.master.passwordrequire = false;
                    $scope.master.edit = true;

                    //console.log("rolesids---" + rolesids);
                    if (rolesids.length > 0) {
                        $scope.master.roles = rolesids;
                    } else {
                        $scope.master.roles = ["0"];
                    }

                    $scope.master.tenant_sid = tenant_sid;
                    
                    if (user.isuser === 1) {
                        $scope.master.password = "******";
                    }

                } else {
                    $scope.master = {
                        statusid: '1',
                        startdate: new Date(),
                        roles: ['0'],
                        isuser: '1',
                        changePassword: false,
                        edit: false,
                        passwordrequire: true,
                        tenant_sid: tenant_sid
                    };
                }

                $scope.checkUserRole = function(isuser, istenantadmin) {
                    if(istenantadmin==="1"){
                        $scope.master.isuser = "1";
                    }
                }

                $scope.uploader = new FileUploader({
                    url: '/services/users/updateUsersLogo'
                });

                $scope.uploader.filters.push({
                    name: 'imageFilter',
                    fn: function(item, options) {
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                    }
                });

                $scope.save = function() {

                    $scope.user = angular.copy($scope.master);

                    $scope.user.userid = (typeof $scope.user.userid !== "undefined") ? $scope.user.userid : "";

                    var u = {
                        sid: $scope.user.sid,
                        statusid: $scope.user.statusid,
                        name: $scope.user.name,
                        userid: $scope.user.userid,
                        startdate: $scope.user.startdate,
                        enddate: $scope.user.enddate,
                        istenantadmin: $scope.user.istenantadmin,
                        isuser: $scope.user.isuser,
                        isforcm: $scope.user.isforcm,
                        isforeq: $scope.user.isforeq,
                        password: $scope.user.password,
                        picturelink: "",
                        roles: $scope.user.roles
                    };

                    if (u.roles.indexOf('0') !== -1)
                        u.roles = [];// if 'None' is present in the list			
                    if (type === 'update')
                        u.changePassword = $scope.user.changePassword;
                    //console.log(u);
                    //save in database
                    $scope.uploader.onCompleteItem = function(item, result) {
                        if (result.err) {
                            //alert(result.err);
                            //$modalInstance.close(result);
                        } else {
                            //alert(result.logolink);
                            u.picturelink = result.picturelink;
                            $http.post('/services/users/' + type, {user: u})
                                    .success(function(result) {
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
                        $http.post('/services/users/' + type, {user: u})
                                .success(function(result) {
                                    $modalInstance.close(result);
                                })
                                .error(function(data, status) {
                                    $modalInstance.close({err: true, msg: 'Server error'});
                                });
                    }

                };

                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
            }
        ]);

/*
 * Controller for company profile page
 */
companyAdminControllers.controller('TenantProfileCtrl', ['$scope', '$http', '$modal',
    function($scope, $http, $modal) {

        //$scope.tenant = {};
        $scope.init = function() {

            $http.post('/services/tenants/getProfile').success(function(tenant) {
                if (tenant.msg) {
                    $scope.notify('error', tenant.msg);
                }
                $scope.tenant = tenant[0];
            });

        };

        $scope.edit = function() {
            var modalInstance = $modal.open({
                templateUrl: 'views/tenant-profile-edit.html',
                controller: 'TenantProfileEditCtrl',
                resolve: {
                    tenant: function() {
                        return $scope.tenant;
                    }
                }
            });

            modalInstance.result.then(function(result) {
                //alert(result.err);
                if (result.err) {
                    $scope.notify('error', result.msg);
                } else {
                    $scope.init();
                    $scope.notify('success', result.msg);
                }
            }, function() {
                $scope.init();
            });

        };

        $scope.init();
    }
]);

/**
 * Controller for tenant profile edit page
 */
companyAdminControllers.controller('TenantProfileEditCtrl',
        ['$scope', '$http', '$modalInstance', 'tenant', 'FileUploader',
            function($scope, $http, $modalInstance, tenant, FileUploader) {
                $scope.tenant = tenant;
                $scope.uploader = new FileUploader({
                    url: '/services/tenants/updateTenantLogo'
                });

                //upload only image files
                $scope.uploader.filters.push({
                    name: 'imageFilter',
                    fn: function(item, options) {
                        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                    }
                });

                // Register callback for upload complete
                $scope.uploader.onCompleteItem = function(item, result) {
                    if (result.err)
                        $modalInstance.close(result);
                    else {
                        $scope.tenant.logolink = result.logolink;
                        $scope.saveTenant();
                    }
                };

                $scope.master = angular.copy($scope.tenant);

                $scope.save = function() {
                    var queueLength = $scope.uploader.queue.length;
                    if (queueLength) {
                        var item = $scope.uploader.queue[queueLength - 1]; //upload last item in queue	
                        item.upload();
                    } else
                        $scope.saveTenant();
                };

                $scope.saveTenant = function() {
                    var t = {
                        name: $scope.tenant.name,
                        description: $scope.tenant.description,
                        logolink: $scope.tenant.logolink
                    };

                    //save in database
                    $http.post('/services/tenants/updateProfile', {tenant: t})
                            .success(function(result) {
                                $modalInstance.close(result);
                            })
                            .error(function(data, status) {
                                $modalInstance.close({err: true, msg: 'Server error'});
                            });

                };

                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };
            }
        ]);
