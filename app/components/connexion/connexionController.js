/* JS pour les inputs*/ 
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('connexionController', function($scope, ConnexionService, $http) {
	$scope.user = {
	  login: null,
	  password: null,
	};
  $scope.connexion = function() {
      var data = $scope.user;
      if ($scope.user.login != null && $scope.user.password != null) {
      	ConnexionService.login(data, $scope);
      }
  };
  $scope.verificationChamps = function() {
  	var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
    if ($scope.user.login == null) {return true;}
    return pattern.test($scope.user.login);
  };
});

ctrlCCNT.config(function($mdThemingProvider) {
	// Configure a dark theme with primary foreground blue
	$mdThemingProvider.theme('docs-dark', 'default')
	  .primaryPalette('brown')
});