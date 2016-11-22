var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('homeController', function($rootScope, $scope, $http, $location, SessionService) {
	$scope.user = {prenom: SessionService.get('user_prenom'), nom:SessionService.get('user_nom'), type:SessionService.get('user_type')}; // Reprend les données du rootScope (scope racine) tous les contrôleurs y ont accès
  $scope.lancerConfig = function () {
    $location.url("/config-init");
  }
});
