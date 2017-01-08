var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('homeController', function($timeout, $rootScope, $scope, $http, $location, SessionService) {
	
	$scope.user = {};
	$scope.user.configuration = SessionService.get('user_configured');

	$scope.lancerConfig = function () {
	   $location.url("/config-init");
	}
});
