(function(){ 
var ctrlCCNT = angular.module('ctrlCCNT');
/**
* Directive qui va permettre de valider deux dates
* Il va comparer les dates et vérifier qu'elles ont bien 1 semaine d'écart entre le début et la fin
* Il va aussi regarder si dans le tableau passer en paramètre les données sont valides et qu'elles n'existent pas encore
* Attention cette directive est mutable c'est à dire qu'elle manipule des instances et à la fin de ces traitements les valeurs passées en paramètres vont changer
**/
ctrlCCNT.directive('validatorPeriod', function(DateFactory, NotifService) {
	return {
		restrict: 'A',
		controller: function($scope, NotifService) {
			
			$scope.findOtherPeriods = function (dateDebut, dateFin, cal, tab) {
	    		for (var i = 1; i < tab.length; i++) {
	    			var per = tab[i].period;
	    			if (tab[i].id !== cal.id)  {
		    			if ((dateDebut >= per.debut && dateDebut <= per.fin) || (dateFin >= per.debut && dateFin <= per.fin)) {
		    				NotifService.error('Période déjà couverte', "La période choisi : <span class='uk-label uk-label-default'>" + moment(cal.period.debut).format('D/MM/YYYY') + "</span> au <span class='uk-label uk-label-default'>" + moment(cal.period.fin).format('D/MM/YYYY') + "</span> est déjà couverte par une autre période!");
		    				return true;
		    			}
	    			}
	    		}
	    		return false;
	    	}
	    	$scope.isPeriodValid = function (cal, tab) {
	    		cal.errorPeriod = false;
	    		var dateDebut = cal.period.debut;
	    		var dateFin = cal.period.fin;
	    		if (dateDebut == "" || dateFin == "" || DateFactory.isPeriodValid(dateDebut, dateFin) || DateFactory.calculateNbDays(dateDebut, dateFin).day < 7) {
					cal.errorPeriod = true;
	    		} else {
	    			if (tab.length > 2) {
	    				cal.errorPeriod = $scope.findOtherPeriods(dateDebut, dateFin, cal, tab);
	    			}
	    		}
	    	}
		}
	};
}) // Fin de directive

})();

			