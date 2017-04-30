var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('statsController', function ($scope, SessionService, PromiseDAO, $http) {
	var data = {user_id : SessionService.get('user_id'), user_token: SessionService.get('user_token')};
     	$scope.employes = []; //Tableau contenant les employes
     	console.log();
     	$scope.getEmployes = function () {
     		PromiseDAO.getAllEmployees(data).then(function(resolve) {
     			$scope.employes = resolve;
     			for (var i = 0; i < $scope.employes.length; i++) {
     				var emp = $scope.employes[i];
     				console.log(emp);
     				var dataEmp = {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), per_id : emp.id, dateDebut: '2017-01-01', dateFin: '2017-12-31', mois: (moment().month() + 1), annee: (moment().year()), eta_id: emp.dep.eta_id};
     				var $res = $http.post('assets/php/getInfosSoldeHoraireEmployeeAPI.php', dataEmp);
     				$res.then(function(value){
     					emp.solde = {infoSolde : JSON.parse(value.data.infoSolde), infoSoldeMois : JSON.parse(value.data.infoSoldeMois),soldeCourant : JSON.parse(value.data.soldeCourant)};
     				}).then(function(error){
     					console.log(error);
     				});
     			}
     			console.log($scope.employes);
     		});
     	}

     	$scope.getEmployes();
});