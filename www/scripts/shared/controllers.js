//Shared controllers
var sharedControllers = angular.module('sharedControllers', []);

/**
* Controller for data table
* Assumes tableData is inherited from parent controller
*/
sharedControllers.controller('TableCtrl', ['$scope', '$filter', 
	function($scope, $filter) {
		$scope.select = function(page) {
			var end, start;
			start = (page - 1) * $scope.numPerPage;
			end = start + $scope.numPerPage;
			return $scope.currentPageData = $scope.filteredData.slice(start, end);
		};
		$scope.onFilterChange = function() {
			$scope.select(1);
			$scope.currentPage = 1;
			return $scope.row = '';
		};
		$scope.onNumPerPageChange = function() {
			$scope.select(1);
			return $scope.currentPage = 1;
		};
		$scope.onOrderChange = function() {
			$scope.select(1);
			return $scope.currentPage = 1;
		};
		$scope.filterData = function() {
			$scope.filteredData = $filter('filter')($scope.tableData, $scope.filterKeywords);
			return $scope.onFilterChange();
		};
		$scope.order = function(rowName) {
			if ($scope.row === rowName) {
				return;
			}
			$scope.row = rowName;
			$scope.filteredData = $filter('orderBy')($scope.tableData, rowName);
			return $scope.onOrderChange();
		};
		
		$scope.init = function() {	
			$scope.filterKeywords = '';
			$scope.filteredData = [];
			$scope.row = '';
			$scope.currentPage = 1;
			$scope.currentPageData = [];		
			$scope.filterData();
			$scope.select($scope.currentPage);
		};
		
		$scope.numPerPageOpt = [5, 10, 20, 50, 100];
		$scope.numPerPage = $scope.numPerPageOpt[2];
}
]).directive('myTableData', function() {
		function link(scope, element, attrs) {
			scope.$watch(attrs.myTableData, function(value) {	
				//Initializes table when table data changes in parent controller
				scope.tableData = value;
				scope.init();
			});
			
		}
		return {
			link: link
		}
});

