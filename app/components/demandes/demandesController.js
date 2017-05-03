(function(){
	var ctrlCCNT = angular.module('ctrlCCNT');

	ctrlCCNT.controller('demandesController', function($route,$timeout, $rootScope, $scope, $http, $location, SessionService, $mdDialog, State, $route) {
		$scope.$route = $route;
		$scope.demc = $scope;
		var data = {user_id : SessionService.get('user_id'), user_token: SessionService.get('user_token')};
		$scope.demandes = [];

		$timeout(function() {$('.ui.dropdown').dropdown();}, 10);
		$scope.getDemandes = function () {
			//data.employes = [];
			//data.employes = angular.copy($scope.employe);
			var $promise = $http.post('assets/php/getDemandesAPI.php', data);
			$promise.then(function (message) {
				console.log(message);
				var tab = message.data;
				console.log(tab);
				if (tab != 'null') {
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
							style = {"background":"#27ae60"};
							statutFR = "Accepté";
							break;
							case "refuse":
							style = {"background":"#c0392b"};
							statutFR = "Refusé";
							break;
							case "modifyAccept":
							style = {"background":"#27ae60"};
							statutFR = "Accepté";
							break;
							case "modifyRefuse":
							style = {"background":"#c0392b"};
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
				}

			});
		}

	$scope.getDemandes();

	console.log($scope.demandes);

	$scope.traiterDemandes = function(boolean, demande) {
		var len = $scope.demandes.length;

		console.log(demande);
		data.demande = demande;
		data.demande.accept = boolean;
		console.log(data);
		var $promise = $http.post('assets/php/accepterDemandesAPI.php', data);
		$promise.then(function (message) {
			console.log(message);
			if (demande.statut == 'new') {
				demande.statut = (boolean ? 'accept' : 'refuse');
			} else {
				demande.statut = (boolean ? 'modifyAccept' : 'modifyRefuse');
			}
			demande.statutFR = (boolean ? 'Accepté' : 'Refusé');
			demande.style = {"background": (boolean ? "#27ae60" : "#c0392b")};
		});
	}

});
})();