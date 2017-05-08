(function(){
	var ctrlCCNT = angular.module('ctrlCCNT');

	ctrlCCNT.controller('homeController', function($timeout, $rootScope, $scope, $http, $location, SessionService, ModalTuto, $mdDialog, State, $route) {
		$scope.$route = $route;

		$scope.lancerConfigEmp = function () {$location.url("/employe");}
		
		$scope.lancerConfig = function (ev) {
			ModalTuto.showModal(ev, 1);
		}


	});
})();