/**
* Module qui permet de gérer la connexion
* Le controleur s'occupera d'authentifier l'utilisateur lorsque la fonction connexion sera appelé
* 
**/
var ctrlCCNT = angular.module('ctrlCCNT');

/* Création du contrôleur connexionController */
ctrlCCNT.controller('connexionController', function($scope, $rootScope, AuthenticationService, $http, NotifService) {
	
	/* Valeur du user sont mise à null par défaut - évite les erreurs */
	$scope.user = {
		login: null,
		password: null,
	};

	/* Lance la connexion */
	$scope.connexion = function() {
		if ($scope.user.login == null || $scope.user.password == null) { // Si un des champ est null 
			var message = "Tous les champs ne sont pas renseignés";
			var titre = "Statut Connexion";
			NotifService.error(titre, message);
			return;
		}
		AuthenticationService.login($scope.user, $scope); // Appelle AuthentificationService pour se connecter avec la fonction login()
	};
	/* Verifie le champ de l'email */
	$scope.verificationChamps = function() {
		var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		if ($scope.user.login == null) {return true;}
		return pattern.test($scope.user.login);
	};
});

/**
* Configuration du thème de la page avec Google Material Design
* Ici la couleur primaire est modifié est mis en brun afin d'avoir les boutons en brun et les champs
* 
**/
ctrlCCNT.config(function($mdThemingProvider) {
	// Configure a dark theme with primary foreground blue
	$mdThemingProvider.theme('docs-dark', 'default')
		.primaryPalette('brown')
});