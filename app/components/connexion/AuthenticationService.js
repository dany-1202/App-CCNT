var ctrlCCNT = angular.module('ctrlCCNT')

ctrlCCNT.factory('AuthenticationService', function ($http, $location, Notification, SessionService) {
	return {
		login : function (data, scope) {
			console.log(data);
			var $promise = $http.post("assets/php/launchAuthentication.php", data);
			$promise.then(function (message) {
				console.log(message);
				var authenData = message.data;
				console.log(authenData);
        if (typeof authenData === 'string' && authenData.indexOf("Impossible de se connecter") != -1) {
        	console.log("Problème de connexion avec la base de données");
        	Notification.warning({message: "La connexion avec la base de donnée a échoué, Veuillez contacter l'administrateur", title: 'Problème Connexion Base de données'});
        } else {
        	if (authenData == "") {
        		Notification.error({message: 'Connexion échoué !', delay: 1500, title: 'Statut Connexion', replaceMessage: true});
	        } else {
	        	SessionService.set('user_id', authenData.user_id);
	        	SessionService.set('user_nom', authenData.user_nom);
	        	SessionService.set('user_prenom', authenData.user_prenom);
	        	SessionService.set('key_encrypted', authenData.key_encrypted);
	        	SessionService.set('user_type', authenData.user_type);
	        	Notification.success({message: 'Connexion réussi !', delay: 3000, title: 'Statut Connexion', replaceMessage: true});
	        	$location.path('/home');
	        }
	      }
			});
		},
		logout : function () {
			SessionService.destroy('user_id');
			SessionService.destroy('user_type');
			SessionService.destroy('user_nom');
			SessionService.destroy('user_prenom');
			SessionService.destroy('key_encrypted');
			$location.path('/login');
		},
		check : function(id, key) {
			var data = {'id' : id, 'mdpCrypted' : key};
			var $promise = $http.post("assets/php/checkAuthentication.php", data);
			$promise.then(function (message) {
				return message.data;
			}, function(error){
				return false;
			});
		}
	}
});