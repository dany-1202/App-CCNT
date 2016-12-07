var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('homeController', function($timeout, $rootScope, $scope, $http, $location, SessionService) {
	
	$scope.user = {};
	$scope.user.configuration = SessionService.get('user_configured');


	$scope.$watch('user.configuration', function() {
		
	});

	$rootScope.$watch('config', function() {
		alert("VariableModifie");
		$scope.user.configuration = $rootScope.user.config;
	});

  $scope.lancerConfig = function () {
    $location.url("/config-init");
  }
});
