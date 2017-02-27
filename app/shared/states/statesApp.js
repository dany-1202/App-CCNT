/**
* Module qui contient toutes les états de l'application.
* Permet de garder une trace de tous les états de l'application,
* l'exemple dans la configuration initiale, on doit garder les informations entres les différentes étapes.
**/
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.factory('State', function (Const, Postaux, $q){
	var state = {};
	state.choix = null; // Choix pour le type d'ouverture : 0 : En Continue ou 1 : Avec Coupure
	state.freq = null; // Choix sur la fréquence des coupures
	state.selectedD = []; // Choix des jours avec coupures
  	
      	state.postaux = undefined // NoPostaux
      	state.tutoStart = false;
      	/*****************************************************************************************\
	          * Récupération des localités avec les numéros postaux *
 	\*****************************************************************************************/
      	state.getAllInfos = function () {
      		//getJsonData(); // Récupérer les numéros postaux depuis le fichiers JSON
      	}
      	/*///////////////////////////////////////////////////////////////////////////////////////*/

     	state.hours = [
	           	{id: 1, day: 'Lundi', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END}, pause: {existe : false}, nbHours : 0},
	            	{id: 2, day: 'Mardi', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END},  pause:{existe : false}, nbHours : 0},
	            	{id: 3, day: 'Mercredi', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END},  pause: {existe : false}, nbHours : 0},
	            	{id: 4, day: 'Jeudi', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END}, pause:{existe : false}, nbHours : 0},
	            	{id: 5, day: 'Vendredi', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END}, pause: {existe : false}, nbHours : 0},
	            	{id: 6, day: 'Samedi', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END}, pause: {existe : false},  nbHours : 0},
	            	{id: 7, day: 'Dimanche', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END}, pause: {existe : false},  nbHours : 0},
     	]

      	state.configTuto = [
		{id: 1, title: Const.TITLEESTA, src: Const.PATH1},
		{id: 2, title: Const.TITLEDEPS, src: Const.PATH2},
		{id: 3, title: Const.TITLEHOURS, src: Const.PATH3},
		{id: 4, title: Const.TITLEHOURS, src: Const.PATH4},
		{id: 5, title: Const.TITLEHOURS, src: Const.PATH5},
		{id: 6, title: Const.TITLEHOURS, src: Const.PATH6},
		{id: 7, title: Const.TITLEHOURS, src: Const.PATH7},
		{id: 8, title: Const.TITLEHOURS, src: Const.PATH8},
		{id: 9, title: Const.TITLEHOLI, src: Const.PATH9},
		{id: 10, title: Const.TITLEHOLI, src: Const.PATH10},
     	]

	state.getConfigTuto = function () {
		return angular.copy(state.configTuto);
	}
	
	state.finishTuto = false;

	state.changeFinishTuto = function () {
		state.finishTuto = true;
	}

	state.getTabCalDefault = function () {
		return angular.copy(state.hours);
	}

	state.tabCalendars = [{name: "Semaine de base", period: {debut: "", fin: ""}, hours: state.getTabCalDefault(), state: "Incomplet", errorName: false, errorPeriod:true}];

	state.changeChoix = function (idChoix) {
		state.choix = idChoix == 0 ? {id: idChoix, nom:"En Continue", color: "#27ae60"} : {id: idChoix, nom:"Avec Coupures", color: "#428bca"};
		return state.choix;
	}

	state.changeFreq = function (idFreq) {
		state.choix.freq = idFreq == 0 ? {id: idFreq, nom:"Tous les jours"} : {id: idFreq, nom:"Certains jours"};
		return state.choix.freq;
	}
	
	/*****************************************************************************************\
	* Fonction qui permet de mettre la première lettre d'un mot en majuscule *                        
	\*****************************************************************************************/
	state.capitalize =  function(input) {
		if (input!=null) {
			input = input.toLowerCase();
		}
		return input.substring(0,1).toUpperCase()+input.substring(1);
	}
	
	/*****************************************************************************************\
	* Fonction pour récupérer les champs de l'autocomplete - code postale et localité *                        
	\*****************************************************************************************/
	state.getVille =  function(item) {
		return item.substring(5);
	}
	
	state.getCode =  function(item) {
		return item.substring(0, 4);
	}
 
       	return state; // Retourne l'état de l'application
});