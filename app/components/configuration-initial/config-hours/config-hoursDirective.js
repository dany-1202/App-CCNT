var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configHours', function($mdpTimePicker, NotifService, $mdDialog) {
	

	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-hours/config-hoursView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		
		link: function($scope, $element, $attrs) {
			$scope.nbHours = 0;
			$scope.status = '  ';
  		$scope.customFullscreen = true;



  		if ($scope.$parent.nbHoursChosen == null || $scope.$parent.nbHoursChosen == "") {
  			/* Afficher message du nombre d'heure */ 
  			$("#nbHours").notify(
				  "Insérer le nombre totales d'heures pour la semaine", 
				  { className: 'info', position:"bottom center"}
				).focus();
  		};	

			$scope.showAdvanced = function(ev) {
		    $mdDialog.show({
		      controller: DialogController,
		      templateUrl: 'app/components/configuration-initial/config-hours/config-mdDialogView.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
		    })
		    .then(function(answer) {
		      $scope.status = 'You said the information was "' + answer + '".';
		    }, function() {
		      $scope.status = 'You cancelled the dialog.';
		    });
		  };

		  $scope.addPause = function (index) {
		  	//$scope.hours[index].pause.existe = true;
		  };

		  function DialogController($scope, $mdDialog) {
		  	$scope.days = [
		  									{day: 'Tous les jours', chosen : false},
		  									{day: 'Lundi', chosen : false},
		                    {day: 'Mardi', chosen : false},
		                    {day: 'Mercredi', chosen : false},
		                    {day: 'Jeudi', chosen : false},
		                    {day: 'Vendredi', chosen : false},
		                    {day: 'Samedi', chosen : false},
		                    {day: 'Dimanche',chosen : false},
		  								];

		    $scope.hide = function() {
		      $mdDialog.hide();
		    };

		    $scope.cancel = function() {
		      $mdDialog.cancel();
		    };

		    $scope.addHoursWeek = function() {
		    	$scope

		    }
		  };

		  $scope.verifyNbHours = function () {
		  	if ($scope.$parent.nbHoursChosen == null || $scope.$parent.nbHoursChosen == 0) {
					$("#nbHours").notify(
					  "Veuillez insérer un nombre d'heures valide ! ", 
					  { className: 'error', position:"bottom center"}
					).focus();
					return true;
				}
				return false;
		  }

      /* Affiche le timePicker pour ouverture */
			$scope.showTimeJourneeDebut = function(ev, index) {
				$scope.showAdvanced(ev);
				var obj = $scope.hours[index];

				if ($scope.verifyNbHours()) {return;}; // Si le nombre d'heures n'est pas configuré je quitte

			 	$mdpTimePicker($scope.currentTime, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
			 		if (selectedDate == 'Annuler') {
						obj.journee.debut = "Ouverture";
						obj.journee.fin = "Fermeture";
					} else {
						$scope.$parent.hours[index].journee.debut = selectedDate; // Changement de l'heure à jour
					}
			 		
			 	});
			};

			/* Affiche le timePicker pour fermeture */
			$scope.showTimeJourneeFin = function(ev, index) {
				var obj = $scope.hours[index];
				if ($scope.verifyNbHours()) {return;}; 
				if (obj.journee.debut == "Ouverture") {
					$("#" + obj.id + "debut").notify(
					  "Configurer l'heure d'ouverture ! ", 
					  { className: 'error', position:"bottom center"}
					).focus();
					return;
				}// Rediriger sur date début

			 	$mdpTimePicker($scope.currentTime, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
				 		if (selectedDate == 'Annuler') {
							$scope.$parent.hours[index].journee.fin = "Fermeture";
						} else {
							var time = moment(obj.journee.debut);
							$scope.$parent.hours[index].journee.fin = selectedDate;
							var timeFin = moment(obj.journee.fin);
							if (time.isAfter(timeFin)) {
								// Si l'heure de début est supérieur à l'heure de fin
								$("#" + obj.id + "debut").notify(
								  "L'heure de début doit être inférieur à l'heure de fin ! ", 
								  { className: 'error', position:"bottom center"}
								).focus();
								$("#" + obj.id + "fin").notify(
								  "L'heure de début doit être inférieur à l'heure de fin ! ", 
								  { className: 'error', position:"bottom center"}
								).focus();

								$scope.$parent.hours[index].journee.fin = "Fermeture";
								return;
							}
							$scope.nbHours = $scope.calculateTotalNbHours();
							//$scope.showAdvanced(ev); // Lancement écran qui permet à l'utilisateur de choisir les jours de la semaine qui doivent reprendre les même configurations
				 		}
			 	});
			};

			$scope.calculateNbHours = function (time, timeFin) {
				var tmp = timeFin - time;
				tmp = Math.floor(tmp/1000); // Nombre de secondes entre les 2 dates
		    var diffsec = tmp % 60; // Extraction du nombre de secondes
		    tmp = Math.floor((tmp-diffsec)/60); // Nombre de minutes (partie entière)
		    var diffmin = tmp % 60;
				tmp = Math.floor((tmp-diffmin)/60)
				return tmp;
			};


			$scope.calculateTotalNbHours = function () {
				var nbHours = 0;
				for (var i = 0; i < $scope.$parent.hours.length; i++) {
					var obj = $scope.$parent.hours[i];
					if (obj.journee.debut != "Ouverture" && obj.journee.fin != "Fermeture") {
						if (obj.pause.existe == false) {
							nbHours += $scope.calculateNbHours(obj.journee.debut, obj.journee.fin);
						} else {
							var tmp = $scope.calculateNbHours(obj.journee.debut, obj.journee.fin);
							var tmpPause = $scope.calculateNbHours(obj.pause.debut, obj.pause.fin);
							nbHours += (tmp - tmpPause);
						}
					}
				};
				return nbHours;
			}

			/* Affiche le timePicker pour la pause début  */
			$scope.showTimePauseDebut = function(ev, index) {
				var obj = $scope.$parent.hours[index];
				if ($scope.verifyNbHours()) {return;};

			 	$mdpTimePicker($scope.currentTime, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
			 		if (selectedDate == 'Annuler') {
						obj.pause.debut = "Début";
						obj.pause.fin = "Fin";
					} else {
						obj.pause.debut = selectedDate; // Changement de l'heure à jour
					}
			 	});
			};

			$scope.validatePause = function () {

			}

			/* Affiche le timePicker pour la pause fin  */
			$scope.showTimePauseFin = function(ev, index) {

				var obj = $scope.hours[index];

				if ($scope.verifyNbHours()) {return;};

				if (obj.pause.debut == "Début") {
					$("#" + obj.id + "pauseDebut").notify(
					  "Configurer l'heure de début de la pause ! ", 
					  { className: 'error', position:"bottom center"}
					).focus();
					return;
				} // Rediriger sur date début


			 	$mdpTimePicker($scope.currentTime, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
			 		if (selectedDate == 'Annuler') {
			 			obj.pause.existe = false;
						$scope.$parent.hours[index].pause.fin = "Fin";
					} else {
						obj.pause.existe = true;
						var time = moment(obj.pause.debut);
						obj.pause.fin = selectedDate;
						var timeFin = moment(obj.pause.fin);

						if (time.isAfter(timeFin)) {
							// Si l'heure de début est supérieur à l'heure de fin
							NotifService.error("Incohérence Heures", "La pause doit se terminer après l'heure de début !");
							$scope.$parent.hours[index].pause.fin = "Fermeture";
							return;
						}
						$scope.nbHours = $scope.calculateTotalNbHours();
						$scope.showAdvanced(ev);
			 		}
			 	});
    	};

    }
  }
});