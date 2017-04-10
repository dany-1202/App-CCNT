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
	state.affDefinitif = true;
  	state.cal = null;
  	state.affHoraire = true;
  	
  	state.changeCal = function (cal, index) {
  		state.cal = angular.copy(cal);
  		state.affHoraire = (index == 0) ? false : true;
  	}
  	
  	state.changeAffDefinitif = function () {
  		state.affDefinitif = false;
  	}
  	
  	state.postaux = undefined // NoPostaux
  	state.tutoStart = false;

 	state.hours = [
       	{id: 1, day: 'Lundi', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END}, pause: {existe : false}, nbHours : 0},
    	{id: 2, day: 'Mardi', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END},  pause:{existe : false}, nbHours : 0},
    	{id: 3, day: 'Mercredi', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END},  pause: {existe : false}, nbHours : 0},
    	{id: 4, day: 'Jeudi', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END}, pause:{existe : false}, nbHours : 0},
    	{id: 5, day: 'Vendredi', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END}, pause: {existe : false}, nbHours : 0},
    	{id: 6, day: 'Samedi', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END}, pause: {existe : false},  nbHours : 0},
    	{id: 0, day: 'Dimanche', matin : {debut: Const.OPEN, fin: Const.END}, soir : {debut: Const.OPEN, fin: Const.END}, pause: {existe : false},  nbHours : 0},
 	]
 	
 	state.hoursWithPause = [
       	{id: 1, day: 'Lundi', matin : {debut: Const.HOUR_OPEN, fin: Const.HOUR_END}, soir : {debut: Const.HOUR_OPEN, fin: Const.HOUR_END}, pause: {existe : true}, nbHours : 0},
    	{id: 2, day: 'Mardi', matin : {debut: Const.HOUR_OPEN, fin: Const.HOUR_END}, soir : {debut: Const.HOUR_OPEN, fin: Const.HOUR_END},  pause:{existe : true}, nbHours : 0},
    	{id: 3, day: 'Mercredi', matin : {debut: Const.HOUR_OPEN, fin: Const.HOUR_END}, soir : {debut: Const.HOUR_OPEN, fin: Const.HOUR_END},  pause: {existe : true}, nbHours : 0},
    	{id: 4, day: 'Jeudi', matin : {debut: Const.HOUR_OPEN, fin: Const.HOUR_END}, soir : {debut: Const.HOUR_OPEN, fin: Const.HOUR_END}, pause:{existe : true}, nbHours : 0},
    	{id: 5, day: 'Vendredi', matin : {debut: Const.HOUR_OPEN, fin: Const.HOUR_END}, soir : {debut: Const.HOUR_OPEN, fin: Const.HOUR_END}, pause: {existe : true}, nbHours : 0},
    	{id: 6, day: 'Samedi', matin : {debut: Const.HOUR_OPEN, fin: Const.HOUR_END}, soir : {debut: Const.HOUR_OPEN, fin: Const.HOUR_END}, pause: {existe : true}, nbHours : 0},
    	{id: 0, day: 'Dimanche', matin : {debut: Const.HOUR_OPEN, fin: Const.HOUR_END}, soir : {debut: Const.HOUR_OPEN, fin: Const.HOUR_END}, pause: {existe : true}, nbHours : 0},
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
	
	state.getTabCalDefaultWithPause = function () {
		return angular.copy(state.hoursWithPause);
	}

	state.tabCalendars = [{id: 0, name: Const.HORAIREBASE, period: {debut: "", fin: ""}, hours: state.getTabCalDefault(), state: Const.INCOMP, errorName: false, errorPeriod:true, choix: null}];

	state.getTabCalPrec = function (pos) {
		var hours = angular.copy(state.tabCalendars[pos].hours);
		console.log(hours);
		var cal = state.getTabCalDefault();
		for (var i = 0; i < hours.length; i++) {
			cal[i].pause.existe = hours[i].pause.existe;
		}
		return cal;
	}

	state.changeChoix = function (idChoix) {
		state.choix = idChoix == 0 ? {id: idChoix, nom:Const.CONTINUE, color: Const.COLORCONTINUE} : {id: idChoix, nom:Const.COUPURE, color: Const.COLORCOUPURE};
		return state.choix;
	}

	state.changeFreq = function (idFreq) {
		state.choix.freq = idFreq == 0 ? {id: idFreq, nom:Const.TOUSLESJOURS} : {id: idFreq, nom:Const.CERTAINSJOURS};
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