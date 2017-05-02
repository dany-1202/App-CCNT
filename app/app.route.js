(function(){ /* Afin de permettre de ne pas créer de conflit */
'use strict';
/**
 * Déclaration de l'application ctrlCCNT
 * Tous les modules de l'application seront fait avec la syntaxe suivante :
 * var xxx = angular.module('ctrlCCNT'); Ainsi je récupère les dépendances de ctrlCCNT.
**/
                                          /* On déclare ici toutes les dépendances */
var ctrlCCNT = angular.module('ctrlCCNT');

/**
 * Configuration du module principal : ctrlCCNT
 * La configuration des routes de l'applications est faites dans la procédures suivante.
 * Si le chemin n'est pas trouvé l'application redirige l'utilisateur vers la page connexion.
**/
ctrlCCNT.config(['$routeProvider','$locationProvider',
  	function($routeProvider, $locationProvider) {
        // $routeProvider essentiel pour la configuration des routes
    	$routeProvider

    		/* Les changements ou ajouts de route se font ici */
	    	.when('/home', { // Chemin du home
	            templateUrl: 'app/components/home/homeView.html',
	            controller: 'homeController',
	            activetab: 'dashboard' // Contrôleur de la page home
	       	})
	    	.when('/connexion', { // Chemin de la connexion
	            templateUrl: 'app/components/connexion/connexionView.html',
	            controller: 'connexionController' // Contrôleur de la connexion
	    	})
		.when('/config-init', { // Chemin de la configuration initial */
			templateUrl: 'app/components/configuration-initial/config-init.html',
			controller: 'configController', // Contrôleur pour la configuration initial
			activetab: 'dashboard'
		})
		.when('/construction', { // Chemin d'une page en construction
			templateUrl: 'app/constructionView.html',
			//controller: 'homeController' // Contrôleur de la page home
		})
		.when('/employe', { // Chemin d'une page en construction
			templateUrl: 'app/components/configuration-employe/employeView.html',
			controller: 'employeController',
			activetab: 'emp' // Contrôleur de la page home
		})
		.when('/employe/edition', { // Chemin d'une page en construction
			templateUrl: 'app/components/configuration-employe/employeFormView.html',
			controller: 'employeFormController',
			activetab: 'emp' // Contrôleur de la page home
		})
		.when('/employe/password/:t', { // Chemin vers la page d'initialisation du password
			templateUrl: 'app/components/configuration-employe/employePassword.html',
			controller: 'employePassword',
			activetab: 'emp' // Contrôleur de la page home
		})
		.when('/createplanning', {
			templateUrl: 'app/components/planning/createplanningView.html',
			controller: 'planningController',
			activetab: 'planning'
		})
		.when('/parametrage', {
			templateUrl: 'app/components/parametrage/parametrageView.html',
			controller: 'parametrageController',
			activetab: 'param'
		})
		.when('/stats', {
			templateUrl: 'app/components/statistiques/statsView.html',
			controller: 'statsController',
			activetab: 'stats'
		})
		.when('/demandes', {
			templateUrl: 'app/components/demandes/demandesView.html',
			controller: 'demandesController',
			activetab: 'demandes'
		})
		.when('/myestablishment', {
			templateUrl: 'app/components/establishment/myestablishment.html',
			controller: 'establishmentController',
			activetab: 'estab'
		})
		.otherwise({
			redirectTo: '/connexion' // Redirection sur la page de connexion
		})
		//$locationProvider.html5Mode(true);
 	}
]);


})();