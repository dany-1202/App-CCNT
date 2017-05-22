(function(){ /* Afin de permettre de ne pas créer de conflit */
/**
* Module qui fournit une factory afin de gérer les dates
* Il va permettre de calculer un total de nombre d'heures entre deux dates,
* il va aussi formater des dates en strings et vice-versa
**/
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.factory('DateFactory', function (Const) {
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
		return moment().startOf('day').toDate(); // Retourne une instance de la date d'aujourd'hui avec les heures et minutes à 0
	};

	date.getDateStr = function (date) {
		var tabDate = date.split('/');
		return new Date(tabDate[1] + "/" + tabDate[0] + "/" + tabDate[2]);
	}
	
	date.getStrDate = function (date) {
		return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
	}
	
	date.getDateBDD = function (date) {
		return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
	}
	
	date.getTimeDate = function (date) {
		return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	}

	date.formatDateIntoTime = function(date) {
		return moment(date).format('HH:mm:ss');
	}

	date.getTimeOfDateForBDD = function(time) {
		var tabDate = time.split(':');
		var date = moment().startOf('day').add(tabDate[0], 'hours').add(tabDate[1], 'minutes').toDate();
		return date.getHours() + ":" + date.getMinutes();
	}


	date.getDateByHours = function(hourBDD) {
		var tabDate = hourBDD.split(':');
		var date = moment().startOf('day').add(tabDate[0], 'hours').add(tabDate[1], 'minutes').toDate();
		return date;
	}
	
	date.getJourById = function(id) {
		var day = 'Dimanche';
		switch(id) {
			case '1':
			day = 'Lundi';
			break;
			case '2':
			day = 'Mardi';
			break;
			case '3':
			day = 'Mercredi';
			break;
			case '4':
			day = 'Jeudi';
			break;
			case '5':
			day = 'Vendredi';
			break;
			case '6':
			day = 'Samedi';
			break;
		}
		return day;
	};


	date.getIdByDay = function(idJour) {
		var day = 6;
		switch(idJour) {
			case 1:
			day = 0;
			break;
			case 2:
			day = 1;
			break;
			case 3:
			day = 2;
			break;
			case 4:
			day = 3;
			break;
			case 5:
			day = 4;
			break;
			case 6:
			day = 5;
			break;
		}
		return day;
	}
		
		
	date.getTimeStr = function (date) {
		var d = moment(date);
		return d.format('HH:mm');
	}

	date.validateHour = function (hourDebut, hourFin) {
		var res = hourFin-hourDebut;
		return res >= 0;
	};

	date.calculateNbHours = function (timeDebut, timeFin) {
		var tmp = timeFin - timeDebut; // Je fait la différence entre les deux dates
		tmp = Math.floor(tmp/1000); // Nombre de secondes entre les 2 dates
	    	var diffsec = tmp % 60; // Extraction du nombre de secondes
	    	tmp = Math.floor((tmp-diffsec)/60); // Nombre de minutes (partie entière)
	    	var diffmin = tmp % 60; // Extraction du nombre de minutes
		tmp = Math.floor((tmp-diffmin)/60) // Nombre d'heures (partie entière)
		return tmp; // Renvoie le nombre d'heures qui sépare les dates
	};

	date.calculateNbDays = function (dateDebut, dateFin) {
		var diff = {}                           // Initialisation du retour
		var tmp = dateFin - dateDebut;
		 
	         tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
	         diff.sec = tmp % 60;                    // Extraction du nombre de secondes
	 
	          tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
		diff.min = tmp % 60;                    // Extraction du nombre de minutes
	 
		tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
	                   diff.hour = tmp % 24;                   // Extraction du nombre d'heures
	    
	                  tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
	         diff.day = tmp;
	        
		return diff;
	};

	/* Comment */
	date.isHourEndValid = function (objHour, index, tab) {
		return true;
	}

	date.isPeriodValid = function (dateDebut, dateFin) {
		if (moment(dateDebut).isBefore(moment(dateFin))) {
			return false
		}
		return true;
	};


	date.newDate = function (date, dateHours) {
		return moment(date).startOf('day').add(dateHours.getHours(), 'hours').add(dateHours.getMinutes(), 'minutes').toDate();
	}

	date.getDayPrec = function (index, tab) {
		return tab[index == 0 ? 6 : index-1];
	}

	date.getDaySuiv = function (index, tab) {
		return tab[index == 6 ? 0 : index+1];
	}

	date.isHourStartValid = function (date, index, tab) {
		var objPrec = tab[index == 0 ? 6 : index-1]; // Je récupère la date du jour d'avant
		
		if (objPrec.soir.fin == Const.END) {
			return true;
		} 
		if (moment(date).isBefore(moment(objPrec.soir.fin))) {
			return false;
		}
		return true;
	}

	date.getAge = function (birthday) {
		birthday = new Date(birthday);
		return new Number((new Date().getTime() - birthday.getTime()) / 31536000000).toFixed(0);
	}
	
	date.toDateTimeBDD = function(date) {
		return angular.copy(moment(date).format('YYYY-MM-DD HH:mm:ss'));
	}

	date.getMinutesUntilFinalDay = function (hours, minutes) {
		var nbHours = (24 - hours); // Le nombre d'heures qu'il restent pour arriver à 24
		return (nbHours * 60) - minutes; // Le nombre de minutes nécessaire pour terminer la journée arrivé jusqu'à 24:00 == 00:00
	};
	
	date.getHoraireDay = function(prehours, day) {
		var index = -1;
		for (var i = 0; i < prehours.length; i++) {
			if (prehours[i].id == day) {
				index = i;
			}
		}
		return index;
	}
		
	return date;
})
})();