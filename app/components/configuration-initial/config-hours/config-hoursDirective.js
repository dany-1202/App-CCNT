(function(){ 
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configHours', function(NotifService, $mdDialog, $timeout, Popover, DateFactory, Const, State, $route) {
	
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
			$scope.affModifOtherHours2 = false

			$scope.tabCalendars = $scope.$parent.tabCalendars;
			$scope.cal = $scope.tabCalendars[0]; // Par défaut je prend les valeurs du premier
			
	  		/*///////////////////////////////////////////////////////////////////////////////////////*/

		  	/*****************************************************************************************\
			*                                 Validation des heures                                   *
			\*****************************************************************************************/

			var testWithCoupures = function (objDay) {
				return (objDay.matin.debut == Const.OPEN || objDay.matin.fin == Const.END || objDay.soir.debut == Const.OPEN || objDay.soir.fin == Const.END);
			}

			var testWithoutCoupures = function (objDay) {
				return (objDay.matin.debut == Const.OPEN || objDay.soir.fin == Const.END);
			}

			$scope. isHoursCompleted = function () { // Toutes les heures ont été configurées
				for (var i = 0; i < $scope.cal.hours.length; i++) {
					var obj = $scope.cal.hours[i];
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

	  		var res = $scope.isHoursCompleted();
  			$scope.affChoiceOpenning = (res ? false : true); // Afficher la question du type d'ouverture
  			$scope.affCalendar = (res ? true : false); // Afficher le calendrier
	  		
			/*****************************************************************************************\
			*                           Gestion de l'affichage des popovers                           *
			\*****************************************************************************************/

	  		$scope.hide = function () {
				$("div.popover").popover('hide');
			}

			$scope.show = function () {
				$('#choiceOpenning').popover('show');
				$("div.popover").click(function(e) {
		   			e.preventDefault();
					$(e.currentTarget).popover('hide');
				});
			}

			$scope.showHourModif = function () {
				$('#hourModif').popover('show');
				$('#choiceCCNT').popover('show');
				
				if ($scope.choix.id == 0) {$('#1debut').popover('show');} else {$('#1debutMatin').popover('show');}
				
				$("div.popover").click(function(e) {
		   			e.preventDefault();
					$(e.currentTarget).popover('hide');
				});
			}


			if (Popover.firstTimeHours) { // Savoir grâce au factory si c'est la première fois qu'il affiche le poppover
				$timeout($scope.show, 200); // Lancer les popovers
				$timeout($scope.hide, 30000); // Cacher les popovers 
				Popover.changeFirstTimeHours(); // Change à false pour que la prochaine fois il ne rentre plus dans le test, car il l'aura afficher
			}

			/* Cacher les popovers */
			$scope.hidePopovers = function () { 
				$timeout($scope.hide, 1);
			}
			/*///////////////////////////////////////////////////////////////////////////////////////*/
			
			/*****************************************************************************************\
			*     Gestion des checkbox pour les jours à selectionner Avec Coupures (Pas utiliser)     *
			\*****************************************************************************************/

			$scope.toggle = function (item, list) {
			        	var idx = list.indexOf(item);
			        	var pos = $scope.cal.hours.indexOf(item);
			        	if (idx > -1) {
				          	list.splice(idx, 1);
				          	$scope.cal.hours[pos].pause.existe = false;
		        		} else {
				          	list.push(item);
				          	$scope.cal.hours[pos].pause.existe = true;
		       		}
		    	};

			$scope.exists = function (item, list) {
			        	return $scope.cal.hours[$scope.cal.hours.indexOf(item)].pause.existe || list.indexOf(item) > -1;
		      	};

	  		/*****************************************************************************************\
			*                                 Gestion des coupures                                    *
			\*****************************************************************************************/

	  		$scope.putAllDayPause = function () {
	  			for (var i = 0; i < $scope.cal.hours.length; i++) {
	  				$scope.cal.hours[i].pause.existe = true;
	  			}
	  		}

	  		$scope.removeAllDayPause = function () {
	  			for (var i = 0; i < $scope.cal.hours.length; i++) {
	  				$scope.cal.hours[i].pause.existe = false;
	  			}
	  		}
	  		
	  		/*///////////////////////////////////////////////////////////////////////////////////////*/

			/*****************************************************************************************\
			*       Gestion de l'affichage du type d'ouverture : En continue ou avec coupures 		  *         
			\*****************************************************************************************/

	  		$scope.choiceOpenning = function (idChoix) {
	  			$timeout($scope.hide, 1);
	  			$scope.choix = State.changeChoix(idChoix);
	  			if (idChoix != 1) {
	  				$scope.afficherCalendar();
	  				if (Popover.affHourModif) {
						$timeout($scope.showHourModif, 400);
						Popover.changeAffHourModif();
					}
	  			}
	  		}

	  		$scope.choiceFrequencyCoup = function (idFreq) {
	  			$scope.choix.freq = State.changeFreq(idFreq);
	  			$timeout($scope.hide, 1);
	  			if (idFreq != 1) {
	  				$scope.putAllDayPause();
		  			$scope.afficherCalendar();
		  			if (Popover.affHourModif) {
						$timeout($scope.showHourModif, 400);
						Popover.changeAffHourModif();
					}
	  			}
	  		}

	  		$scope.modifChoiceOpenning = function () {
	  			$timeout($scope.hide, 1);
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
			  	$scope.days = [ //{day: 'Tous les jours', chosen : false},
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
			     			$scope.cal.hours[i].matin.debut = moment(objHour.matin.debut).add($scope.cal.hours[i].id - objHour.id, 'days').toDate();
			     			$scope.cal.hours[i].soir.fin = moment(objHour.soir.fin).add($scope.cal.hours[i].id - objHour.id, 'days').toDate();
			     			if (objHour.pause.existe) {
			     				$scope.cal.hours[i].matin.fin = moment(objHour.matin.fin).add($scope.cal.hours[i].id - objHour.id, 'days').toDate();
			     				$scope.cal.hours[i].soir.debut = moment(objHour.soir.debut).add($scope.cal.hours[i].id - objHour.id, 'days').toDate();;
			     			}
			     		}
		     		};
			}

			/* Lance la fenêtre modale avec les paramètres (event, objet Jour) */
			$scope.showAdvanced = function(ev, objHour) {
			    $mdDialog.show({
			      controller: DialogController, // Je lui passe le contrôleur afin de gérer les actions dans la modale
			      templateUrl: 'app/components/configuration-initial/config-hours/views/chooseDaysView.html',
			      parent: angular.element(document.body.parentElement), // Son parent (très important) - position, enfants, etc...
			      targetEvent: ev,
			      clickOutsideToClose:true,
			      fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
			    })
			    .then(function(days) {
				fillTimeDays(days, objHour); // Je met à jour les jours respectifs
			    	$scope.showDivOtherHours();
			    }, function() {
			    	// Ici il annule ça ne fait rien 
				});
		  	}
		  	
			

		/*****************************************************************************************\
		*                                  Validations des horaires                               *
		\*****************************************************************************************/

		$scope.sAllInfoCalCorrect = function () {
			var nb = 0;
			for (var i = 0; i < $scope.tabCalendars.length; i++) {
				if ($scope.tabCalendars[i].state==Const.INCOMP || $scope.tabCalendars[i].errorName || $scope.tabCalendars[i].errorPeriod ) {nb++;}
			}
			return nb;
		}


	    	$scope.validationHours = function () {
	    		if (isHoursCompleted()) { // Ces heures sont toutes configurées
	    			$scope.affOtherHours = true;
	    			$scope.addOtherHours();
	    			/*$timeout(hide, 1);
    				$timeout($scope.ctrl.next(4), 2);*/
	    		} else {
	    			// Afficher un message d'erreur
	    		}
	    	}


	    	$scope.isCurrentInfoCalCorrect = function () {
	    		if ($scope.cal.errorName == true || $scope.tabCalendars.length > 1 && $scope.cal.errorPeriod == true) {
    				return false
	    		}
	    		return true; // Vérification à faire des infos champs nom pas vide et période pas vide et celle fin doit être plus grande que celle de début
	    	}

	    	/*///////////////////////////////////////////////////////////////////////////////////////*/

	    	$scope.addHour = function () {
	    		if ($scope.isCurrentInfoCalCorrect()) {
	    			var pos = $scope.tabCalendars.length;
	    			$scope.tabCalendars.push({id : pos, name: Const.NEWHOR, period: {debut: "", fin: ""}, hours: State.getTabCalDefault(), state: Const.INCOMP, errorName: (pos > 1 ? true : false), errorPeriod: true});
	    			$scope.cal = $scope.tabCalendars[pos];
	    		} else {
	    			NotifService.error('Informations incorrectes', "Veuillez insérer des données valides pour permettre d'enregistrer les informations");
	    		}
	    	}


	    	$scope.addHoursToTab = function () {
	    		if ($scope.isCurrentInfoCalCorrect()) {
	    			$scope.cal.errorPeriod = false;
	    			$scope.cal.state = Const.COMP;
	    			$scope.affModifOtherHours = false;
	    			$scope.affModifOtherHours1 = true;
	    		} else {
	    			NotifService.error('Informations incorrectes', "Veuillez insérer des données valides pour permettre d'enregistrer les informations");
	    		}
	    		
	    	}
	
	    	$scope.changeCal = function (item, index) {
	    		$scope.cal = $scope.tabCalendars[index];
	    		$scope.affCalendar = true;
	    	}

	    	$scope.goNextStep = function () {
	    		$timeout($scope.hide, 1);
	    		var nb = $scope.isAllInfoCalCorrect();
	    		if (nb == 0) {
	    			$timeout($scope.ctrl.next(4), 2);
	    		} else {
	    			NotifService.error('Configuration Non Terminé', "Il vous reste encore " + nb + " calendrier" + (nb > 1 ? "s" : "") + " dans l'état :<span class='w3-tag incompleted w3-round'>Incomplet</span> veuillez les compléter pour continuer !");
	    		}
	    	}

	    	$scope.isNameValid = function () {
	    		$scope.cal.errorName = false;
	    		if ($scope.cal.name == "" || angular.isUndefined($scope.cal.name)) {
	    			$scope.cal.errorName = true;
	    		} else {
	    			var nb = 0;
	    			for (var i = 0; i < $scope.tabCalendars.length; i++) {
	    				if ($scope.tabCalendars[i].name == $scope.cal.name) {
	    					nb++;
	    					if (nb > 1) {
				    			$scope.cal.errorName = true;
				    			NotifService.error('Nom période existant', "Le nom : <span class='uk-label uk-label-default'>" + $scope.cal.name+ "</span> existe déjà !");
				    			return;
	    					}
	    				}
	    			}
	    		}
	    	}
	    	
	    	var findOtherPeriods = function (dateDebut, dateFin) {
	    		for (var i = 1; i < $scope.tabCalendars.length; i++) {
	    			var per = $scope.tabCalendars[i].period;
	    			if ($scope.tabCalendars[i].id != $scope.cal.id)  {
		    			if ((dateDebut >= per.debut && dateDebut <= per.fin) || (dateFin >= per.debut && dateFin <= per.fin)) {
		    				NotifService.error('Période déjà couverte', "La période choisi : <span class='uk-label uk-label-default'>" + moment($scope.cal.period.debut).format('D/MM/YYYY') + "</span> au <span class='uk-label uk-label-default'>" + moment($scope.cal.period.fin).format('D/MM/YYYY') + "</span> est déjà couverte par une autre période!");
		    				return true;
		    			}
	    			}
	    		}
	    		return false;
	    	}

	    	$scope.isPeriodValid = function () {
	    		$scope.cal.errorPeriod = false;
	    		var dateDebut = $scope.cal.period.debut;
	    		var dateFin = $scope.cal.period.fin;
	    		if (dateDebut == "" || dateFin == "" || DateFactory.isPeriodValid(dateDebut, dateFin) || DateFactory.calculateNbDays(dateDebut, dateFin).day < 7) {
				$scope.cal.errorPeriod = true;
	    		} else {
	    			if ($scope.tabCalendars.length > 2) {
	    				$scope.cal.errorPeriod = findOtherPeriods(dateDebut, dateFin);
	    			}
	    		}
	    	}

    } // Fin du link
  } // Fin du return
}); // Fin de la directive

})();