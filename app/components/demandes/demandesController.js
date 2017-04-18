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
	          		var style = "";
	          		var statutFR = "";
	          		switch(demande.statut) {
					    case "new":
					        style = {"background":"#1e87f0"};
					        statutFR = "Nouveau";
					        break;
					    case "modify":
					        style = {"background":"#faa05a"};
					        statutFR = "Modifié";
					        break;
					    case "accept":
					        style = {"background":"#32d296"};
					        statutFR = "Accepté";
					        break;
					    case "modifyAccept":
					        style = {"background":"#32d296"};
					        statutFR = "Accepté";
					        break;
					     case "modifyRefuse":
					        style = {"background":"#f0506e"};
					        statutFR = "Refusé";
					        break;
					} 

	          		$scope.demandes.push({
	                       	idPers:demande.id,
	                       	nom:demande.nom,
	                       	prenom:demande.prenom,
	                       	idDem:demande.dpe_id,
	                       	dateDebut:demande.dateDebut,
	                       	dateFin:demande.dateFin,
	                       	motif:demande.motif,
	                       	statut:demande.statut,
	                       	nomDemande:demande.nomDemande,
	                       	style:style,
	                       	statutFR:statutFR
                 	});	
	          	}
	    });
	}

    $scope.getDemandes();
	
    $scope.accepter = function (demande) {
    	console.log("accepter");
    	console.log(demande);
    	data.demande = demande;
    	var $promise = $http.post('assets/php/accepterDemandesAPI.php', data);
	    $promise.then(function (message) {});
    }

    $scope.refuser = function (demande) {
    	console.log("refuser");
    	console.log(demande);
    	data.demande = demande;
    	var $promise = $http.post('assets/php/refuserDemandesAPI.php', data);
	    $promise.then(function (message) {});
    }

});
})();