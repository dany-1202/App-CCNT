(function(){ 
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configHours', function($mdpTimePicker, NotifService, $mdDialog, $timeout, Popover, DateFactory, Const, State) {
	
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-hours/config-hoursView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclut la vue au template déjà existant
		
		link: function($scope, $element, $attrs) {

			/* Construction des dates nécessaires - Afin d'avoir des valeurs par défaut */
			$scope.matinDebut = DateFactory.matinDebut;
			$scope.matinFin = DateFactory.matinFin;
			$scope.soirDebut = DateFactory.soirDebut;
			$scope.soirFin = DateFactory.soirFin;

			$scope.customFullscreen = true; // Affiche la fenêtre modale en plein écran pour les smartphones
	  		
	  		$scope.modifCCNT = false; // Doit afficher la modification des heures soumis CCNT
	  		$scope.modifHours = false; // Doit afficher les valeurs à modifier pour les heures soumis CCNT
	  		$scope.choix = State.choix; // Choix pour le type d'ouverture : 0 : En Continue ou 1 : Avec Coupure
			$scope.freq = State.freq; // Choix sur la fréquence des coupures
			$scope.selectedD = State.selectedD; // Contient les jours ou des coupures ont lieu
			$scope.affOtherHours = false;
			$scope.affModifOtherHours1 = false;
			$scope.affModifOtherHours2 = false;
			$scope.nameCalendar = "";
			$scope.periodFin = "";
			$scope.periodDebut = "";
			$scope.tabCalendars = [];

	  		/*///////////////////////////////////////////////////////////////////////////////////////*/

		  	/*****************************************************************************************\
			*                                 Validation des heures                                   *
			\*****************************************************************************************/

			var testWithCoupures = function (objDay) {
				return (objDay.matin.debut == Const.OPEN && objDay.matin.fin == Const.END && objDay.soir.debut == Const.OPEN && objDay.soir.fin == Const.END);
			}

			var testWithoutCoupures = function (objDay) {
				return (objDay.matin.debut == Const.OPEN && objDay.soir.fin == Const.END);
			}

			var validateAllHours = function () {
				for (var i = 0; i < $scope.hours.length; i++) {
					var obj = $scope.hours[i];
					if (obj.pause.existe) {
						// Tester que les 4 dates sont saisies
						if (testWithCoupures(obj)) {return false;}
					} else {
						// Tester seulement matin début et soir fin
						if (testWithoutCoupures(obj)) {return false;}
					}
				}
				return true;
			}

	  		if (validateAllHours()) {
	  			$scope.affChoiceOpenning = false; // Afficher la question du type d'ouverture
	  			$scope.affCalendar = true; // Afficher le calendrier
	  		} else {
	  			$scope.affChoiceOpenning = true; // Afficher la question du type d'ouverture
	  			$scope.affCalendar = false; // Afficher le calendrier
	  		}

	  		
			/*****************************************************************************************\
			*                           Gestion de l'affichage des popovers                           *
			\*****************************************************************************************/

	  		var hide = function () {
				$("div.popover").popover('hide');
			}

			var show = function () {
				$('#choiceOpenning').popover('show');
				$("div.popover").click(function(e) {
		   			e.preventDefault();
					$(e.currentTarget).popover('hide');
				});
			}

			var showHourModif = function () {
				$('#hourModif').popover('show');
				$('#choiceCCNT').popover('show');
				
				if ($scope.choix.id == 0) {$('#1debut').popover('show');} else {$('#1debutMatin').popover('show');}
				
				$("div.popover").click(function(e) {
		   			e.preventDefault();
					$(e.currentTarget).popover('hide');
				});
			}


			if (Popover.firstTimeHours) { // Savoir grâce au factory si c'est la première fois qu'il affiche le poppover
				$timeout(show, 200); // Lancer les popovers
				$timeout(hide, 30000); // Cacher les popovers 
				Popover.changeFirstTimeHours(); // Change à false pour que la prochaine fois il ne rentre plus dans le test, car il l'aura afficher
			}

			/* Cacher les popovers */
			$scope.hidePopovers = function () { 
				$timeout(hide, 1);
			}
			/*///////////////////////////////////////////////////////////////////////////////////////*/
			
			/*****************************************************************************************\
			*     Gestion des checkbox pour les jours à selectionner Avec Coupures (Pas utiliser)     *
			\*****************************************************************************************/

			$scope.toggle = function (item, list) {
		        var idx = list.indexOf(item);
		        var pos = $scope.hours.indexOf(item);
		        if (idx > -1) {
		          list.splice(idx, 1);
		          $scope.hours[pos].pause.existe = false;
		        }
		        else {
		          list.push(item);
		          $scope.hours[pos].pause.existe = true;
		        }
		    };

			$scope.exists = function (item, list) {
		        return $scope.hours[$scope.hours.indexOf(item)].pause.existe || list.indexOf(item) > -1;
	      	};

	      	/*///////////////////////////////////////////////////////////////////////////////////////*/

	      	/*****************************************************************************************\
			*                  Gestion de l'affichage de la question du type d'ouverture              *
			\*****************************************************************************************/

	      	/* Affiche le calendrier et cache la question */
	  		$scope.afficherCalendar = function () {
	  			$scope.affChoiceOpenning = false;
	  			$scope.affCalendar = true;
	  		}

	  		/* Affiche la modification des heures CCNT */
	  		$scope.affModif = function () {
	  			$timeout(hide, 1);
	  			if ($scope.modifHours == false) {
	  				$scope.modifCCNT = !$scope.modifCCNT;	
	  			}
	  		}

	  		/* Affiche la modification des heures (Valeurs) CCNT*/
	  		$scope.affModifHours = function () {
	  			$scope.modifCCNT = false;
	  			$scope.modifHours = true;
	  			$timeout(hide, 1);
	  		}

	  		/* Enregistre la modification des Heures CCNT*/
	  		$scope.modifHoursCCNT = function (hours) {
	  			$scope.hoursCCNTChosen = hours;
	  			$scope.modifCCNT = false;
	  			$scope.modifHours = false;
	  			$timeout(hide, 1);
	  		}

	  		$scope.endCoupures = function () {
	  			$scope.afficherCalendar();
	  			if (Popover.affHourModif) {
					$timeout(showHourModif, 400);
					Popover.changeAffHourModif();
				}
				console.log("Ici");
	  		}

			/*///////////////////////////////////////////////////////////////////////////////////////*/



	      	/*****************************************************************************************\
			*              Gestion de l'affichage de la question avez vous d'autre horaires           *
			\*****************************************************************************************/

			$scope.addOtherHours = function () {
				$scope.affModifOtherHours1 = false;
				$scope.affModifOtherHours2 = true;
			}

			/*///////////////////////////////////////////////////////////////////////////////////////*/

	  		/*****************************************************************************************\
			*                                 Gestion des coupures                                    *
			\*****************************************************************************************/

	  		$scope.putAllDayPause = function () {
	  			for (var i = 0; i < $scope.hours.length; i++) {
	  				$scope.hours[i].pause.existe = true;
	  			}
	  		}

	  		$scope.removeAllDayPause = function () {
	  			for (var i = 0; i < $scope.hours.length; i++) {
	  				$scope.hours[i].pause.existe = false;
	  			}
	  		}
	  		
	  		/*///////////////////////////////////////////////////////////////////////////////////////*/

	  		/*****************************************************************************************\
			*                               Gestion des notifications                                 *
			\*****************************************************************************************/

	  		var msgNotif = function (id, text, className) {
				$(id).notify(
					  text , { className: className, position:"bottom center"}
				).focus();
			}

			/*///////////////////////////////////////////////////////////////////////////////////////*/

			/*****************************************************************************************\
			*       Gestion de l'affichage du type d'ouverture : En continue ou avec coupures 		  *         
			\*****************************************************************************************/

	  		$scope.choiceOpenning = function (idChoix) {
	  			$timeout(hide, 1);
	  			$scope.choix = State.changeChoix(idChoix);
	  			if (idChoix != 1) {
	  				$scope.afficherCalendar();
	  				if (Popover.affHourModif) {
						$timeout(showHourModif, 400);
						Popover.changeAffHourModif();
					}
	  			}
	  		}

	  		$scope.choiceFrequencyCoup = function (idFreq) {
	  			$scope.choix.freq = State.changeFreq(idFreq);
	  			$timeout(hide, 1);
	  			if (idFreq != 1) {
	  				$scope.putAllDayPause();
		  			$scope.afficherCalendar();
		  			if (Popover.affHourModif) {
						$timeout(showHourModif, 400);
						Popover.changeAffHourModif();
					}
	  			}
	  		}

	  		$scope.modifChoiceOpenning = function () {
	  			$timeout(hide, 1);
	  			$scope.choix = null;
	  			$scope.removeAllDayPause();
	  			$scope.affChoiceOpenning = true;
	  			$scope.affCalendar = false;
	  		}

	  		/*///////////////////////////////////////////////////////////////////////////////////////*/

			/*****************************************************************************************\
			*              Affichage de la fenêtre modale avec tous les jours de la semaine           *
			\*****************************************************************************************/

			/* Controleur de la modale */
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

			var fillTimeDays = function (days, objHour) {
				for (var i = days.length - 1; i >= 0; i--) {
		     		if (days[i].chosen && days[i].day != objHour.day) { // Il a choisi ce jour pour reprendre les même horaires
		     			$scope.$parent.hours[i].matin.debut = objHour.matin.debut;
		     			$scope.$parent.hours[i].soir.fin = objHour.soir.fin;
		     			if (objHour.pause.existe) {
		     				$scope.$parent.hours[i].matin.fin = objHour.matin.fin;
		     				$scope.$parent.hours[i].soir.debut = objHour.soir.debut;
		     			}
		     		}
		     	};
			}

			

			/* Lance la fenêtre modale avec les paramètres (event, objet Jour) */
			$scope.showAdvanced = function(ev, objHour) {
			    $mdDialog.show({
			      controller: DialogController, // Je lui passe le contrôleur afin de gérer les actions dans la modale
			      templateUrl: 'app/components/configuration-initial/config-hours/config-mdDialogView.html',
			      parent: angular.element(document.body), // Son parent (très important) - position, enfants, etc...
			      targetEvent: ev,
			      clickOutsideToClose:true,
			      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
			    })
			    .then(function(days) {
			    	fillTimeDays(days, objHour); // Je met à jour les jours respectifs
			    }, function() {
			    	// Ici il annule ça ne fait rien 
				});
		  	}
		  	

			/*///////////////////////////////////////////////////////////////////////////////////////*/

			/*****************************************************************************************\
			*            Gestion des jours avec les horaires d'ouvertures - Matin et - Soir           *
			\*****************************************************************************************/

      		/* Affiche le timePicker pour ouverture du Matin */
			$scope.showTimeMatinDebut = function(ev, index) {
				$timeout(hide, 1);
				var objHour = $scope.hours[index];
			 	$mdpTimePicker(objHour.matin.debut == Const.OPEN ? $scope.matinDebut: objHour.matin.debut, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
			 		if (selectedDate == Const.ANNULER) { // (Cliquer sur Supprimer == Annuller)
						objHour.matin.debut = Const.OPEN;
						objHour.matin.fin = Const.END;
					} else {
				 		selectedDate = moment(DateFactory.getToday()).add(selectedDate.getHours(), 'hours').add(selectedDate.getMinutes(), 'minutes').toDate();
						$scope.$parent.hours[index].matin.debut = selectedDate; // Changement de l'heure à jour
					}	
			 	});
			};

			/* Affiche le timePicker pour fermeture du Matin (Affiché seulement si existe une coupure = pause) */
			$scope.showTimeMatinFin = function(ev, index) {
				var objHour = $scope.hours[index];

				if (objHour.matin.debut == Const.OPEN) {
					console.log(objHour);
					NotifService.error("Heure d'ouverture non configuré", "L'heure d'ouverture doit être indiqué avant !")
					return;
				}// Rediriger sur date début

			 	$mdpTimePicker(objHour.matin.fin == Const.END ? DateFactory.matinFin: objHour.matin.fin, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {

			 		if (selectedDate == Const.ANNULER) {objHour.matin.fin = Const.END; return;} // Si il annule (Clique sur supprimer)

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
			 			NotifService.error("Date invalide", "L'heure de fermeture doit être après la date d'ouverture!")
			 		} else {
			 			// Date est valide
			 			objHour.matin.fin = selectedDate;
			 		}
			 			
			 	});
			};

			/* Affiche le timePicker pour la date de début du soir */
			$scope.showTimeSoirDebut = function(ev, index) {
				var objHour = $scope.hours[index];

			 	$mdpTimePicker(objHour.soir.debut == Const.OPEN ? DateFactory.soirDebut: objHour.soir.debut, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
			 		if (selectedDate == Const.ANNULER) {
						objHour.soir.debut = Const.OPEN;
						objHour.soir.fin = Const.END;
					} else {
						selectedDate = moment(DateFactory.getToday()).add(selectedDate.getHours(), 'hours').add(selectedDate.getMinutes(), 'minutes').toDate();
						selectedDate = new Date(selectedDate);
						
						/****************************************************************************\
							Contrôler si la date est supérieur à matin fin ! Sinon on la rejette 
						\****************************************************************************/
						if (!DateFactory.validateHour(objHour.matin.fin, selectedDate)) {
							/* Date invalide */
							objHour.soir.debut = Const.OPEN;
			 				NotifService.error("Date invalide", "L'heure d'ouverture du soir doit être après la date de fermeture du matin !")
						} else {
							/* Date valide */ 
							objHour.soir.debut = selectedDate; // Changement de l'heure à jour
						}
					}	
			 	});
			};

			/* Affiche le timePicker pour la date de fin du soir */
			$scope.showTimeSoirFin = function(ev, index) {

				var objHour = $scope.hours[index];

				if (objHour.pause.existe && objHour.soir.debut == Const.OPEN) {
					console.log(objHour);
					NotifService.error("Heure d'ouverture non configuré", "L'heure d'ouverture du soir doit être indiqué avant !")
					return;
				}// Rediriger sur date début


				/* Affiche le timePicker */
			 	$mdpTimePicker(objHour.soir.fin == Const.END ? $scope.soirFin: objHour.soir.fin, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
			 		/* Dès que la saisie est faite */
			 		
			 		if (selectedDate == Const.ANNULER) { // Si L'utilisateur supprime l'heure saisi
						objHour.soir.fin = Const.END; // Remet l'heure de fin à son état initial.
					} else { // Si l'utilisateur valide son heure

						/* Vérification que l'heure de pause de fin est valide et peut être rentré */
						var nbHours = DateFactory.calculateNbHours(objHour.soir.debut, selectedDate);

				 		if (nbHours >= 24) { // Si la date dépasse 24 heures
				 			var nbJours = Math.round(nbHours/24); // Virer les jours si il en a plus que ce qu'il doit
				 			selectedDate = moment(selectedDate).subtract(nbJours, 'days').toDate();
				 		} else {
				 			selectedDate = moment(DateFactory.getToday()).add(1, 'days').add(selectedDate.getHours(), 'hours').add(selectedDate.getMinutes(), 'minutes').toDate();
				 		}

				 		console.log(selectedDate);

				 		/****************************************************************************\
							Contrôler si la date est supérieur à matin fin ! Sinon on la rejette 
						\****************************************************************************/

						if (!DateFactory.validateHour(objHour.matin.debut, selectedDate)) {
							/* Date invalide */
							objHour.soir.fin = Const.OPEN;
			 				NotifService.error("Date invalide", "L'heure d'ouverture du soir doit être après la date de fermeture du matin !")
						} else {
							/* Date valide */ 
							objHour.soir.fin = selectedDate; // Changement de l'heure à jour
							/* Lancement écran qui permet à l'utilisateur de choisir les jours de la semaine qui doivent reprendre les même configurations */
							$scope.showAdvanced(ev, objHour);
							$scope.affFirstTime = true;
						}
			 		}
			 	});
	    	};

	    	$scope.validationHours = function () {
	    		if (validateAllHours()) {
	    			$scope.affOtherHours = true;
	    			$scope.affModifOtherHours1 = true;
	    			/*$timeout(hide, 1);
    				$timeout($scope.ctrl.next(4), 2);*/
	    		} else {
	    			// Afficher un message d'erreur
	    		}
	    	}

	    	$scope.addHoursToTab = function () {
	    		$scope.tabCalendars.push({name: $scope.nameCalendar, period: {start: $scope.periodDebut,end:$scope.periodFin},hours: $scope.hours})
	    		$scope.nameCalendar = "";
	    		$scope.periodDebut = "";
	    		$scope.periodFin = "";
	    	}


    } // Fin du link
  } // Fin du return
}); // Fin de la directive

})();