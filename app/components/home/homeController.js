var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('homeController', function($timeout, $rootScope, $scope, $http, $location, SessionService) {

	$scope.user = $rootScope.user == undefined ? {id:SessionService.get('user_id'),nom:SessionService.get('user_nom'),prenom:SessionService.get('user_prenom'),type: SessionService.get('user_type'),token:SessionService.get('user_token'),config:SessionService.get('user_configured')} : angular.copy($rootScope.user);
  

  /*
  $scope.validate = function () {
    console.log($scope.user);
  }

  $timeout($scope.validate, 0); */

  $scope.lancerConfig = function () {
    $location.url("/config-init");
  }
});
