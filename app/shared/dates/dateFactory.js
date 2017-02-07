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

	/* Construction de l'heure de début */
	matinDebut.setHours(7);
	matinDebut.setMinutes(0);
	date.matinDebut = matinDebut;
	
	/* Construction de l'heure de fin */
	matinFin.setHours(23);
	matinFin.setMinutes(00);
	date.matinFin = matinFin;

	/* Construction de l'heure de pause du début */
	soirDebut.setHours(15);
	soirDebut.setMinutes(00);
	date.soirDebut = soirDebut;

	/* Construction de l'heure de pause de fin */
	soirFin.setHours(17);
	soirFin.setMinutes(00);
	date.soirFin = soirFin;


	date.calculateNbHours = function (timeDebut, timeFin) {
		var tmp = timeFin - timeDebut; // Je fait la différence entre les deux dates
		tmp = Math.floor(tmp/1000); // Nombre de secondes entre les 2 dates
	    var diffsec = tmp % 60; // Extraction du nombre de secondes
	    tmp = Math.floor((tmp-diffsec)/60); // Nombre de minutes (partie entière)
	    var diffmin = tmp % 60; // Extraction du nombre de minutes
		tmp = Math.floor((tmp-diffmin)/60) // Nombre d'heures (partie entière)
		return tmp; // Renvoie le nombre d'heures qui sépare les dates
	};

	return date;
})
})();