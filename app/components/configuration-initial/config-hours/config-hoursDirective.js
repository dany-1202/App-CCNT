var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configHours', function($mdpTimePicker) {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-hours/config-hoursView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		link: function(scope, element, attrs) {
      /* Affiche le timePicker pour ouverture */
			scope.showTimeJourneeDebut = function(ev, index) {
			 	$mdpTimePicker(scope.currentTime, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
			 		scope.$parent.hours[index].journee.debut = selectedDate;
			 	});
			}
			/* Affiche le timePicker pour fermeture */
			scope.showTimeJourneeFin = function(ev, index) {
			 	$mdpTimePicker(scope.currentTime, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
			 		scope.$parent.hours[index].journee.fin = selectedDate;
			 	});
			}
			/* Affiche le timePicker pour la pause début  */
			scope.showTimePauseDebut = function(ev, index) {
			 	$mdpTimePicker(scope.currentTime, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
			 		scope.$parent.hours[index].pause.debut = selectedDate;
			 	});
			}
			/* Affiche le timePicker pour la pause fin  */
			scope.showTimePauseFin = function(ev, index) {
			 	$mdpTimePicker(scope.currentTime, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
			 		scope.$parent.hours[index].pause.fin = selectedDate;
			 	});
			}
    },
	};
});