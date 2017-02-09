(function(){ /* Afin de permettre de ne pas créer de conflit */
/**
* Module qui fournit une factory afin de gérer les dates
* Il va permettre de calculer un total de nombre d'heures entre deux dates,
* il va aussi formater des dates en strings et vice-versa
**/
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.factory('DateFactory', function () {
	var date = {}; // Je crée un objet

	var matinDebut = new Date();
	var matinFin = new Date();
	var soirDebut = new Date();
	var soirFin = new Date();

	date.monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
	date.dayNames = ["L", "M", "M", "J", "V", "S", "D"];

	/* Construction de l'heure de début */
	matinDebut.setHours(7);
	matinDebut.setMinutes(0);
	date.matinDebut = matinDebut;
	
	/* Construction de l'heure de fin */
	matinFin.setHours(13);
	matinFin.setMinutes(00);
	date.matinFin = matinFin;

	/* Construction de l'heure de pause du début */
	soirDebut.setHours(15);
	soirDebut.setMinutes(00);
	date.soirDebut = soirDebut;

	/* Construction de l'heure de pause de fin */
	soirFin.setHours(23);
	soirFin.setMinutes(30);
	date.soirFin = soirFin;


	date.getToday = function () {
		return moment().startOf('day').toDate();
	}

	date.validateHour = function (hourDebut, hourFin) {
		var res = hourFin-hourDebut;
		return res >= 0;
	}

	date.calculateNbHours = function (timeDebut, timeFin) {
		var tmp = timeFin - timeDebut; // Je fait la différence entre les deux dates
		tmp = Math.floor(tmp/1000); // Nombre de secondes entre les 2 dates
	    var diffsec = tmp % 60; // Extraction du nombre de secondes
	    tmp = Math.floor((tmp-diffsec)/60); // Nombre de minutes (partie entière)
	    var diffmin = tmp % 60; // Extraction du nombre de minutes
		tmp = Math.floor((tmp-diffmin)/60) // Nombre d'heures (partie entière)
		return tmp; // Renvoie le nombre d'heures qui sépare les dates
	};

	date.getMinutesUntilFinalDay = function (hours, minutes) {
		var nbHours = (24 - hours); // Le nombre d'heures qu'il restent pour arriver à 24
		return (nbHours * 60) - minutes; // Le nombre de minutes nécessaire pour terminer la journée arrivé jusqu'à 24:00 == 00:00
	};

	return date;
})
})();