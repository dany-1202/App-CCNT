var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('employeController', function($timeout, $rootScope, $scope, $http, $location, SessionService, NotifService, State, $route, PromiseDAO) {
	$scope.$route = $route;
	$scope.affCarre = true;
	$scope.idUser = -1;

	var data = {user_id : SessionService.get('user_id'), user_token: SessionService.get('user_token')};
        	$scope.employe = []; //Tableau contenant les employes

        	$scope.getEmployes = function () {
        		PromiseDAO.getAllEmployees(data).then(function(resolve) {
                        $scope.employe = resolve;
                     });
        	}

        	$scope.getEmployes();

        	/* Ajout d'une personne */
        	$scope.ajouterEmploye = function () {
        		$rootScope.myEmp = null;
        		$location.url("/employe/edition");
        	}

        	/* Suppression d'un employé (la suppression n'a pas vraiment lieu - le champ per_inactif est mis à 1) */
        	$scope.supEmploye = function(index) {
        		data.id = $scope.employe[index].id;
        		var nom = $scope.employe[index].nom;
                     var prenom = $scope.employe[index].prenom;
        		UIkit.modal.confirm('<h3>Voulez vous vraiment supprimer <strong>' + nom + " " + prenom + "</strong>?</h3>", {center: true}).then(function() {
	  		// Supprimer de la base de données
	  		var $promise = $http.post('assets/php/supEmployeeAPI.php', data);
	  		$promise.then(function (message) {
	  			if (message.data) {
	  				NotifService.success("Suppression d'employé", "L'employé : " + nom + " " + prenom + " a été supprimé avec succès");
	  			} else {
	  				NotifService.error("Suppression d'employé", "L'employé : " + nom + " " + prenom + " n'a pu étre supprimé");
	  			}
	  		});
	  		$scope.employe.splice(index,1);
	  		if ($scope.employe.length == 0) {
	  			SessionService.set('user_confEmp', false);
	  		} else {
	  			SessionService.set('user_confEmp', true);
	  		}
	  	}, function () {return;});
        	};

        	$scope.modEmploye = function(id) {
        		$rootScope.myEmp = $scope.employe[id];
                     if ($rootScope.myEmp.dateOut == "Invalid Date") {$rootScope.myEmp.dateOut = null;}
        		$location.url("/employe/edition");
        	};
});

/*****************************************************************************************\
    * Filtre pour afficher l'age comme il faut exemple : 17 ans *                        
    \*****************************************************************************************/
ctrlCCNT.filter('age', function(DateFactory) {
    	return function(date) {
    		return DateFactory.getAge(date) + " ans";
    	};
})

/*///////////////////////////////////////////////////////////////////////////////////////*/