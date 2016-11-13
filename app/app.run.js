var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.run(function($rootScope, $location, AuthenticationService, SessionService, $http, Notification){
	var routeSansLogin = ['/connexion'];
	var routeAvecLogin = ['/home', '/config-init'];

	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		if (SessionService.get('user_token') == null) {
			$location.url('/connexion');
		} else {
			var data = {'id' : SessionService.get('user_id'), 'token' : SessionService.get('user_token')};
			var $promise = $http.post("assets/php/checkAuthentication.php", data);
			$promise.then(function (message) {
				if (routeAvecLogin.indexOf($location.path()) != -1 && !message.data) {
					$location.path('/connexion');
				};
				if (routeSansLogin.indexOf($location.path()) != -1 && message.data) {
					$location.path('/home');
					Notification.info('Vous êtes connecté !' + ' M. ' + SessionService.get('user_nom'));
				}
			});
		}
	});
});