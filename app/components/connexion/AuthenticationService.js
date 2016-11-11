var ctrlCCNT = angular.module('ctrlCCNT') /* Toujours ça à la création d'un module ! (Contient toutes les références des scripts)*/

/* 
	Création du service AuthenticatorService
	Qui va permettre de gérer l'authentification de l'utilisateur et le déconnecter de la session.
*/
ctrlCCNT.service('AuthenticationService', function ($http, $location, Notification, SessionService, $rootScope) {
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
        if (typeof authenData === 'string' && authenData.indexOf("Impossible de se connecter") != -1) {
        	console.log("Problème de connexion avec la base de données");
        	/* Affiche un message d'erreur */
        	Notification.warning({message: "<p class='notifTexte'> La connexion avec la base de donnée a échoué, Veuillez contacter l'administrateur </p>", title: '<h3 class="notifTitre"><i class="fa fa-exclamation-triangle"></i> Connexion Base de données</h3>'});
        } else {
        	if (authenData.user_nom === undefined) { // Connexion refusé
        		Notification.error({message: "<p class='notifTexte'> Connexion échoué ! </p>", delay: 1500, title: '<h3 class="notifTitre"><i class="fa fa-exclamation-triangle"></i> Statut Connexion</h3>'});
	        } else {
	        	/* Stocke les données dans la session grâce à la méthode set du SessionService */
	        	SessionService.set('user_id', authenData.user_id);
	        	SessionService.set('user_nom', authenData.user_nom);
	        	SessionService.set('user_prenom', authenData.user_prenom);
	        	SessionService.set('user_type', authenData.user_type);
	        	SessionService.set('user_token', authenData.user_token);
	        	/* Connexion réussi*/
	        	Notification.success({message: "<p class='notifTexte'>Connexion réussi !</p>", delay: 3000, title: '<h3 class="notifTitre"><i class="fa fa-check"></i> Statut Connexion</h3>'});
	        	$location.path('/home');
	        	$rootScope.$broadcast("connectionStateChanged");
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
				SessionService.destroy('user_id');
				SessionService.destroy('user_type');
				SessionService.destroy('user_nom');
				SessionService.destroy('user_prenom');
				SessionService.destroy('user_token');
				$location.path('/login'); // Redirection sur la page de login
				$rootScope.$broadcast("connectionStateChanged"); // Applique dans l'évennement connectionStateChanged sa déconnexion
			});
		},
	}
});