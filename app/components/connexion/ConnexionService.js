var ctrlCCNT = angular.module('ctrlCCNT')

ctrlCCNT.factory('ConnexionService', function ($http, $location, Notification) {
	return {
		login : function (data, scope) {
			var $promise = $http.post("assets/php/launchAuthentication.php", data);
			$promise.then(function (message) {
        if (message.data == "") {
        	Notification.error({message: 'Connexion échoué !', delay: 3000, title: 'Statut Connexion'});
        } else {
        	Notification.success({message: 'Connexion réussi !', delay: 3000, title: 'Statut Connexion'});
        	$location.path('/home');
        }
			});
		},
	}
});