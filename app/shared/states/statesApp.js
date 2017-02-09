/**
* Module qui contient toutes les états de l'application. 
* Permet de garder une trace de tous les états de l'application, 
* l'exemple dans la configuration initiale, on doit garder les informations entres les différentes étapes.
**/
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.factory('State', function (){
	var state = {};

	state.choix = null; // Choix pour le type d'ouverture : 0 : En Continue ou 1 : Avec Coupure
	state.freq = null; // Choix sur la fréquence des coupures
	state.selectedD = []; // Choix des jours avec coupures

	state.changeChoix = function (idChoix) {
		state.choix = idChoix == 0 ? {id: idChoix, nom:"En Continue", color: "#27ae60"} : {id: idChoix, nom:"Avec Coupures", color: "#428bca"};
		return state.choix;
	}

	state.changeFreq = function (idFreq) {
		state.choix.freq = idFreq == 0 ? {id: idFreq, nom:"Tous les jours"} : {id: idFreq, nom:"Certains jours"};
		return state.choix.freq;
	}
	
	return state;
});