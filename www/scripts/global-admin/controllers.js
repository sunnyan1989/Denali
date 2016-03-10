'use strict';
//Global admin controllers
var globalAdminControllers = angular.module('globalAdminControllers', []);

globalAdminControllers.controller('TenantListCtrl', ['$scope', '$http', '$modal', "FileUploader",
    function($scope, $http, $modal, FileUploader) {
        $scope.curStatus = $scope.statusData[1];
        $scope.searchKeys = {
            statusSid: $scope.curStatus.value,
            name: "",
        };
        $scope.tenants = [];
        $scope.page_ishow = true;

        //Get tenants filtered by search fields
        $scope.search = function() {
            $scope.searchKeys.statusSid = $scope.curStatus.value;
            $http.post('services/tenants/', $scope.searchKeys).success(function(tenants) {
                if (tenants.msg) {
                    $scope.notify('error', tenants.msg);
                }
                $scope.tenants = tenants;
                $scope.page_ishow = false;
            });
        };

        $scope.add = function() {

            var modalInstance;
            modalInstance = $modal.open({
                backdrop: true,
                windowClass: 'modal',
                templateUrl: "views/tenant-detail.html",
                controller: function($scope, $http, $modalInstance, $log) {

                    $scope.uploader = new FileUploader({
                        url: '/services/tenants/updateTenantLogo'
                    });

                    $scope.uploader.filters.push({
                        name: 'imageFilter',
                        fn: function(item, options) {
                            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
                        }
                    });

                    $scope.submit = function(tenant) {
                        $scope.tenant = tenant;

                        $scope.uploader.onCompleteItem = function(item, result) {
                            if (result.err) {
                                //alert(result.err);
                                //$modalInstance.close(result);
                            }
                            else {
                                $scope.person.picturelink = result.picturelink;
                                $http.post('/services/tenants/addNew', $scope.tenant).success(function(result1) {
                                    //$scope.$parent.$broadcast('mynotify', "");
                                });
                            }
                        };

                        var queueLength = $scope.uploader.queue.length;

                        if (queueLength) {
                            var item = $scope.uploader.queue[queueLength - 1]; // upload last item in queue	
                            item.upload();
                        } else {
                            $http.post('/services/tenants/addNew', $scope.tenant).success(function(result1) {
                                //$scope.$parent.$broadcast('mynotify', "");
                            });
                        }

                    };
                    $scope.cancel = function() {
                        $modalInstance.dismiss('cancel');
                    };
                }
            });

            modalInstance.result.then(function(result) {
                if (result.err) {
                    $scope.notify('error', result.msg);
                } else {
                    $scope.notify('success', result.msg);
                    $scope.search();
                }
            }, function() {
                //$scope.search();
            });

        };

        //Open edit model when edit is clicked in tenant table
        $scope.edit = function(tenant) {
            var tenantDetailInstance = $modal.open({
                templateUrl: 'views/tenant-detail.html',
                controller: 'TenantDetailCtrl',
                resolve: {
                    tenant: function() {
                        return tenant;
                    }
                }
            });
            tenantDetailInstance.result.then(function(result) {
                if (result.err)
                    $scope.notify('error', result.msg);
                else{
                    $scope.notify('success', result.msg);
                    $scope.search();
                }
               // $scope.search();
            }, function() {
                //$scope.search();
            });
        };

        $scope.search();

    }
]);

globalAdminControllers.controller('TenantDetailCtrl', ['$scope', '$http', '$modalInstance', 'tenant', 'FileUploader',
    function($scope, $http, $modalInstance, tenant, FileUploader) {
        tenant.statusid = tenant.statusid.toString();
        $scope.tenant = tenant;
        $scope.master = angular.copy($scope.tenant);
        $scope.forms = {tenantForm: null};

        $scope.uploader = new FileUploader({
            url: '/services/tenants/updateTenantLogo'
        });

        $scope.uploader.filters.push({
            name: 'imageFilter',
            fn: function(item, options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        $scope.save = function() {
            
            $scope.tenant = angular.copy($scope.master);
            
            var t = {
                sid: $scope.tenant.sid,
                startdate: $scope.tenant.startdate,
                enddate: $scope.tenant.enddate,
                description: $scope.tenant.description,
                statusid: $scope.tenant.statusid,
                name: $scope.tenant.name,
                adminuser_sid: $scope.tenant.adminuser_sid,
                logolink: "",
                maxusers: $scope.tenant.maxusers
            }
            //save in database

            $scope.uploader.onCompleteItem = function(item, result) {
                if (result.err) {
                    //alert(result.err);
                    //$modalInstance.close(result);
                }
                else {
                    //alert(result.logolink);
                    t.logolink = result.logolink;
                    $http.post('/services/tenants/update', {tenant: t})
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
                $http.post('/services/tenants/update', {tenant: t})
                        .success(function(result) {
                            $modalInstance.close(result);
                        })
                        .error(function(data, status) {
                            $modalInstance.close({err: true, msg: 'Server error'});
                        });
            }

        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        }
    }
]);
