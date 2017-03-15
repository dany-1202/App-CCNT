(function (){
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('calValidator', function (Const, $timeout, $mdpTimePicker, DateFactory, NotifService, $mdDialog, State, Popover) {
	return {
		restrict: 'A',
		link: function ($scope, element, attrs) {
			/*///////////////////////////////////////////////////////////////////////////////////////*/

			/*****************************************************************************************\
			*            Gestion des jours avec les horaires d'ouvertures - Matin et - Soir           *
			\*****************************************************************************************/

      			/* Affiche le timePicker pour ouverture du Matin */
			$scope.showTimeMatinDebut = function(ev, index) {
				$timeout(Popover.hide, 0);
				var objHour = $scope.cal.hours[index];
				
				var date = objHour.matin.debut == Const.OPEN ? moment(angular.copy($scope.matinDebut)).add(index, 'days').toDate() : objHour.matin.debut;
				
			 	$mdpTimePicker(date, {
			 		targetEvent: ev,
			 		parent: angular.element(document.body.parentElement)
			 	}).then(function(selectedDate) {
			 		if (selectedDate == Const.ANNULER) { // (Cliquer sur Supprimer == Annuller)
						objHour.matin.debut = Const.OPEN;
						objHour.matin.fin = Const.END;
						objHour.soir.debut = Const.OPEN;
						objHour.soir.fin = Const.END;
						$scope.showDivOtherHours();
					} else {
						if (DateFactory.isHourStartValid(selectedDate, index, $scope.cal.hours)) {
							selectedDate = moment(DateFactory.getToday()).add(index, 'days').add(selectedDate.getHours(), 'hours').add(selectedDate.getMinutes(), 'minutes').toDate();
							objHour.matin.debut = selectedDate; // Changement de l'heure à jour
			 				if ((objHour.pause.existe ? !$scope.testWithCoupuresFin(objHour) : !$scope.testWithoutCoupuresFin(objHour)) && !$scope.allDaysCompleted()) {$scope.showAdvanced(ev, objHour); if ($scope.cal.errorName || $scope.cal.errorPeriod) {$scope.cal.state = Const.INCOMP;} else {$scope.cal.state = Const.COMP;}} else {$scope.cal.state = Const.INCOMP;}
						}  else {
							var dayPrec = DateFactory.getDayPrec(index, $scope.cal.hours);
							NotifService.error('Horaire invalide', "L'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour " + objHour.day + " doit être supérieur à l'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(dayPrec.soir.fin) + "</span> du soir de " + dayPrec.day); 
						}
					}
					$scope.showDivOtherHours();
			 	});
			};

			/* Affiche le timePicker pour fermeture du Matin (Affiché seulement si existe une coupure = pause) */
			$scope.showTimeMatinFin = function(ev, index) {
				$timeout(Popover.hide, 0);
				var objHour = $scope.cal.hours[index];
				
				var date = objHour.matin.fin == Const.END ? moment(angular.copy($scope.matinFin)).add(index, 'days').toDate() : objHour.matin.fin;
				console.log(date);
				
				if (objHour.matin.debut == Const.OPEN) {
					console.log(objHour);
					NotifService.error("Heure d'ouverture non configuré", "L'heure d'ouverture doit être indiqué avant !");
					return;
				}// Rediriger sur date début

			 	$mdpTimePicker(date, {
			 		targetEvent: ev,
			 		parent: angular.element(document.body.parentElement)
			 	}).then(function(selectedDate) {

			 		if (selectedDate == Const.ANNULER) {objHour.matin.fin = Const.END; $scope.showDivOtherHours();return;} // Si il annule (Clique sur supprimer)

			 		var nbHours = DateFactory.calculateNbHours(objHour.matin.debut, selectedDate);

			 		if (nbHours >= 24) { // Si la date dépasse 24 heures
			 			var nbJours = Math.round(nbHours/24); // Virer les jours si il en a plus que ce qu'il doit
			 			selectedDate = moment(selectedDate).subtract(nbJours, 'days').toDate();
			 		}

			 		if (selectedDate.getDate() != objHour.matin.debut.getDate()) { // Si c'est le jour suivant
			 			selectedDate = selectedDate.setDate(objHour.matin.debut.getDate());
			 			selectedDate = new Date(selectedDate);		 		
			 		}

			 		/****************************************************************************\
						Contrôler si la date est supérieur à matin début ! Sinon on la rejette 
					\****************************************************************************/
			 		if (!DateFactory.validateHour(objHour.matin.debut, selectedDate)) {
			 			// Date est invalide
			 			objHour.matin.fin = Const.END;
			 			NotifService.error("Date invalide", "L'heure de fermeture doit être après la date d'ouverture!");
			 		} else {
			 			// Date est valide
			 			objHour.matin.fin = selectedDate;
			 			if ((objHour.pause.existe ? !$scope.testWithCoupuresFin(objHour) : !$scope.testWithoutCoupuresFin(objHour)) && !$scope.allDaysCompleted()) {$scope.showAdvanced(ev, objHour); if ($scope.cal.errorName || $scope.cal.errorPeriod) {$scope.cal.state = Const.INCOMP;} else {$scope.cal.state = Const.COMP;}} else {$scope.cal.state = Const.INCOMP;}
			 		}
			 		$scope.showDivOtherHours();
			 			
			 	});
			};

			/* Affiche le timePicker pour la date de début du soir */
			$scope.showTimeSoirDebut = function(ev, index) {
				$timeout(Popover.hide, 0);
				var objHour = $scope.cal.hours[index];
				var date = objHour.soir.debut == Const.OPEN ? moment(angular.copy(DateFactory.soirDebut)).add(index, 'days').toDate() : objHour.soir.debut;
				console.log(date);
				
				if (objHour.matin.fin == Const.END) {
					console.log(objHour);
					NotifService.error("Heure d'ouverture non configuré", "L'heure d'ouverture doit être indiqué avant !");
					return;
				}// Rediriger sur date début
				
			 	$mdpTimePicker(date, {
			 		targetEvent: ev,
			 		parent: angular.element(document.body.parentElement)
			 	}).then(function(selectedDate) {
			 		if (selectedDate == Const.ANNULER) {
						objHour.soir.debut = Const.OPEN;
						objHour.soir.fin = Const.END;
						$scope.showDivOtherHours();
					} else {
						
						if (objHour.soir.fin != Const.END && !DateFactory.validateHour(selectedDate, objHour.soir.fin)) {
							/* Date invalide */
			 				NotifService.error("Horaire invalide", "L'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> du soir doit être avant la date de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objHour.soir.fin) + "</span> du soir !");
			 				return;
						}
						
				 		var nbHours = DateFactory.calculateNbHours(objHour.matin.fin, selectedDate);

				 		if (nbHours >= 24) { // Si la date dépasse 24 heures
				 			var nbJours = Math.round(nbHours/24); // Virer les jours si il en a plus que ce qu'il doit
				 			selectedDate = moment(selectedDate).subtract(nbJours, 'days').toDate();
				 		}

				 		if (selectedDate.getDate() != objHour.matin.debut.getDate()) { // Si c'est le jour suivant
				 			selectedDate = selectedDate.setDate(objHour.matin.debut.getDate());
				 			selectedDate = new Date(selectedDate);		 		
				 		}
				 		
				 		/* Cas spécial si je veux choisir minuit ou autre avant l'heure du matin*/
				 		if (selectedDate.getHours() >= 0 && selectedDate.getHours() < objHour.matin.debut.getHours()) {
				 			var objSuiv = DateFactory.getDaySuiv(index, $scope.cal.hours);
				 			
				 			if (objSuiv.matin.debut != Const.OPEN) {
				 				if (selectedDate.getHours() >= objSuiv.matin.debut.getHours()) {
				 					if (selectedDate.getHours() == objSuiv.matin.debut.getHours()) {
				 						/* Comparaison des minutes */
				 						if (selectedDate.getMinutes() >= objSuiv.matin.debut.getMinutes()) {
				 							NotifService.error("Date invalide", "L'heure d'ouverture du soir doit être après la date de fermeture du matin !");
			 								return;
				 						}
				 					}
				 				}
				 			}
				 			selectedDate = moment(selectedDate).add(1, 'days').toDate();
			 				selectedDate = new Date(selectedDate);	
				 		}
				 		
						/****************************************************************************\
							Contrôler si la date est supérieur à matin fin ! Sinon on la rejette 
						\****************************************************************************/
						if (!DateFactory.validateHour(objHour.matin.fin, selectedDate)) {
							/* Date invalide */
							objHour.soir.debut = Const.OPEN;
			 				NotifService.error("Date invalide", "L'heure d'ouverture du soir doit être après la date de fermeture du matin !");
						} else {
							/* Date valide */ 
							objHour.soir.debut = selectedDate; // Changement de l'heure à jour
			 				if ((objHour.pause.existe ? !$scope.testWithCoupuresFin(objHour) : !$scope.testWithoutCoupuresFin(objHour)) && !$scope.allDaysCompleted()) {$scope.showAdvanced(ev, objHour); if ($scope.cal.errorName || $scope.cal.errorPeriod) {$scope.cal.state = Const.INCOMP;} else {$scope.cal.state = Const.COMP;}} else {$scope.cal.state = Const.INCOMP;}

						}
					}
					$scope.showDivOtherHours();
			 	});
			};

			/* Affiche le timePicker pour la date de fin du soir */
			$scope.showTimeSoirFin = function(ev, index) {
				$timeout(Popover.hide, 0);
				
				
				var objHour = $scope.cal.hours[index];
				var objSuiv = DateFactory.getDaySuiv(index, $scope.cal.hours);
				var date = objHour.soir.fin == Const.END ? moment(angular.copy($scope.soirFin)).add(index, 'days').toDate() : objHour.soir.fin;
				
				if (objHour.matin.debut == Const.OPEN) {
					NotifService.error("Heure non configuré", "L'heure d'ouverture du matin de : <strong>" + objHour.day + "</strong> doit être indiqué avant !");
					return;
				}
				
				if (objHour.matin.fin != Const.END && objHour.soir.debut == Const.OPEN) {
					NotifService.error("Heure non configuré", "L'heure d'ouverture du soir de : " + objHour.day + " doit être indiqué avant !");
					return;
				}


				/* Affiche le timePicker */
			 	$mdpTimePicker(date, {
			 		targetEvent: ev,
			 		parent: angular.element(document.body.parentElement)
			 	}).then(function(selectedDate) {
			 		/* Dès que la saisie est faite */
			 		
			 		if (selectedDate == Const.ANNULER) { // Si L'utilisateur supprime l'heure saisi
						objHour.soir.fin = Const.END; // Remet l'heure de fin à son état initial.
						if ($scope.isHoursCompleted()) {$scope.cal.state = Const.COMP;} else {$scope.cal.state = Const.INCOMP;}
						$scope.showDivOtherHours();
						return;
					} else { // Si l'utilisateur valide son heure
						
						
						/* Vérification que l'heure de pause de fin est valide et peut être rentré */
						var nbHours = DateFactory.calculateNbHours(objHour.soir.debut, selectedDate);

				 		if (nbHours >= 24) { // Si la date dépasse 24 heures
				 			var nbJours = Math.round(nbHours/24); // Virer les jours si il en a plus que ce qu'il doit
				 			selectedDate = moment(selectedDate).subtract(nbJours, 'days').toDate();
				 		} else {
				 			
				 			if (selectedDate.getHours() >= 0 && selectedDate.getHours() <= objHour.matin.debut.getHours()) { // Si c'est le jour suivant
				 				if (selectedDate.getHours() == objHour.matin.debut.getHours()) { // Si même heure
				 					if (selectedDate.getMinutes() > objHour.matin.debut.getMinutes()) { // Comparer les minutes
				 						
				 						NotifService.error('Horaire invalide', "L'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour " + objHour.day + " doit être supérieur à l'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objHour.matin.debut) + "</span> du jour même !"); 
										$scope.showDivOtherHours();
										return;		 						
				 					}
				 				}
				 				selectedDate = selectedDate.setDate(objHour.matin.debut.getDate() + 1); // Je rajoute un jour
								selectedDate = new Date(selectedDate); 
			 				} else if (selectedDate.getHours() < 12) { // Si je suis dans le matin et que l'heure que j'ai séléctionné et plus grande que celle du demain
			 					if (objSuiv.matin.debut != Const.OPEN) {
				 					if (selectedDate.getHours() == objSuiv.matin.debut.getHours()) { // Si même heure
					 					if (selectedDate.getMinutes() > objSuiv.matin.debut.getMinutes()) { // Comparer les minutes
					 						NotifService.error('Horaire invalide', "L'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour " + objHour.day + " doit être supérieur à l'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objSuiv.matin.debut) + "</span> de " + objSuiv.day + " !"); 
											$scope.showDivOtherHours();
											
											return;	
					 					}
					 				} else {
					 					
					 					
					 					NotifService.error('Horaire invalide', "L'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour " + objHour.day + " doit être supérieur à l'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objSuiv.matin.debut) + "</span> de " + objSuiv.day + " !"); 
										$scope.showDivOtherHours();
										return;			
					 				}
				 					selectedDate = selectedDate.setDate(objSuiv.matin.debut.getDate()); // Je rajoute un jour
									selectedDate = new Date(selectedDate); 
			 					}
			 				} else {
			 					selectedDate = selectedDate.setDate(objHour.matin.debut.getDate()); // Je rajoute un jour
								selectedDate = new Date(selectedDate); 
			 				}
				 		}
				 		
				 		
				 		
				 		if (objHour.soir.debut != Const.OPEN && !DateFactory.validateHour(objHour.soir.debut, selectedDate)) {
				 			
				 			NotifService.error('Horaire invalide', "L'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour le soir doit être supérieur à l'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objHour.soir.debut) + "</span> du soir !"); 
			 				return;
				 		}
				 						 		
				 		/****************************************************************************\
							Contrôler si la date est supérieur à matin fin ! Sinon on la rejette 
						\****************************************************************************/
						
						if (index == 6) {
							if (selectedDate.getHours() >= 0 && selectedDate.getHours() <= objSuiv.matin.debut.getHours()) { // Si c'est le jour suivant
				 				if (selectedDate.getHours() == objSuiv.matin.debut.getHours()) { // Si même heure
				 					if (selectedDate.getMinutes() > objSuiv.matin.debut.getMinutes()) { // Comparer les minutes
				 						NotifService.error('Horaire invalide', "L'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour " + objHour.day + " doit être inférieur à l'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objSuiv.matin.debut) + "</span> de " + objSuiv.day + " !"); 
										$scope.showDivOtherHours();
										return;		 						
				 					}
				 				}
				 			} else {
				 				if (!DateFactory.validateHour(objHour.matin.debut, selectedDate)) {
									/* Date invalide */
									objHour.soir.fin = Const.OPEN;
					 				NotifService.error('Horaire invalide', "L'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour " + objHour.day + " doit être supérieur à l'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objHour.matin.debut) + "</span> du jour même"); 
					 				return;
								}
				 			}
						} else {
							if (objSuiv.matin.debut != Const.OPEN) {
								if (!DateFactory.validateHour(selectedDate, objSuiv.matin.debut)) {
									/* Date invalide */
									objHour.soir.fin = Const.OPEN;
					 				NotifService.error('Horaire invalide', "L'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour " + objHour.day + " doit être supérieur à l'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objSuiv.matin.debut) + "</span> de " + objSuiv.day + " !"); 
					 				return;
								}
							}
						}
						/* Date valide */ 
						objHour.soir.fin = selectedDate; // Changement de l'heure à jour
						/* Lancement écran qui permet à l'utilisateur de choisir les jours de la semaine qui doivent reprendre les même configurations */
					
			 			if ((objHour.pause.existe ? !$scope.testWithCoupuresFin(objHour) : !$scope.testWithoutCoupuresFin(objHour)) && !$scope.allDaysCompleted()) {$scope.showAdvanced(ev, objHour); if ($scope.cal.errorName || $scope.cal.errorPeriod) {$scope.cal.state = Const.INCOMP;} else {$scope.cal.state = Const.COMP;}} else {$scope.cal.state = Const.INCOMP;}
			 		}
			 		$scope.showDivOtherHours();
			 	});
	    	};

		/*///////////////////////////////////////////////////////////////////////////////////////*/
		}
	};
})

})();