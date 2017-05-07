/**
* Module qui gérer les fenêtre dialog pour la déconnexion de l'utilisateur
* Ce module devra être généralisé afin qu'il gère toutes sortes de fenêtres modales
* 
**/
var dialog= angular.module('ctrlCCNT');

dialog.controller('modalController',function($scope, $mdDialog, NotifService, $route, $location, AuthenticationService) {
	$scope.status = '  ';
    	$scope.customFullscreen = false; // Prend tout l'écran : non

    	var showModal = function(ev) {
    		var confirm = $mdDialog.confirm()
	    		.title('Voulez-vous vraiment vous déconnecter ?')
	    		.ariaLabel('Déconnexion')
	    		.targetEvent(ev)
	                  .ok('Oui') // Bouton Oui - veut se déconnecter
	                  .cancel('Non')
	                  .parent(angular.element(document.body.parentElement)); // Bouton Non - annulation
            	$mdDialog.show(confirm).then(function() { // Si l'utilisateur clic sur Oui 
	            	AuthenticationService.logout();
	            	NotifService.success("Statut Connexion", "Déconnexion réussi !");
            	}, function() {});
         }

         $scope.showConfirm = function(ev) {
	         	ev.preventDefault();
	         	console.log($route.current.$$route.originalPath);
	         	if ($route.current.$$route.originalPath == '/config-init') {
	         		UIkit.modal.confirm('Attention si vous quittez la configuration intiale, toutes les données enregistrées seront perdues, souhaitez-vous continuer ?', {center: true}).then(function() {
	         			showModal(ev);
	         		});
	         	} else {
	         		showModal(ev);
	         	}

         };
});