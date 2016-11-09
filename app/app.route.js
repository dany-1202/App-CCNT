(function(){
'use strict';
/**
 * Déclaration de l'application ctrlCCNT
 */
var ctrlCCNT = angular.module('ctrlCCNT', ['ngRoute','ngMaterial', 'ui-notification']);
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

ctrlCCNT.config(function ($httpProvider) {
    $httpProvider.interceptors.push(function ($location) {
        return {
            'responseError': function (rejection) {
                if (rejection.status === 401) {
                    $location.url('/connexion?returnUrl=' + $location.path());
                }
            }
        };
    });
});

ctrlCCNT.config(function(NotificationProvider) {
    NotificationProvider.setOptions({
        delay: 10000,
        startTop: 300,
        startRight: 200,
        verticalSpacing: 50,
        horizontalSpacing: 40,
        maxCount: 1,
        positionX: 'center',
        positionY: 'top'
    });
});


})();