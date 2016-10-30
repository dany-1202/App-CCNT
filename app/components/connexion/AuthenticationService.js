var ctrlCCNT = angular.module('ctrlCCNT')

ctrlCCNT.service('AuthenticationService', function ($http, $location, Notification, SessionService, $rootScope) {
	return {
		login : function (data, scope) {
			var $promise = $http.post("assets/php/launchAuthentication.php", data);
			$promise.then(function (message) {
				var authenData = message.data;
				console.log(message);
        if (typeof authenData === 'string' && authenData.indexOf("Impossible de se connecter") != -1) {
        	console.log("Problème de connexion avec la base de données");
        	Notification.warning({message: "La connexion avec la base de donnée a échoué, Veuillez contacter l'administrateur", title: 'Problème Connexion Base de données'});
        } else {
        	if (authenData.user_nom === undefined) {
        		Notification.error({message: 'Connexion échoué !', delay: 1500, title: 'Statut Connexion', replaceMessage: true});
	        } else {
	        	SessionService.set('user_id', authenData.user_id);
	        	SessionService.set('user_nom', authenData.user_nom);
	        	SessionService.set('user_prenom', authenData.user_prenom);
	        	SessionService.set('user_type', authenData.user_type);
	        	SessionService.set('user_token', authenData.user_token);
	        	Notification.success({message: 'Connexion réussi !', delay: 3000, title: 'Statut Connexion', replaceMessage: true});
	        	$location.path('/home');
	        	$rootScope.$broadcast("connectionStateChanged");
	        }
	      }
			});
		},
		logout : function () {
			var data = {'id' : SessionService.get('user_id')};
			var $promise = $http.post("assets/php/disconnectAuthentication.php", data);
			$promise.then(function (message) {
				SessionService.destroy('user_id');
				SessionService.destroy('user_type');
				SessionService.destroy('user_nom');
				SessionService.destroy('user_prenom');
				SessionService.destroy('user_token');
				$location.path('/login');
				$rootScope.$broadcast("connectionStateChanged");
			});
		},
		isConnected : function() {
			
		}
	}
});