var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configHours', function($mdpTimePicker, NotifService, $mdDialog) {
	

	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-hours/config-hoursView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		
		link: function($scope, $element, $attrs) {
			$scope.status = '  ';
			var now = new Date();
			var nowFin = new Date();
			var nowPauseDebut = new Date();
			var nowPauseFin = new Date();
			now.setHours(7);
			now.setMinutes(0);
			$scope.hourDebut = now;
			nowFin.setHours(23);
			nowFin.setMinutes(00);
			$scope.hourFin = nowFin;
			nowPauseDebut.setHours(15);
			nowPauseDebut.setMinutes(00);
			$scope.pauseDebut = nowPauseDebut;
			nowPauseFin.setHours(17);
			nowPauseFin.setMinutes(00);
			$scope.pauseFin = nowPauseFin;

  		$scope.customFullscreen = true;
  		$scope.nbHours = 0;
  		$scope.affFirstTime = false;

  		$scope.msgNotif = function (id, text, className) {
				$(id).notify(
					  text , { className: className, position:"bottom center"}
					).focus();
			}

  		if ($scope.$parent.nbHoursChosen == null || $scope.$parent.nbHoursChosen == "") {
  			/* Afficher message du nombre d'heure */ 
  			$scope.msgNotif("#nbHours", "Insérer le nombre totales d'heures pour la semaine", 'info');
  		};	

			$scope.showAdvanced = function(ev, objHour) {
		    $mdDialog.show({
		      controller: DialogController,
		      templateUrl: 'app/components/configuration-initial/config-hours/config-mdDialogView.html',
		      parent: angular.element(document.body),
		      targetEvent: ev,
		      clickOutsideToClose:true,
		      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
		    })
		    .then(function(days) {
		     	for (var i = days.length - 1; i >= 0; i--) {
		     		if (days[i].chosen && days[i].day != objHour.day) { // Il a choisi ce jour pour reprendre les même horaires
		     			$scope.$parent.hours[i].journee.debut = objHour.journee.debut;
		     			$scope.$parent.hours[i].journee.fin = objHour.journee.fin;
		     			if (objHour.pause.existe) {
		     				$scope.$parent.hours[i].pause.existe = objHour.pause.existe;
		     				$scope.$parent.hours[i].pause.debut = objHour.pause.debut;
		     				$scope.$parent.hours[i].pause.fin = objHour.pause.fin;
		     			}
		     		}
		     	};
		     	$scope.nbHours = $scope.calculateTotalNbHours();
		     	if ($scope.nbHours < $scope.$parent.nbHoursChosen) {
    				$scope.msgNotif("#nbHours", "Toutes vos heures n'ont pas été configuré !", 'error');
    			}
	    		if ($scope.nbHours > $scope.$parent.nbHoursChosen) {
	    			$scope.msgNotif("#nbHours", "Vos heures : " + $scope.nbHours + " dépasse le nombre \n\r total d'heure : " + $scope.$parent.nbHours + " accordé \n\r pour votre semaine", 'error');
    			}
		    }, function() {
		    	// Ici il annule ça ne fait rien 
		    });
		  };

		  $scope.addPause = function (index) {
		  	//$scope.hours[index].pause.existe = true;
		  };

		  function DialogController($scope, $mdDialog) {
		  	$scope.days = [
		  									//{day: 'Tous les jours', chosen : false},
		  									{day: 'Lundi', chosen : false},
		                    {day: 'Mardi', chosen : false},
		                    {day: 'Mercredi', chosen : false},
		                    {day: 'Jeudi', chosen : false},
		                    {day: 'Vendredi', chosen : false},
		                    {day: 'Samedi', chosen : false},
		                    {day: 'Dimanche', chosen : false}
		  								];

		  	$scope.verifyEveryDay = function(index) {
		  		/*var objHour = $scope.days[index];
		  		var objHourEvery = $scope.days[0];
		  		if (!objHour.equals(objHourEvery)) {
		  			console.log(objHour);
		  			console.log(objHourEvery);
		  		} */
		  	}

		    $scope.hide = function() {
		      $mdDialog.hide();
		    };

		    $scope.cancel = function() {
		      $mdDialog.cancel();
		    };

		    $scope.answer = function() {
		    	$mdDialog.hide($scope.days);
		    }
		  };

		  $scope.verifyNbHours = function () {
		  	if ($scope.$parent.nbHoursChosen == null || $scope.$parent.nbHoursChosen == 0) {
		  		$scope.msgNotif("#nbHours", "Veuillez insérer un nombre d'heures valide ! ", 'error');
					return true;
				}
				return false;
		  }

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
					var objHour = $scope.$parent.hours[i];
					if (objHour.journee.debut != "Ouverture" && objHour.journee.fin != "Fermeture") {
						if (objHour.pause.existe == false) {
							nbHours += $scope.calculateNbHours(objHour.journee.debut, objHour.journee.fin);
						} else {
							var tmp = $scope.calculateNbHours(objHour.journee.debut, objHour.journee.fin);
							var tmpPause = $scope.calculateNbHours(objHour.pause.debut, objHour.pause.fin);
							nbHours += (tmp - tmpPause);
						}
					}
				};
				return nbHours;
			}

			$scope.validateHourFin = function (objHour, hourFin) {
				/* La date du début est après que la date du début de la pause - FALSE*/
				if (moment(objHour.journee.debut).isAfter(moment(hourFin))) {return false;}
				return true;
			}

			$scope.validatePauseDebut = function (objHour, hourPauseDebut) {
				/* La date du début est après que la date du début de la pause - FALSE*/
				if (moment(objHour.journee.debut).isAfter(moment(hourPauseDebut))) {return false;}
				/* La date de fin est avant que la date de fin de la pause - FALSE*/
				if (moment(hourPauseDebut).isAfter(moment(objHour.journee.fin))) {return false;}
				return true;
			}

			$scope.validatePauseFin = function (objHour, hourPauseFin) {
				/* Si l'heure de pause de début vient après l'heure de fin de pause ça ne joue pas */
				if (moment(objHour.pause.debut).isAfter(moment(hourPauseFin))) {return false;}
				/* Si l'heure de pause de fin vient après l'heure de fermeture ça ne joue pas */
				if (moment(hourPauseFin).isAfter(moment(objHour.journee.fin))) {return false;}
				return true;
			}

      /* Affiche le timePicker pour ouverture */
			$scope.showTimeJourneeDebut = function(ev, index) {
				var objHour = $scope.hours[index];

				

				if ($scope.verifyNbHours()) {return;}; // Si le nombre d'heures n'est pas configuré je quitte
			 
			 	$mdpTimePicker(objHour.journee.debut == "Ouverture" ? $scope.hourDebut: objHour.journee.debut, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
			 		if (selectedDate == 'Annuler') {
						objHour.journee.debut = "Ouverture";
						objHour.journee.fin = "Fermeture";
						objHour.pause.debut = "Début";
						objHour.pause.fin = "Fin";
						$scope.nbHours = $scope.calculateTotalNbHours();
					} else {
						if (objHour.journee.fin != "Fermeture") {
							if (moment(selectedDate).isAfter(moment(objHour.journee.fin))) {
								$scope.msgNotif("#"+objHour.id+"debut", "L'heure n'est pas valide avec l'heure de fermeture", 'error');
								return
							}
						}
						$scope.$parent.hours[index].journee.debut = selectedDate; // Changement de l'heure à jour
					}	
			 	});
			};

			/* Affiche le timePicker pour fermeture */
			$scope.showTimeJourneeFin = function(ev, index) {
				var objHour = $scope.hours[index];
				if ($scope.verifyNbHours()) {return;}; 
				if (objHour.journee.debut == "Ouverture") {
					$scope.msgNotif("#"+objHour.id+"debut", "Configurer l'heure d'ouverture ! ", 'error');
					return;
				}// Rediriger sur date début

			 	$mdpTimePicker(objHour.journee.fin == "Fermeture" ? $scope.hourFin: objHour.journee.fin, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
				 		if (selectedDate == 'Annuler') {
							$scope.$parent.hours[index].journee.fin = "Fermeture";
							$scope.nbHours = $scope.calculateTotalNbHours();
						} else {
							if (!$scope.validateHourFin(objHour, selectedDate)) {
								// Si l'heure de début est supérieur à l'heure de fin
								$scope.msgNotif("#"+objHour.id+"debut", "L'heure de début doit être inférieur à l'heure de fin ! ", 'error');
								$scope.msgNotif("#"+objHour.id+"fin", "L'heure de début doit être inférieur à l'heure de fin ! ", 'error');
								return;
							}
							$scope.$parent.hours[index].journee.fin = selectedDate;
							$scope.nbHours = $scope.calculateTotalNbHours();
							//$scope.showAdvanced(ev); // 
				 		}
			 	});
			};

			
			/* Affiche le timePicker pour la pause début  */
			$scope.showTimePauseDebut = function(ev, index) {
				var objHour = $scope.$parent.hours[index];
				if ($scope.verifyNbHours()) {return;};

				/*	Vérifie si l'heure d'ouverture est configuré */
				if (objHour.journee.debut == "Ouverture") {
					$scope.msgNotif("#"+objHour.id+"debut", "Configurer l'heure d'ouverture !", 'error');
					return;
				}// Rediriger sur date début

				/*	Vérifie si l'heure de fermeture est configuré */
				if (objHour.journee.fin == "Fermeture") {
					$scope.msgNotif("#"+objHour.id+"fin", "Configurer l'heure de fermeture !", 'error');
					return;
				}// Rediriger sur date début

			 	$mdpTimePicker(objHour.pause.debut == "Début" ? $scope.pauseDebut: objHour.pause.debut, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
			 		if (selectedDate == 'Annuler') { // Si l'utilisateur supprime l'heure
						objHour.pause.debut = "Début";
						objHour.pause.fin = "Fin";
						$scope.nbHours = $scope.calculateTotalNbHours();
					} else {

						if (!$scope.validatePauseDebut(objHour, selectedDate)) {// Valide l'heure de la pause du début
							objHour.pause.debut = "Début";
							objHour.pause.fin = "Fin";
							var txt = "L'heure de pause n'entre pas dans \r\n la plage horaire de " + objHour.day;
							$scope.msgNotif("#"+objHour.id+"pauseDebut", txt, 'error');
							return;
						} 
						objHour.pause.debut = selectedDate; // Changement de l'heure à jour
					}
			 	});
			};

			/* Affiche le timePicker pour la pause fin  */
			$scope.showTimePauseFin = function(ev, index) {

				var objHour = $scope.hours[index];
				/* 
					Pré validation
					- Check si le nombre d'heures est correct (Supérieur à 0) est non vide 
					- Check si l'heure de début de pause a été saisi sinon il redirige sur le bouton de début et prend le focus
				*/
				if ($scope.verifyNbHours()) {return;};

				if (objHour.pause.debut == "Début") {
					$scope.msgNotif("#"+objHour.id+"pauseDebut", "Configurer l'heure de début de la pause ! ", 'error');
					return;
				}

				/* Affiche le timePicker */
			 	$mdpTimePicker(objHour.pause.fin == "Fin" ? $scope.pauseFin: objHour.pause.fin, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {

			 		/* Dès que la saisie est faite */
			 		if (selectedDate == 'Annuler') { // Si L'utilisateur supprime l'heure saisi
			 			objHour.pause.existe = false;
						$scope.$parent.hours[index].pause.fin = "Fin"; // Remet l'heure de fin à son état initial.
						$scope.nbHours = $scope.calculateTotalNbHours();
					} else { // Si l'utilisateur valide son heure

						/* Vérification que l'heure de pause de fin est valide et peut être rentré */
						if (!$scope.validatePauseFin(objHour, selectedDate)) {
							// Si l'heure de début est supérieur à l'heure de fin
							$scope.msgNotif("#"+objHour.id+"pauseDebut", "L'heure de début doit être inférieur à l'heure de fin ! ", 'error');
							$scope.msgNotif("#"+objHour.id+"pauseFin", "L'heure de début doit être inférieur à l'heure de fin ! ", 'error');
							$scope.$parent.hours[index].pause.fin = "Fermeture";
							return;
						}
						objHour.pause.existe = true;
						objHour.pause.fin = selectedDate;
						$scope.nbHours = $scope.calculateTotalNbHours(); // Met à jour le nombre total d'heures configuré
						/* Lancement écran qui permet à l'utilisateur de choisir les jours de la semaine qui doivent reprendre les même configurations */
						
						//if ($scope.affFirstTime == false) {
							$scope.showAdvanced(ev, objHour);
							$scope.affFirstTime = true;
						//}
					
			 		}
			 	});
    	};

    	$scope.validationHours = function () {
    		// Valider le nombre total d'heure
    		if ($scope.$parent.nbHoursChosen == null || $scope.$parent.nbHours == "") {
    			$scope.msgNotif("#nbHours", "Veuillez insérer un nombre d'heures valide !", 'error');
    		}
    		if ($scope.nbHours != 0) {
    			if ($scope.nbHours < $scope.$parent.nbHoursChosen) {
    				$scope.msgNotif("#nbHours", "Toutes vos heures n'ont pas été configuré !", 'error');
    				return;
    			}
    			if ($scope.nbHours > $scope.$parent.nbHoursChosen) {
    				$scope.msgNotif("#nbHours", "Vos heures : " + $scope.nbHours + " dépasse le nombre \n\r total d'heure : " + $scope.$parent.nbHoursChosen + " accordé \n\r pour votre semaine", 'error');
    				return;
    			}
    			$scope.ctrl.next(3);
    		}	else {
    			$scope.msgNotif("#1debut", "Veuillez configurer votre semaine !", 'error');
    		}
    	}

    }
  }
});