(function(){ /* Afin de permettre de ne pas créer de conflit */
'use strict';
/**
 * Déclaration de l'application ctrlCCNT
 * Tous les modules de l'application seront fait avec la syntaxe suivante :
 * var xxx = angular.module('ctrlCCNT'); Ainsi je récupère les dépendances de ctrlCCNT.
**/
                                          /* On déclare ici toutes les dépendances */
var ctrlCCNT = angular.module('ctrlCCNT', ['ngRoute','ngMaterial', 'ui-notification', 'ngAnimate', 'ngAria', 'ngMessages', 'mdPickers']);

/**
 * Configuration du module principal : ctrlCCNT
 * La configuration des routes de l'applications est faites dans la procédures suivante.
 * Si le chemin n'est pas trouvé l'application redirige l'utilisateur vers la page connexion.
**/
ctrlCCNT.config(['$routeProvider',
    function($routeProvider) { // $routeProvider essentiel pour la configuration des routes
        $routeProvider

        /* Les changements ou ajouts de route se font ici */

        .when('/home', { // Chemin du home
            templateUrl: 'app/components/home/homeView.html',
            controller: 'homeController' // Contrôleur de la page home
        })
        .when('/connexion', { // Chemin de la connexion
            templateUrl: 'app/components/connexion/connexionView.html',
            controller: 'connexionController' // Contrôleur de la connexion
        })
        .when('/config-init', { // Chemin de la configuration initial */
            templateUrl: 'app/components/configuration-initial/config-init.html',
            controller: 'configController' // Contrôleur pour la configuration initial
        })
        .otherwise({
            redirectTo: '/connexion' // Redirection sur la page de connexion
        });
    }
]);

/**
* Configuration du $httpProvider
* Ce qui va permettre de rediriger l'utilisateur sur la page de connexion si l'application
* recontre l'erreur 401 (Qui veut dire que l'utilisateur n'est pas authentifié)
**/
ctrlCCNT.config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($location) { // Interception à chaque redirection
        return {
            'responseError': function (rejection) {
                if (rejection.status === 401) { // Si le status retourne 401

                    /* Redirection sur la page de connexion dès qu'il est connecté le retourne à la page qu'il souhaitait */
                    $location.url('/connexion?returnUrl=' + $location.path()); 
                }
            }
        };
    });
});

})();