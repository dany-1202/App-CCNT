var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.run(function($rootScope, $location, AuthenticationService, SessionService){
	var routeSansLogin = ['/connexion'];
	var routeAvecLogin = ['/home'];

	$rootScope.$on('$routeChangeStart', function() {
		var typePersonne = SessionService.get('user_type');
		var key = SessionService.get('key_encrypted');
		var id = SessionService.get('user_id');
		if (typePersonne == null || id == null || key == null) {
			$location.path('/connexion');
		} else {
			var authentifie = AuthenticationService.check(id, key);
			if (routeSansLogin.indexOf($location.path()) != -1 && authentifie) {
				$location.path('/home');
			} else {
				$location.path('/connexion');
			}
		};
	});
});