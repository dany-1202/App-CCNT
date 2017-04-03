(function(){
'use strict';
var app = angular.module('ctrlCCNT', ['ngRoute','ngMaterial', 'ngResource', 'materialCalendar', 'ui-notification', 'ngAnimate', 'ngAria', 'ngMessages', 'mdPickers', 'mwl.calendar', 'ui.bootstrap', 'ui.bootstrap.modal',  'colorpicker.module']);


app.config(['calendarConfig', function(calendarConfig) {
      calendarConfig.dateFormatter = 'angular'; // use moment to format dates
      calendarConfig.allDateFormats.moment.date.hour = 'HH:mm';
}]);

app.config(function($mdDateLocaleProvider) {
      $mdDateLocaleProvider.formatDate = function(date) {
		return date ? moment(date).format('DD/MM/YYYY') : null;
      };

      $mdDateLocaleProvider.parseDate = function(dateString) {
            	var m = moment(dateString, 'DD/MM/YYYY', true);
            	return m.isValid() ? m.toDate() : new Date(NaN);
      };
});

/**
* Configuration du $httpProvider
* Ce qui va permettre de rediriger l'utilisateur sur la page de connexion si l'application
* recontre l'erreur 401 (Qui veut dire que l'utilisateur n'est pas authentifié)
**/
app.config(function ($httpProvider) {
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

app.controller('appController', function ($scope) {
	var vm = this;
	// Contrôleur parent
});

})();