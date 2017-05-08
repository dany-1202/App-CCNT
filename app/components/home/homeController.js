(function(){
	var ctrlCCNT = angular.module('ctrlCCNT');

	ctrlCCNT.controller('homeController', function($timeout, $rootScope, $scope, $http, $location, SessionService, ModalTuto, $mdDialog, State, $route, DateFactory) {
		$scope.$route = $route;

		//récupérer les départements
		$scope.departements = [];
		$scope.getDepartements = function(){
			var $res = $http.post('assets/php/getDepartementsAPI.php', {'user_id': SessionService.get('user_id'), 'user_token': SessionService.get('user_token')});
			$res.then(function (message) {
				$scope.departements = message.data;
				$scope.getEmployesPourJour();
			});
			
		}

		var getEmployes = function(id,message){
			$scope.departements[id].tab = [];
			for (var x = 0; x < message.data.length; x++) {
				var employe = message.data[x];
				$scope.departements[id].tab.push(employe);
			};
		}

		$scope.getEmployesPourJour = function(){
			for (var i = 0; i < $scope.departements.length; i++) {
				var $resu = $http.post('assets/php/getEmployeDuJourAPI.php', {'user_id': SessionService.get('user_id'), 'user_token': SessionService.get('user_token'), 'idDep': $scope.departements[i].id,'date':DateFactory.getDateBDD(new Date()),'index':i});
				$resu.then(function (message){
					getEmployes(message.config.data.index,message);
				});
			};
			console.log($scope.departements);
		}


		$scope.getDepartements();
		

		$scope.lancerConfigEmp = function () {$location.url("/employe");}
		
		$scope.lancerConfig = function (ev) {
			ModalTuto.showModal(ev, 1);
		}


	});
})();