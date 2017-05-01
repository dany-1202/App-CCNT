/**
* Module qui permet de gérer le fonctionnement de l'application
* En effet, la fonction $on du $rootScope va permettre de vérifier si l'utilisateur est connecté
* dès que l'application change de route il va appeler cette méthode
*
**/
var ctrlCCNT = angular.module('ctrlCCNT'); // Importe les dépendances du parent ctrlCCNT

/**
* Fonction Run
* Ecoute de tous les changements qui se font dans l'application
*
**/

ctrlCCNT.run(function($rootScope, $location, AuthenticationService, SessionService, $http, NotifService, $timeout, Popover){
	/* Ici nous mettrons toutes les routes que l'utilisateur pourra accéder sans qu'il soit connecté */
	var routeSansLogin = ['/connexion','/employe/password'];

	/* Ici nous mettrons toutes les routes que l'utilisateur pourra accéder en devant être connecté */
	var routeAvecLogin = ['/home', '/config-init', '/construction','/employe','/employe/edition', '/parametrage'];

	var onRouteChangeOff = $rootScope.$on('$locationChangeStart', routeChange);
	var essai = 1;
	
	function routeChange (event, newUrl, oldUrl) {
		var chemin = $location.path().split('/')[1];
		if (oldUrl.indexOf(chemin) == -1) {
			if (oldUrl.indexOf(newUrl) != -1) {
				return;
			} else {
				if (newUrl.indexOf('state=1') == -1 && newUrl.indexOf(routeAvecLogin[1].split('/')[1]) == -1 && oldUrl.indexOf(routeAvecLogin[1].split('/')[1]) != -1 && essai == 1) {
					if (newUrl.indexOf(routeSansLogin[0].split('/')[1]) == -1) {
						UIkit.modal.confirm('Attention si vous quittez la configuration intiale, toutes les données enregistrées seront perdues, souhaitez-vous continuer ?', {center: true}).then(function() {
					    	//onRouteChangeOff(); //Stop listening for location changes
					    	essai = 2;
					    	var obj = $location.url(newUrl).$$hash.split('!')[1];
	        				$location.path(obj);//Go to page they're interested in
	        				$rootScope.$apply();
	        				essai = 1;
						}, function () {});
						event.preventDefault();
	  					return;
  					}
				}
			}
		}
	}



	/* Fonction déclenché quand un changement de route se fait dans le run de l'application */
	$rootScope.$on('$routeChangeStart', function(event, next, current) {
		//next.$$route.originalPath);
		$timeout(Popover.hide, 0);
		if (SessionService.get('user_token') == null) { // Si le service ne trouve aucune donnée pour le token
			// Test si l'utilisateur doit se diriger vers la connexion ou vers le mot de passe
			if((next.$$route.originalPath.indexOf(routeSansLogin[0]) != -1) || (next.$$route.originalPath.indexOf(routeSansLogin[1]) != -1)){
				return ;
			}else{
				$location.path('/connexion');
			}
		} else {
			/* Stocke les données nécessaires : 'token' et 'id' */
			var data = {'user_id' : SessionService.get('user_id'), 'user_token' : SessionService.get('user_token')};
			/* Envoi la promesse vers l'API afin de recevoir la réponse si l'utilisateur est authentifié ou pas */
			var $promise = $http.post("assets/php/checkAuthentication.php", data);
			$promise.then(function (message) {
				/* Si l'utilisateur essaye d'accéder sur une route qui n'est pas besoin de */
				if (routeAvecLogin.indexOf($location.path()) != -1 && !message.data) {
					$location.path('/connexion');
				}
				if (routeSansLogin.indexOf($location.path()) != -1 && message.data) {
					$location.path('/home');
				}
			});
		}
	});
});