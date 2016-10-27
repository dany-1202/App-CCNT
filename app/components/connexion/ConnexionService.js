var ctrlCCNT = angular.module('ctrlCCNT')

ctrlCCNT.factory('ConnexionService', function ($http, $location) {
	return {
		login : function (data, scope) {
			var $promise = $http.post("assets/php/launchAuthentication.php", data);
			$promise.then(function (message) {
				var authData = message.data;
				console.log(message);
        if (authData == "") {
        	console.log("connexion refusé");
        } else {
        	console.log("connexion accepté");
        	$location.path('/home');
        }
			});
		},
	}
});