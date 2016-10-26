(function(){
/**
 * Déclaration de l'application routeApp
 */
var routeApp = angular.module('routeApp', ['ngRoute','myApp']);
/**
 * Configuration du module principal : routeApp
 */
routeApp.config(['$routeProvider',
    function($routeProvider) { 
        // Système de routage
        $routeProvider
        .when('/home', {
            templateUrl: 'app/components/home/home.html',
        })
        .when('/connexion', {
            templateUrl: 'app/components/connexion/connexion.html',
        })
        .otherwise({
            redirectTo: '/connexion'
        });
    }
]);

var appCCNT = angular.module('myApp', ['ngMaterial']);

appCCNT.directive('ngMenu', function() {
	return {
		restrict : 'E',
		templateUrl : 'app/shared/menu/menu-principale.html'
	};
});

})();