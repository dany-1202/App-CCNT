var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configHours', function($mdpTimePicker, NotifService, $mdDialog, $timeout, Popover, DateFactory) {
	
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
	  		$scope.nbHours = 0; // Nombres d'heures Soumis CCNT
	  		
	  		$scope.modifCCNT = false; // Doit afficher la modification des heures soumis CCNT
	  		$scope.modifHours = false; // Doit afficher les valeurs à modifier pour les heures soumis CCNT

			$scope.affChoiceOpenning = true; // Afficher la question du type d'ouverture
	  		$scope.affCalendar = false; // Afficher le calendrier
			$scope.choix = null; // Choix pour le type d'ouverture : 0 : En Continue ou 1 : Avec Coupure
			$scope.freq = null; // Choix sur la fréquence des coupures
			$scope.selectedD = []; // Contient les jours ou des coupures ont lieu


		

	  		/****************************************
	  		/* Gestion de l'affichage des popovers */

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

			if (Popover.firstTimeHours) { // Savoir grâce au factory si c'est la première fois qu'il affiche le poppover
				$timeout(show, 1); // Lancer les popovers
				$timeout(hide, 30000); // Cacher les popovers 
				Popover.changeFirstTimeHours(); // Change à false pour que la prochaine fois il ne rentre plus dans le test, car il l'aura afficher
			}

			/* Cacher les popovers */
			$scope.hidePopovers = function () { 
				$timeout(hide, 1);
			}
			/*////////////////////////////////////////////////*/
			
			/***********************************************************************************/
			/* Gestion des checkbox pour les jours à selectionner Avec Coupures (Pas utiliser) */

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

	      	/*////////////////////////////////////////////////*/

	      	/*************************************************************/
	      	/* Gestion de l'affichage de la question du type d'ouverture */

	      	/* Affiche le calendrier et cache la question */
	  		$scope.afficherCalendar = function () {
	  			$scope.affChoiceOpenning = false;
	  			$scope.affCalendar = true;
	  		}

	  		/* Affiche la modification des heures CCNT */
	  		$scope.affModif = function () {
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
			/*////////////////////////////////////////////////*/

	  		/************************/
	  		/* Gestion des coupures */

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
	  		/*////////////////////////////////////////////////*/

	  		/*****************************/
	  		/* Gestion des notifications */

	  		$scope.msgNotif = function (id, text, className) {
				$(id).notify(
					  text , { className: className, position:"bottom center"}
				).focus();
			}

			/*////////////////////////////////////////////////*/

			/**************************************************************/
			/* Gestion de l'affichage du type d'ouverture : En continue ou avec coupures */

	  		$scope.choiceOpenning = function (idChoix) {
	  			$timeout(hide, 1);
	  			$scope.choix = idChoix == 0 ? {id: idChoix, nom:"En Continue", color: "#27ae60"} : {id: idChoix, nom:"Avec Coupures", color: "#428bca"};
	  			if (idChoix != 1) {
	  				$scope.afficherCalendar();
	  			}
	  		}

	  		$scope.choiceFrequencyCoup = function (idFreq) {
	  			$scope.choix.freq = idFreq == 0 ? {id: idFreq, nom:"Tous les jours"} : {id: idFreq, nom:"Certains jours"};
	  			if (idFreq != 1) {
	  				$scope.putAllDayPause();
		  			$scope.afficherCalendar();
	  			}
  				$timeout(hide, 1);
	  		}

	  		$scope.modifChoiceOpenning = function () {
	  			$scope.choix = null;
	  			$scope.removeAllDayPause();
	  			$scope.affChoiceOpenning = true;
	  			$scope.affCalendar = false;
	  		}

	  		/*////////////////////////////////////////////////*/

	  		/********************************************************************/
			/* Affichage de la fenêtre modale avec tous les jours de la semaine */

			/* Controller de la modale */
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
			     	for (var i = days.length - 1; i >= 0; i--) {
			     		if (days[i].chosen && days[i].day != objHour.day) { // Il a choisi ce jour pour reprendre les même horaires
			     			$scope.$parent.hours[i].matin.debut = objHour.matin.debut;
			     			$scope.$parent.hours[i].matin.fin = objHour.matin.fin;
			     			if (objHour.pause.existe) {
			     				$scope.$parent.hours[i].pause.existe = objHour.pause.existe; $scope.$parent.hours[i].pause.debut = objHour.pause.debut;
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
		  	}
		  	/*////////////////////////////////////////////////*/

		  	/*********************************************/
		  	/*          Validation des heures            */

			$scope.validateHourFin = function (objHour, hourFin) {
				/* La date du début est après que la date du début de la pause - FALSE*/
				if (moment(objHour.matin.debut).isAfter(moment(hourFin))) {return false;}
				return true;
			}

			$scope.validatePauseDebut = function (objHour, hourPauseDebut) {
				/* La date du début est après que la date du début de la pause - FALSE*/
				if (moment(objHour.matin.debut).isAfter(moment(hourPauseDebut))) {return false;}
				/* La date de fin est avant que la date de fin de la pause - FALSE*/
				if (moment(hourPauseDebut).isAfter(moment(objHour.matin.fin))) {return false;}
				return true;
			}

			$scope.validatePauseFin = function (objHour, hourPauseFin) {
				/* Si l'heure de pause de début vient après l'heure de fin de pause ça ne joue pas */
				if (moment(objHour.pause.debut).isAfter(moment(hourPauseFin))) {return false;}
				/* Si l'heure de pause de fin vient après l'heure de fermeture ça ne joue pas */
				if (moment(hourPauseFin).isAfter(moment(objHour.matin.fin))) {return false;}
				return true;
			}

			/*////////////////////////////////////////////////*/

      		/* Affiche le timePicker pour ouverture du Matin */
			$scope.showTimeMatinDebut = function(ev, index) {
				var objHour = $scope.hours[index];
			 
			 	$mdpTimePicker(objHour.matin.debut == "Ouverture" ? $scope.matinDebut: objHour.matin.debut, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {

			 		if (selectedDate == 'Annuler') {
						objHour.matin.debut = "Ouverture";
						objHour.matin.fin = "Fermeture";
						objHour.soir.debut = "Ouverture";
						objHour.soir.fin = "Fermeture";
						$scope.nbHours = $scope.calculateTotalNbHours();
					} else {
						if (objHour.matin.fin != "Fermeture") {
							if (moment(selectedDate).isAfter(moment(objHour.matin.fin))) {
								$scope.msgNotif("#"+objHour.id+"debut", "L'heure n'est pas valide avec l'heure de fermeture", 'error');
								return
							}
						}
						$scope.$parent.hours[index].matin.debut = selectedDate; // Changement de l'heure à jour
					}	
			 	});
			};


			/* Affiche le timePicker pour fermeture du Matin (Affiché seulement si existe une coupure = pause) */
			$scope.showTimeMatinFin = function(ev, index) {
				var objHour = $scope.hours[index];

				if (objHour.matin.debut == "Ouverture") {
					$scope.msgNotif("#"+objHour.id+"debut", "Configurer l'heure d'ouverture ! ", 'error');
					return;
				}// Rediriger sur date début

			 	$mdpTimePicker(objHour.matin.fin == "Fermeture" ? $scope.hourFin: objHour.matin.fin, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
			 		console.log(selectedDate);

			 		var nbHours = DateFactory.calculateNbHours(objHour.matin.debut, selectedDate);

			 		if (nbHours > 24) { // Si la date dépasse 24 heures
			 			// Ajouter seulement un jour au matin de début pour la selectedDate
			 		} else {
			 			if ($scope.validateHourFin(objHour, selectedDate) == false) {
				 			console.log(objHour);
				 			console.log(selectedDate);
				 			// Ajouter tranquillement un jour à la selectedDate
			 			}
			 		}
			 		

			 		if (selectedDate == 'Annuler') {
						$scope.$parent.hours[index].matin.fin = "Fermeture";
						$scope.nbHours = $scope.calculateTotalNbHours();
					} else {
						
						$scope.$parent.hours[index].matin.fin = selectedDate;
			 		}
			 	});
			};

				
			/* Affiche le timePicker pour la pause début  */
			$scope.showTimeSoirDebut = function(ev, index) {
				var objHour = $scope.hours[index];
			 
			 	$mdpTimePicker(objHour.soir.debut == "Ouverture" ? $scope.hourDebut: objHour.soir.debut, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {
			 		console.log(selectedDate);
			 		if (selectedDate == 'Annuler') {
						objHour.matin.debut = "Ouverture";
						objHour.matin.fin = "Fermeture";
						objHour.soir.debut = "Ouverture";
						objHour.soir.fin = "Fermeture";
						$scope.nbHours = $scope.calculateTotalNbHours();
					} else {
						if (objHour.matin.fin != "Fermeture") {
							if (moment(selectedDate).isAfter(moment(objHour.matin.fin))) {
								$scope.msgNotif("#"+objHour.id+"debut", "L'heure n'est pas valide avec l'heure de fermeture", 'error');
								return
							}
						}
						$scope.$parent.hours[index].matin.debut = selectedDate; // Changement de l'heure à jour
					}	
			 	});
			};

			/* Affiche le timePicker pour la pause fin  */
			$scope.showTimeSoirFin = function(ev, index) {

				var objHour = $scope.hours[index];
				/* 
					Pré validation
					- Check si le nombre d'heures est correct (Supérieur à 0) est non vide 
					- Check si l'heure de début de pause a été saisi sinon il redirige sur le bouton de début et prend le focus
				*/

				/* Affiche le timePicker */
			 	$mdpTimePicker(objHour.soir.fin == "Fermeture" ? $scope.soirFin: objHour.soir.fin, {
			 		targetEvent: ev
			 	}).then(function(selectedDate) {

			 		/* Dès que la saisie est faite */
			 		if (selectedDate == 'Annuler') { // Si L'utilisateur supprime l'heure saisi
			 			objHour.pause.existe = false;
						$scope.$parent.hours[index].soir.fin = "Fermeture"; // Remet l'heure de fin à son état initial.
						$scope.nbHours = $scope.calculateTotalNbHours();
					} else { // Si l'utilisateur valide son heure

						/* Vérification que l'heure de pause de fin est valide et peut être rentré */
						if (!$scope.validatePauseFin(objHour, selectedDate)) {
							// Si l'heure de début est supérieur à l'heure de fin
							$scope.msgNotif("#"+objHour.id+"pauseDebut", "L'heure de début doit être inférieur à l'heure de fin ! ", 'error');
							$scope.msgNotif("#"+objHour.id+"pauseFin", "L'heure de début doit être inférieur à l'heure de fin ! ", 'error');
							$scope.$parent.hours[index].soir.fin = "Fermeture";
							return;
						}
						objHour.pause.existe = true;
						objHour.soir.fin = selectedDate;
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
	    		$timeout(hide, 1);
	    		// Valider le nombre total d'heure
	    		/*
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
	    			}*/
	    			$timeout($scope.ctrl.next(4), 2)
	    	/*	}	else {
	    			$scope.msgNotif("#1debut", "Veuillez configurer votre semaine !", 'error');
	    		}*/
	    	}

    } // Fin du link
  } // Fin du return
}); // Fin de la directive