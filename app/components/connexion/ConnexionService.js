var ctrlCCNT = angular.module('ctrlCCNT')

ctrlCCNT.factory('ConnexionService', function ($http) {
	return {
		login : function (data, scope) {
			var $promise = $http.post("assets/php/launchAuthentication.php", data);
			$promise.then(function (message) {
				var authData = message.data;
        if (message.data == "") {
        	console.log("connexion refusé");
        } else {
        	console.log("connexion accepté");
        }
			});
		},
	}
});