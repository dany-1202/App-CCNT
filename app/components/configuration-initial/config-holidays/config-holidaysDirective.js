var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configHolidays', function($mdpDatePicker) {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-holidays/config-holidaysView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		link: function(scope, element, attrs) {
			/* à rajouter ici (Fonctionne comme un contrôleur */
			var date = moment().locale('fr').format('LL');
			scope.currentDate = date;
			scope.selectedDate = scope.$parent.selectedDate;
			scope.showDatePicker = function(ev) {

	    	$mdpDatePicker(scope.currentDate, {
	        targetEvent: ev
	      }).then(function(selectedDate) {
	      	moment.lang('fr');
	        scope.currentDate = moment(selectedDate).format('LL');
	      });
	    };
    },
  }
});