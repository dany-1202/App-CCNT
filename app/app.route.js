(function(){
/**
 * Déclaration de l'application ctrlCCNT
 */
var ctrlCCNT = angular.module('ctrlCCNT', ['ngRoute','ngMaterial']);
/**
 * Configuration du module principal : ctrlCCNT
 */
ctrlCCNT.config(['$routeProvider',
    function($routeProvider) { 
        // Système de routage
        $routeProvider
        .when('/home', {
            templateUrl: 'app/components/home/homeView.html',
        })
        .when('/connexion', {
            templateUrl: 'app/components/connexion/connexionView.html',
            controller: 'connexionController'
        })
        .otherwise({
            redirectTo: '/connexion'
        });
    }
]);

})();