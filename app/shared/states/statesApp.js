/**
* Module qui contient toutes les états de l'application. 
* Permet de garder une trace de tous les états de l'application, 
* l'exemple dans la configuration initiale, on doit garder les informations entres les différentes étapes.
**/
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.factory('State', function (Const){
	var state = {};

	state.choix = null; // Choix pour le type d'ouverture : 0 : En Continue ou 1 : Avec Coupure
	state.freq = null; // Choix sur la fréquence des coupures
	state.selectedD = []; // Choix des jours avec coupures

	state.hours = [
      {id: 1, day: 'Lundi', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END}, pause: {existe: false, debut: Const.PAUSED, fin:Const.PAUSEF}, nbHours : 0},
      {id: 2, day: 'Mardi', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END}, pause: {existe: false, debut: Const.PAUSED, fin:Const.PAUSEF}, nbHours : 0},
      {id: 3, day: 'Mercredi', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END}, pause: {existe: false, debut: Const.PAUSED, fin:Const.PAUSEF}, nbHours : 0},
      {id: 4, day: 'Jeudi', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END}, pause: {existe: false, debut: Const.PAUSED, fin:Const.PAUSEF}, nbHours : 0},
      {id: 5, day: 'Vendredi', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END}, pause: {existe: false, debut: Const.PAUSED, fin:Const.PAUSEF}, nbHours : 0},
      {id: 6, day: 'Samedi', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END}, pause: {existe: false, debut: Const.PAUSED, fin:Const.PAUSEF}, nbHours : 0},
      {id: 7, day: 'Dimanche', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END}, pause: {existe: false, debut: Const.PAUSED, fin:Const.PAUSEF}, nbHours : 0},
   	]

	state.getTabCalDefault = function () {
		return angular.copy(state.hours);
	}

	state.tabCalendars = [{name: "Semaine de base", period: {debut: "", fin: ""}, hours: state.getTabCalDefault(), state: "Incomplet"}];

	

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