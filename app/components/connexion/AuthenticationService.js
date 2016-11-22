/**
* Module qui gère l'Authentification en fournissant un service qui pourra
* être utilisé par les autres modules de l'application
* 
**/
var ctrlCCNT = angular.module('ctrlCCNT') /* Toujours ça à la création d'un module ! (Contient toutes les références des scripts)*/

/* 
	Création du service AuthenticatorService
	Qui va permettre de gérer l'authentification de l'utilisateur et le déconnecter de la session.
*/
ctrlCCNT.service('AuthenticationService', function ($http, $location, NotifService, SessionService, $rootScope) {
	return {
		/* La fonction login, qui reçoit les données (data) et le scope
			La fonction va permettre de lancer une promesse sur l'api php pour obtenir le droit à la connexion 
			si le username et le mot de passe sont justes : 
			- Si c'est pas juste afficher un message Connexion échoué
			- Si c'est juste stocke les données nécessaires (Nom, prénom, pour l'application dans la session du navigateur
		*/
		login : function (data, scope) {
			var $promise = $http.post("assets/php/launchAuthentication.php", data); // Lance la promesse à l'API
			$promise.then(function (message) {
				var authenData = message.data;
        if (typeof authenData === 'string' && authenData.indexOf("Impossible de se connecter") != -1) { // Problème avec la BDD
        	console.log("Problème de connexion avec la base de données");
        	/* Affiche un message d'erreur */
        	NotifService.warningCon();
        } else {
        	if (authenData.user_nom === undefined) { // Connexion refusé
        		NotifService.errorCon();
	        } else {
	        	/* Stocke les données dans la session grâce à la méthode set du SessionService */
	        	SessionService.set('user_id', authenData.user_id);
	        	SessionService.set('user_nom', authenData.user_nom);
	        	SessionService.set('user_prenom', authenData.user_prenom);
	        	SessionService.set('user_type', authenData.user_type);
	        	SessionService.set('user_token', authenData.user_token);
	        	/* Connexion réussi*/
	        	NotifService.successCon();
	        	$location.path('/home');
	        	$rootScope.$broadcast("connectionStateChanged"); // Evennement appelé état de la connexion a changé
	        }
	      }
			});
		},
		/* La fonction logout, qui ne reçoit aucun paramètre
			La fonction va permettre de lancer une promesse sur l'api php pour déconnecter l'utilisateur.
			- Il va retirer les données stockées dans la session grâce au Service SessionService et à la méthode destroy
		*/
		logout : function () {
			var data = {'id' : SessionService.get('user_id')}; // Créer la variable data sous forme d'objet, qui va contenir l'id de l'utilisateur
			var $promise = $http.post("assets/php/disconnectAuthentication.php", data); // Lange la promesse
			$promise.then(function (message) {
				SessionService.destroyAll(); //Destruction de toutes les données stockées dans la session
				$location.path('/login'); // Redirection sur la page de login
				$rootScope.$broadcast("connectionStateChanged"); // Applique dans l'évennement connectionStateChanged sa déconnexion
			});
		},
	}
});