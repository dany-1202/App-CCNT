var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.run(function($rootScope, $location, AuthenticationService, SessionService){
	var routeSansLogin = ['/connexion'];
	var routeAvecLogin = ['/home'];

	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		var valeur = AuthenticationService.isConnected();
		if (valeur != null) {
			$location.path('/home');
		}
	});
});