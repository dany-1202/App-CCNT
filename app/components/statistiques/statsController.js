var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('statsController', function ($scope, SessionService, PromiseDAO, $http) {

     //Déclaration des variables et tableaux
	var data = {user_id : SessionService.get('user_id'), user_token: SessionService.get('user_token')};
     $scope.employes = []; //Tableau contenant les employes
     $scope.months = []; //Tableau contenant les 12 mois de l'année
     $scope.dayOfMonthNumber = [];

     //méthode d'initialisation du controller
     $scope.onCreate = function() {
          $scope.getMonths();
          $scope.getEmployes();
          $scope.getDayOfMonthNumber();
     }

     //méthode pour récupérer la liste des employés
	$scope.getEmployes = function () {
		PromiseDAO.getAllEmployees(data).then(function(resolve) {
			$scope.employes = resolve;
			for (var i = 0; i < $scope.employes.length; i++) {
				var emp = $scope.employes[i];
				var dataEmp = {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), per_id : emp.id, dateDebut: '2017-01-01', dateFin: '2017-12-31', mois: (moment().month() + 1), annee: (moment().year()), eta_id: emp.dep.eta_id};
				var $res = $http.post('assets/php/getInfosSoldeHoraireEmployeeAPI.php', dataEmp);
				$res.then(function(value){
					emp.solde = {infoSolde : JSON.parse(value.data.infoSolde), infoSoldeMois : JSON.parse(value.data.infoSoldeMois),soldeCourant : JSON.parse(value.data.soldeCourant)};
				}).then(function(error){
					console.log(error);
				});
			}
		});
	}

     $scope.getMonths = function() {
          $scope.months = [
               {id: '0', name: 'Janvier', court: 'Janv.'},
               {id: '1', name: 'Février', court: 'Févr.'},
               {id: '2', name: 'Mars', court: 'Mars'},
               {id: '3', name: 'Avril', court: 'Avri.' },
               {id: '4', name: 'Mai', court: 'Mai'},
               {id: '5', name: 'Juin', court: 'Juin.'},
               {id: '6', name: 'Juillet', court: 'Juil.'},
               {id: '7', name: 'Aout', court: 'Aout.'},
               {id: '8', name: 'Septembre', court: 'Sept.'},
               {id: '9', name: 'Octobre', court: 'Octo.'},
               {id: '10', name: 'Novembre', court: 'Nove.'},
               {id: '11', name: 'Décembre', court: 'Déce.'}
          ]; 
     }

     $scope.getDayOfMonthNumber = function() {
          for (var i = 1; i<=31; i++){
               $scope.dayOfMonthNumber.push ({day:i});
          }
     }

     $scope.onCreate ();
});