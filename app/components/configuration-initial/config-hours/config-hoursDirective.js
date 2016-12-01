var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configHours', function($mdpTimePicker, NotifService, $mdDialog) {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-hours/config-hoursView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		link: function(scope, element, attrs) {
			scope.nbHours = 0;
			scope.status = '  ';
  		scope.customFullscreen = true;
			scope.showAdvanced = function(ev) {
		    $mdDialog.show({
		      controller: DialogController,
		      templateUrl: 'app/components/configuration-initial/config-hours/config-mdDialogView.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: scope.customFullscreen // Only for -xs, -sm breakpoints.
		    })
		    .then(function(answer) {
		      scope.status = 'You said the information was "' + answer + '".';
		    }, function() {
		      scope.status = 'You cancelled the dialog.';
		    });
		  };

		  function DialogController($scope, $mdDialog) {
		    $scope.hide = function() {
		      $mdDialog.hide();
		    };

		    $scope.cancel = function() {
		      $mdDialog.cancel();
		    };

		    $scope.answer = function(answer) {
		      $mdDialog.hide(answer);
		    };
		  }

      /* Affiche le timePicker pour ouverture */
			scope.showTimeJourneeDebut = function(ev, index) {
				var obj = scope.hours[index];
			 	$mdpTimePicker(scope.currentTime, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
			 		if (selectedDate == 'Annuler') {
						obj.journee.debut = "Ouverture";
						obj.journee.fin = "Fermeture";
					} else {
						scope.$parent.hours[index].journee.debut = selectedDate; // Changement de l'heure à jour
					}
			 		
			 	});
			}
			/* Affiche le timePicker pour fermeture */
			scope.showTimeJourneeFin = function(ev, index) {
				var obj = scope.hours[index];
				if (obj.journee.debut == "Ouverture") {NotifService.error("Heure du début", "Veuillez configurer l'heure de commencement"); return;} // Rediriger sur date début
			 	$mdpTimePicker(scope.currentTime, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
			 		if (selectedDate == 'Annuler') {
						scope.$parent.hours[index].journee.fin = "Fermeture";
					} else {
						var time = moment(obj.journee.debut);
						scope.$parent.hours[index].journee.fin = selectedDate;
						var timeFin = moment(obj.journee.fin);
						if (time.isAfter(timeFin)) {
							// Si l'heure de début est supérieur à l'heure de fin
							NotifService.error("Incohérence Heures", "L'heure de fermeture doit être après l'heure d'ouverture");
							scope.$parent.hours[index].journee.fin = "Fermeture";
							return;
						}
						var tmp = timeFin - time;

						tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
				    var diffsec = tmp % 60;                    // Extraction du nombre de secondes
				 		
				    tmp = Math.floor((tmp-diffsec)/60);    // Nombre de minutes (partie entière)
				    var diffmin = tmp % 60;
						
						tmp = Math.floor((tmp-diffmin)/60)
						scope.nbHours = tmp;
						scope.showAdvanced(ev);
			 		}
			 	});
			}
			/* Affiche le timePicker pour la pause début  */
			scope.showTimePauseDebut = function(ev, index) {
				var obj = scope.$parent.hours[index];
			 	$mdpTimePicker(scope.currentTime, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
			 		if (selectedDate == 'Annuler') {
						obj.pause.debut = "Début";
						obj.pause.fin = "Fin";
					} else {
						obj.pause.debut = selectedDate; // Changement de l'heure à jour
					}
			 	});
			}
			/* Affiche le timePicker pour la pause fin  */
			scope.showTimePauseFin = function(ev, index) {
				var obj = scope.hours[index];
				if (obj.pause.debut == "Début") {NotifService.error("Heure de Pause", "Veuillez configurer l'heure de commencement"); return;}
			 	$mdpTimePicker(scope.currentTime, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
			 		if (selectedDate == 'Annuler') {
						scope.$parent.hours[index].pause.fin = "Fin";
					} else {
						var time = moment(obj.pause.debut);
						scope.$parent.hours[index].pause.fin = selectedDate;
						var timeFin = moment(obj.pause.fin);
						if (time.isAfter(timeFin)) {
							// Si l'heure de début est supérieur à l'heure de fin
							NotifService.error("Incohérence Heures", "La pause doit se terminer après l'heure de début !");
							scope.$parent.hours[index].pause.fin = "Fermeture";
							return;
						}

			 		}
			 	});
			}
    },
	};
});