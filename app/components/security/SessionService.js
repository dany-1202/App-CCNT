/**
* Module qui fournit une factory nommé SessionService
* Elle permet de modifier, récupérer ou détruire une données dans la session
* 
**/
var ctrlCCNT = angular.module('ctrlCCNT');

/* Création de la factory SessionService qui reçoit en paramètre 
$http si besoin plus tard afin de faire des promesses avec l'API */
ctrlCCNT.factory('SessionService', ['$http', function($http) {
	return {
		set:function(key, value) { // Modifie la clé avec la valeur reçu
			return sessionStorage.setItem(key, value);
		},
		get:function(key) { // Récupère la donnée stocké dans la clé reçu
			return sessionStorage.getItem(key);
		},
		destroy:function(key) { // Supprime la donnée stocké dans la clé reçu
			return sessionStorage.removeItem(key);
		},
		destroyAll:function() {
			sessionStorage.removeItem('user_id');
			sessionStorage.removeItem('user_type');
			sessionStorage.removeItem('user_nom');
			sessionStorage.removeItem('user_prenom');
			sessionStorage.removeItem('user_token');
			sessionStorage.removeItem('user_configured');
		} 
	};
}]);