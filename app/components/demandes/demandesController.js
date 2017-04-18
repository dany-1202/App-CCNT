(function(){
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('demandesController', function($timeout, $rootScope, $scope, $http, $location, SessionService, $mdDialog, State, $route) {
		
	var data = {user_id : SessionService.get('user_id'), user_token: SessionService.get('user_token')};
	$scope.demandes = [];

	$scope.getDemandes = function () {
		//data.employes = [];
		//data.employes = angular.copy($scope.employe);
	    var $promise = $http.post('assets/php/getDemandesAPI.php', data);
	    $promise.then(function (message) {
      		console.log(message);
	          var tab = message.data;
	          	for (var i = 0; i < tab.length; i++) {
	          		var demande = tab[i];

	          		$scope.demandes.push({
	                       	id:demande.id,
	                       	nom:demande.nom,
	                       	prenom:demande.prenom,
	                       	dateDebut:demande.dateDebut,
	                       	dateFin:demande.dateFin,
	                       	motif:demande.motif,
	                       	statut:demande.statut,
	                       	nomDemande:demande.nomDemande
                 	});	
	          	}
	    });
	}

      $scope.getDemandes();
	
});
})();