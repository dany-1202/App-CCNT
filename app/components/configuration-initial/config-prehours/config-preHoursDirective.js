var ctrlCCNT = angular.module('ctrlCCNT');


ctrlCCNT.directive('configPreHours', function($mdDialog, $timeout, State, NotifService, Const, Popover, $mdpTimePicker, DateFactory, ChooseDaysModal) {

	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-prehours/config-preHoursView.html', // Template à utiliser lorsque la balise est utilisé

		link: function(scope, element, attrs) {
			$timeout(Popover.hide, 0);
			/* Controleur se gère ici */
			
			var self = scope;
			console.log(scope);
			scope.prehours = scope.$parent.prehours;
			//scope.preHoursSelected = '';
			
			scope.nbPause = [];
			for (var nb = 0; nb <= 60; nb+=5) {scope.nbPause.push({name: nb + ' minutes', value:nb});}
			
			scope.supHoraire = function(hour, index) {
				scope.prehours.splice(index, 1);
				NotifService.success(Const.TITLE_DELETE_HOUR, Const.MSG_DELETE_HOUR_SUCCESS);
			}
			
			scope.modifHoraire = function (hour, index) {
				self.modif = true;
				self.prehour = hour;
				self.nbPause = scope.nbPause;
				self.deps = scope.$parent.depart;
				$('.side-nav').css('display', 'none');
				
				$mdDialog.show({
			      controller: DialogController,
			      templateUrl: 'app/components/configuration-initial/config-prehours/config-preModalInfoView.html',
			      parent: angular.element(document.body),
			      targetEvent: event,
			      clickOutsideToClose:false,
			      fullscreen: true,
			    })
			    .then(function(objet) {
			    	scope.prehours[index] = objet;
			    }, function() {$('.side-nav').css('display', '');});
			}
			

			scope.showModalHoraire = function () {
				self.modif = false;
				self.deps = scope.$parent.depart;
				self.nbPause = scope.nbPause;
				$('.side-nav').css('display', 'none');

				$mdDialog.show({
			      controller: DialogController,
			      templateUrl: 'app/components/configuration-initial/config-prehours/config-preModalInfoView.html',
			      parent: angular.element(document.body),
			      targetEvent: event,
			      clickOutsideToClose:false,
			      fullscreen: true,
			    })
			    .then(function(objet) {
			    	objet.horaire = {};
			    	objet.horaire.prehours = State.getTabCalDefaultWithPause();
			    	scope.prehours.push(objet);
			    	scope.preHoursSelected = objet;
			    	console.log(objet);
			    	$('.side-nav').css('display', '');

			    }, function() {$('.side-nav').css('display', '');}); 
			}
				
				function DialogController ($scope) {	
			    	$scope.modif = self.modif;	    	
					$scope.dep = $scope.modif ? self.prehour.dep.id : 0;
					$scope.deps = self.deps;
					$scope.nbPause = self.nbPause;
					$scope.textButton = $scope.modif ? Const.SAVE : Const.ADD;
					$scope.title = $scope.modif ? self.prehour.title : '';
					$scope.prehours = $scope.modif ? self.prehour.prehours : State.getTabCalDefaultWithPause();
					
					$scope.matinDebut = DateFactory.matinDebut;
					$scope.matinFin = DateFactory.matinFin;
					$scope.soirDebut = DateFactory.soirDebut;
					$scope.soirFin = DateFactory.soirFin;
					
					
					if (!$scope.modif) {
						for (var i = 0; i < $scope.prehours.length; i++) {
							$scope.prehours[i].datapauseMatin = $scope.nbPause[0];
							$scope.prehours[i].datapauseSoir = $scope.nbPause[0];
						}
					}
					
					
					
					$scope.redefFirst = function () {
						$scope.dep = 0;
					}
					
					$scope.getDepWithId = function () {
						for (var i = 0; i < $scope.deps.length; i++) {
							if ($scope.deps[i].id == $scope.dep) {
								return $scope.deps[i];
							}
						}
						return null;
					}
					
					$scope.showTimeMatinDebut = function(ev, index) {
						$timeout(Popover.hide, 0);
						var objHour = $scope.prehours[index];
						
						var date = objHour.matin.debut == Const.HOUR_OPEN ? moment(angular.copy($scope.matinDebut)).add(index, 'days').toDate() : objHour.matin.debut;
						
					 	$mdpTimePicker(date, {
					 		targetEvent: ev,
					 		parent: angular.element(document.body.parentElement)
					 	}).then(function(selectedDate) {
					 		if (selectedDate == Const.ANNULER) { // (Cliquer sur Supprimer == Annuller)
								objHour.matin.debut = Const.HOUR_OPEN;
								objHour.matin.fin = Const.HOUR_END;
								objHour.soir.debut = Const.HOUR_OPEN;
								objHour.soir.fin = Const.HOUR_END;
							} else {
								if (DateFactory.isHourStartValid(selectedDate, index, $scope.prehours)) {
									selectedDate = moment(DateFactory.getToday()).add(index, 'days').add(selectedDate.getHours(), 'hours').add(selectedDate.getMinutes(), 'minutes').toDate();
									objHour.matin.debut = selectedDate; // Changement de l'heure à jour
					 				
								}  else {
									var dayPrec = DateFactory.getDayPrec(index, $scope.prehours);
									NotifService.error('Horaire invalide', "L'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour " + objHour.day + " doit être supérieur à l'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(dayPrec.soir.fin) + "</span> du soir de " + dayPrec.day); 
								}
							}

					 	});
					};

					/* Affiche le timePicker pour fermeture du Matin (Affiché seulement si existe une coupure = pause) */
					$scope.showTimeMatinFin = function(ev, index) {
						$timeout(Popover.hide, 0);
						var objHour = $scope.prehours[index];
						
						var date = objHour.matin.fin == Const.HOUR_END ? moment(angular.copy($scope.matinFin)).add(index, 'days').toDate() : objHour.matin.fin;
						console.log(date);
						
						if (objHour.matin.debut == Const.HOUR_OPEN) {
							console.log(objHour);
							NotifService.error("Heure d'ouverture non configuré", "L'heure d'ouverture doit être indiqué avant !");
							return;
						}// Rediriger sur date début

					 	$mdpTimePicker(date, {
					 		targetEvent: ev,
					 		parent: angular.element(document.body.parentElement)
					 	}).then(function(selectedDate) {

					 		if (selectedDate == Const.ANNULER) {objHour.matin.fin = Const.HOUR_END; return;} // Si il annule (Clique sur supprimer)

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
					 			objHour.matin.fin = Const.HOUR_END;
					 			NotifService.error("Date invalide", "L'heure de fermeture doit être après la date d'ouverture!");
					 		} else {
					 			// Date est valide
					 			objHour.matin.fin = selectedDate;
					 			
					 		}
					 			
					 	});
					};

					/* Affiche le timePicker pour la date de début du soir */
					$scope.showTimeSoirDebut = function(ev, index) {
						$timeout(Popover.hide, 0);
						var objHour = $scope.prehours[index];
						var date = objHour.soir.debut == Const.HOUR_OPEN ? moment(angular.copy(DateFactory.soirDebut)).add(index, 'days').toDate() : objHour.soir.debut;
						console.log(date);
						/*
						if (objHour.matin.fin == Const.HOUR_END) {
							console.log(objHour);
							NotifService.error("Heure d'ouverture non configuré", "L'heure d'ouverture doit être indiqué avant !");
							return;
						}// Rediriger sur date début*/
						
					 	$mdpTimePicker(date, {
					 		targetEvent: ev,
					 		parent: angular.element(document.body.parentElement)
					 	}).then(function(selectedDate) {
					 		if (selectedDate == Const.ANNULER) {
								objHour.soir.debut = Const.HOUR_OPEN;
								objHour.soir.fin = Const.HOUR_END;
								$scope.showDivOtherHours();
							} else {
								
								if (objHour.soir.fin != Const.HOUR_END && !DateFactory.validateHour(selectedDate, objHour.soir.fin)) {
									/* Date invalide */
					 				NotifService.error("Horaire invalide", "L'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> du soir doit être avant la date de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objHour.soir.fin) + "</span> du soir !");
					 				return;
								}
								
						 		var nbHours = DateFactory.calculateNbHours(objHour.matin.fin, selectedDate);

						 		if (nbHours >= 24) { // Si la date dépasse 24 heures
						 			var nbJours = Math.round(nbHours/24); // Virer les jours si il en a plus que ce qu'il doit
						 			selectedDate = moment(selectedDate).subtract(nbJours, 'days').toDate();
						 		}
						 		
						 		if (objHour.matin.debut != Const.HOUR_OPEN && selectedDate.getDate() != objHour.matin.debut.getDate()) { // Si c'est le jour suivant
						 			selectedDate = selectedDate.setDate(objHour.matin.debut.getDate());
						 			selectedDate = new Date(selectedDate);		 		
						 		}
						 		
						 		/* Cas spécial si je veux choisir minuit ou autre avant l'heure du matin*/
						 		if (selectedDate.getHours() >= 0 && selectedDate.getHours() < objHour.matin.debut.getHours()) {
						 			var objSuiv = DateFactory.getDaySuiv(index, $scope.prehours);
						 			
						 			if (objSuiv.matin.debut != Const.HOUR_OPEN) {
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
									objHour.soir.debut = Const.HOUR_OPEN;
					 				NotifService.error("Date invalide", "L'heure d'ouverture du soir doit être après la date de fermeture du matin !");
								} else {
									/* Date valide */ 
									objHour.soir.debut = selectedDate; // Changement de l'heure à jour
								}
							}
					 	});
					};

					/* Affiche le timePicker pour la date de fin du soir */
					$scope.showTimeSoirFin = function(ev, index) {
						$timeout(Popover.hide, 0);
						
						
						var objHour = $scope.prehours[index];
						var objSuiv = DateFactory.getDaySuiv(index, $scope.prehours);
						var date = objHour.soir.fin == Const.HOUR_END ? moment(angular.copy($scope.soirFin)).add(index, 'days').toDate() : objHour.soir.fin;
						
						if (objHour.matin.debut == Const.HOUR_OPEN) {
							NotifService.error("Heure non configuré", "L'heure d'ouverture du matin de : <strong>" + objHour.day + "</strong> doit être indiqué avant !");
							return;
						}
						
						if (objHour.matin.fin != Const.HOUR_END && objHour.soir.debut == Const.HOUR_OPEN) {
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
								objHour.soir.fin = Const.HOUR_END; // Remet l'heure de fin à son état initial.
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
					 					if (objSuiv.matin.debut != Const.HOUR_OPEN) {
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
						 		
						 		
						 		
						 		if (objHour.soir.debut != Const.HOUR_OPEN && !DateFactory.validateHour(objHour.soir.debut, selectedDate)) {
						 			
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
											objHour.soir.fin = Const.HOUR_OPEN;
							 				NotifService.error('Horaire invalide', "L'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour " + objHour.day + " doit être supérieur à l'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objHour.matin.debut) + "</span> du jour même"); 
							 				return;
										}
						 			}
								} else {
									if (objSuiv.matin.debut != Const.HOUR_OPEN) {
										if (!DateFactory.validateHour(selectedDate, objSuiv.matin.debut)) {
											/* Date invalide */
											objHour.soir.fin = Const.HOUR_OPEN;
							 				NotifService.error('Horaire invalide', "L'heure de fermeture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(selectedDate) + "</span> choisi pour " + objHour.day + " doit être supérieur à l'heure d'ouverture : <span class='uk-label uk-label-default'>" + DateFactory.getTimeStr(objSuiv.matin.debut) + "</span> de " + objSuiv.day + " !"); 
							 				return;
										}
									}
								}
								/* Date valide */ 
								objHour.soir.fin = selectedDate; // Changement de l'heure à jour
								/* Lancement écran qui permet à l'utilisateur de choisir les jours de la semaine qui doivent reprendre les même configurations */
								//ChooseDaysModal.showChooseDays(ev, $scope.prehours);
					 		}
					 	});
			    	};
			    	
			    	var isDayInvalide = function (objDay) {
						return ((objDay.debut != Const.HOUR_OPEN) && (objDay.fin == Const.HOUR_END));
					}
					
					var isDayRempli = function (objDay) {
						return (objDay.debut != Const.HOUR_OPEN && objDay.fin != Const.HOUR_END);
					}
			    	
			    	var lessThanOneHour = function () {
			    		var nb = 0;
			    		for (var i = 0; i < $scope.prehours.length; i++) {
			    			if (isDayInvalide($scope.prehours[i].matin) || isDayInvalide($scope.prehours[i].soir) ) {return true;}
			    			if (isDayRempli($scope.prehours[i].matin) || isDayRempli($scope.prehours[i].soir)) {nb++;}
			    		}
			    		return nb == 0;
			    	}
					
			    	$scope.addHorairePreConfig = function () {
			    		if ($scope.dep == 0 || $scope.title.trim().length == 0) {
			    			NotifService.error(Const.TITLE_IMCOMPLETE_FIELDS, Const.MSG_FILL_FIELDS);
			    			return;
			    		}
			    		
			    		if(lessThanOneHour()) {
			    			NotifService.error(Const.TITLE_IMCOMPLETE_FIELDS, Const.MSG_FILL_HOURS);
			    			return;
			    		}
			    				    		
			    		$mdDialog.hide({
			    			dep: $scope.getDepWithId($scope.dep),
			    			title: $scope.title,
			    			prehours: $scope.prehours,
			    			heureDebut1 : $scope.heureDebut1,
			    			heureFin1 : $scope.heureFin1,
			    			heureDebut2 : $scope.heureDebut2,
			    			heureFin2 : $scope.heureFin2,
			    			pauseService1 : $scope.pauseService1,
			    			pauseService2 : $scope.pauseService2,
			    		});
			    	}
			    	

			    	$scope.hide = function () {
			    		$mdDialog.cancel();
			    	}
				    $scope.test = function () {
				    	console.log($scope.pauseService2);console.log($scope.pauseService1);
				    }
			    }
				
			} // Fin du link
			}
	};
});
