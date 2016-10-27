/* JS pour les inputs*/ 
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('connexionController', function($scope, ConnexionService, $http) {
	$scope.user = {
	  logon: 'jpb@gprh.ch',
	  password: 'gprh',
	};
  $scope.connexion = function() {
      var data = $scope.user;
      ConnexionService.login(data, $scope);
  }
})

ctrlCCNT.config(function($mdThemingProvider) {
	// Configure a dark theme with primary foreground blue
	$mdThemingProvider.theme('docs-white', 'default')
	  .primaryPalette('blue')
});