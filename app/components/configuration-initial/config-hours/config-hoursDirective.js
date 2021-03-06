(function(){ 
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configHours', function(NotifService, $mdDialog, $timeout, Popover, DateFactory, Const, State, $route, ModalTuto) {
	
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
	  		//$scope.choix = State.choix; // Choix pour le type d'ouverture : 0 : En Continue ou 1 : Avec Coupure
			//$scope.freq = State.freq; // Choix sur la fréquence des coupures
			$scope.selectedD = State.selectedD; // Contient les jours ou des coupures ont lieu
			$scope.affOtherHours = false;
			$scope.affDefinitif = State.affDefinitif;
			$scope.affModifOtherHours1 = false;
			$scope.affModifOtherHours2 = false;
			$scope.fabModifType = false;
			$scope.showAdvancedRepHours = State.advancedRepHours;
			$scope.msgActivated = "Désactiver";
			$scope.cal = $scope.state ? $scope.$parent.cal : $scope.$parent.tabCalendars[0]; // Par défaut je prend les valeurs du premier
			
			$scope.affInfos = false;
	  		/*///////////////////////////////////////////////////////////////////////////////////////*/

		  	/*****************************************************************************************\
			*                                 Validation des heures                                   *
			\*****************************************************************************************/

			var testWithCoupures = function (objDay) {
				return (objDay.matin.debut == Const.OPEN || objDay.matin.fin == Const.END || objDay.soir.debut == Const.OPEN || objDay.soir.fin == Const.END);
			}
			
			$scope.testWithCoupuresFin = function (objDay) {
				return (objDay.matin.debut != Const.OPEN && (objDay.matin.fin == Const.END || objDay.soir.debut == Const.OPEN || objDay.soir.fin == Const.END));
			}

			var testWithoutCoupures = function (objDay) {
				return (objDay.matin.debut == Const.OPEN && objDay.soir.fin == Const.END);
			}
			
			$scope.testWithoutCoupuresFin = function (objDay) {
				return (objDay.matin.debut != Const.OPEN && objDay.soir.fin == Const.END);
			}

			var isOneDayConfigurated = function() {
				var cal = $scope.cal.hours;
				var nb = 0;
				for (var i = 0; i < cal.length; i++) {
					if (cal[i].matin.debut != Const.OPEN || cal[i].soir.fin != Const.END) {
						nb++;
					}
				}
				return nb != 0;
			}

			$scope.activateAdvancedRepHours = function() {
				State.changeAdvancedRepHours($scope.showAdvancedRepHours);
				$scope.msgActivated = $scope.showAdvancedRepHours ? "Désactiver" : "Activer";
			}

			$scope.isHoursCompleted = function () { // Toutes les heures ont été configurées
				for (var i = 0; i < $scope.cal.hours.length; i++) {
					var obj = $scope.cal.hours[i];
					if (obj.pause.existe) {
						// Tester que les 4 dates sont saisies
						if ($scope.testWithCoupuresFin(obj)) { $scope.cal.state = Const.INCOMP; return false;}
					} else {
						// Tester seulement matin début et soir fin
						if ($scope.testWithoutCoupuresFin(obj)) {$scope.cal.state = Const.INCOMP;return false;}
					}
				}
				var res = isOneDayConfigurated();
				$scope.cal.state = (res ? Const.COMP: Const.INCOMP);
				return res;
			}
			
			$scope.allDaysCompleted = function () { // Toutes les heures ont été configurées
				for (var i = 0; i < $scope.cal.hours.length; i++) {
					var obj = $scope.cal.hours[i];
					if (obj.pause.existe) {
						// Tester que les 4 dates sont saisies
						if (testWithCoupures(obj)) {$scope.cal.state = Const.INCOMP; return false;}
					} else {
						// Tester seulement matin début et soir fin
						if (testWithoutCoupures(obj)) {$scope.cal.state = Const.INCOMP; return false;}
					}
				}
				$scope.cal.state = Const.COMP;
				return true;
			}

	  		var res = $scope.isHoursCompleted();
  			$scope.affChoiceOpenning = ($scope.$parent.tabCalendars[0].state !== Const.INCOMP ? false : true); // Afficher la question du type d'ouverture
  			$scope.affCalendar = (res && $scope.$parent.tabCalendars[0].state !== Const.INCOMP? true : false); // Afficher le calendrier
	  		
			/*****************************************************************************************\
			*                           Gestion de l'affichage des popovers                           *
			\*****************************************************************************************/
			
			$scope.hidePopovers = function () {
				$timeout(function () {
					$("div.popover").popover('hide');
				}, 0);
			}
			
			$scope.showHourModif = function () {
				if (!$scope.state) {
					Popover.showPop(4 , ['#hourModif', '#choiceCCNT', ($scope.cal.choix.id == 0 ? '#1debut' : '#1debutMatin')]);
				}
			}
			if (!$scope.state) {
				Popover.showPop(2, ['#choiceOpenning']);
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
	  			$timeout(Popover.hide, 0);
	  			$scope.cal.choix = State.changeChoix(idChoix);
	  			
	  			if (idChoix != 1) {
	  				$scope.afficherCalendar();
	  				if (Popover.affHourModif && !$scope.state) {
						$timeout($scope.showHourModif, 400);
						Popover.changeAffHourModif();
					}
	  			}
	  		}

	  		$scope.choiceFrequencyCoup = function (idFreq) {
	  			$scope.cal.choix.freq = State.changeFreq(idFreq);
	  			$timeout(Popover.hide, 0);
	  			if (idFreq != 1) {
	  				$scope.putAllDayPause();
		  			$scope.afficherCalendar();
		  			if (Popover.affHourModif && !$scope.state) {
						$timeout($scope.showHourModif, 400);
						Popover.changeAffHourModif();
					}
	  			}
	  		}
	  		var hourScope = $scope;
	  		$scope.modifChoiceOpenning = function (event) {
	  			$timeout(Popover.hide, 0);
	  			$scope.affInfos = !$scope.affInfos;
	  			$mdDialog.show({
		  			controller: ModalTypeController,
		  			templateUrl: 'app/components/configuration-initial/config-hours/modal/modalType.html',
		  			parent: angular.element(document.body),
		  			targetEvent: event,
		  			clickOutsideToClose:true,
		  			fullscreen: true,
		  			multiple:true
		  		})
		  		.then(function(answer) {
		  			
		  		}, function() {/* Annulation */});
	  		}

	  		function ModalTypeController($scope) {
	  			$scope.first = angular.copy(hourScope.cal);
	  			$scope.cal = hourScope.cal;
	  			$scope.choiceOpenning = hourScope.choiceOpenning;
	  			$scope.choiceFrequencyCoup = hourScope.choiceFrequencyCoup;
	  			$scope.hide = function() {$mdDialog.hide();}
	  			$scope.cancel = function(answer) {hourScope.cal = angular.copy($scope.first); $mdDialog.cancel();}
	  			$scope.answer = function(answer){
	  				if ($scope.cal.choix.id == 0) {
	  					var tab = $scope.cal.hours;
	  					for (var i = 0; i < tab.length; i++) {
	  						tab[i].pause.existe = false;
	  					}
	  				}
	  				$mdDialog.hide();
	  			}
	  		}

	  		/*///////////////////////////////////////////////////////////////////////////////////////*/

			/*****************************************************************************************\
			*              Affichage de la fenêtre modale avec tous les jours de la semaine           *
			\*****************************************************************************************/
			
			/* Controleur de la modale */
			function chooseDaysController($scope, $mdDialog) {
			  	$scope.days = [
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
			    	
			    	$scope.isChecked = function() {
				    	return allDaysChosen();
			  	};
				  	
		  	  	$scope.isIndeterminate = function() {
				    	return (countDaysChosen() > 0 && countDaysChosen() < $scope.days.length);
				};
		    	
			    	var allDaysChosen = function () {
			    		for (var i = 0; i < $scope.days.length; i++) {
			    			if (!$scope.days[i].chosen) {
			    				return false;
			    			}
			    		}
			    		return true;
			    	}
			    	
			    	var countDaysChosen = function () {
			    		var count = 0;
			    		for (var i = 0; i < $scope.days.length; i++) {
			    			if (!$scope.days[i].chosen) {
			    				count += 1;
			    			}
			    		}
			    		return count;
			    	}
			    	
			    	var changeAllDays = function (val) {
			    		for (var i = 0; i < $scope.days.length; i++) {
			    			$scope.days[i].chosen = val;
			    		}
			    	}
		    	
			    	$scope.toggleAll = function () {
			    		if (allDaysChosen()) {
					      	changeAllDays(false);
				    	} else {
					    	changeAllDays(true);
				    	}
			    	}
		    	
			};

			var fillTimeDays = function (days, objHour) {
				console.log(objHour);
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
				      controller: chooseDaysController, // Je lui passe le contrôleur afin de gérer les actions dans la modale
				      templateUrl: 'app/components/configuration-initial/config-hours/views/chooseDaysView.html',
				      parent: angular.element(document.body), // Son parent (très important) - position, enfants, etc...
				      targetEvent: ev,
				      clickOutsideToClose:true,
				      fullscreen: $scope.customFullscreen,
				      multiple:true // Only for -xs, -sm breakpoints.
			    	})
			    	.then(function(days) {
					fillTimeDays(days, objHour); // Je met à jour les jours respectifs
			    		$scope.showDivOtherHours();
			   	}, function() {
			    	// Ici il annule ça ne fait rien 
				});
		  	}
		  	/*****************************************************************************************\
		  			* Gestion de la modal modification des horaires *                        
		  	\*****************************************************************************************/
		  	
		  	/* Controleur de la modale */
			function modifCalController($scope, $mdDialog, State, NotifService) {
				$scope.cal = angular.copy(self.cal);
				$scope.$parent.tabCalendars = angular.copy(self.tabCalendars);
				console.log($scope.$parent.tabCalendars);
				$scope.affHoraire = State.affHoraire;
				$scope.base = angular.copy(self.base);

				console.log($scope.base);
			    	$scope.hide = function() {
			      		$mdDialog.hide();
			    	};

			    	$scope.cancel = function() {
			      		$mdDialog.cancel();
			    	};

			    	$scope.answer = function() {
			    		if ($scope.cal.errorName || $scope.cal.errorPeriod) {
			    			NotifService.error('Informations incorrectes', "Veuillez insérer des données valides pour permettre d'enregistrer les informations");
			    		} else {
			    			$mdDialog.hide($scope.cal);
			    		}
			    	}
			};

			$scope.supCalDefault = function(item, index) {
				$scope.affOtherHours = false;
				$scope.$parent.tabCalendars[0].hours = State.getTabCalDefault();
				$scope.$parent.tabCalendars[0].state = Const.INCOMP;
				//$scope.cal.hours = State.getTabCalDefault();
			}
			
			$scope.addCalToTabCalendars = function() {
		    		var pos = $scope.$parent.tabCalendars.length;
		    		$scope.$parent.tabCalendars.push({id : -pos, name: Const.NEWHOR + pos, period: {debut: "", fin: ""}, hours: State.getTabCalDefault(), state: Const.INCOMP, errorName: false, errorPeriod: true, choix: State.changeChoix(0), 'etat' : 'new'});
		 		$scope.cal = $scope.$parent.tabCalendars[pos];
		    	}


		  	$scope.modifCal = function (ev, index) {
		  		console.log(ev);
		  		self.cal = $scope.$parent.tabCalendars[index];
		  		self.tabCalendars = $scope.$parent.tabCalendars;
		  		self.base = $scope.state ? self.cal.base : index;
		  		//State.changeCal($scope.cal, index);
		  		$mdDialog.show({
				      	controller: modifCalController, // Je lui passe le contrôleur afin de gérer les actions dans la modale
				      	templateUrl: 'app/components/configuration-initial/config-hours/views/modifCalViewFinal.html',
				      	parent: angular.element(document.body), // Son parent (très important) - position, enfants, etc...
				      	targetEvent: ev,
				      	clickOutsideToClose:true,
				      	fullscreen: true // Only for -xs, -sm breakpoints.
			   	})
			    	.then(function(cal) {
			    		console.log('ici');
			    		$timeout(function () {
						$scope.$parent.tabCalendars[index] = angular.copy(cal);
						$scope.cal = $scope.$parent.tabCalendars[index];
						//State.changeCal($scope.cal, index);
	    				}, 0);
		   		}, function() {
			    	// Ici il annule ça ne fait rien 
				});
		  	}
		  	/*///////////////////////////////////////////////////////////////////////////////////////*/
		  	
			/*****************************************************************************************\
			*                                  Validations des horaires                               *
			\*****************************************************************************************/

			$scope.isAllInfoCalCorrect = function () {
				var nb = 0;
				for (var i = 0; i < $scope.$parent.tabCalendars.length; i++) {
					if ($scope.$parent.tabCalendars[i].state==Const.INCOMP || $scope.$parent.tabCalendars[i].errorName || $scope.$parent.tabCalendars[i].errorPeriod ) {nb++;}
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
	    	
		    	$scope.dayConfigured = function () {}

		    	$scope.isCurrentInfoCalCorrect = function () {
		    		if ($scope.cal.errorName == true || $scope.$parent.tabCalendars.length > 1 && $scope.cal.errorPeriod == true) {
	    				return false
		    		}
		    		return true; // Vérification à faire des infos champs nom pas vide et période pas vide et celle fin doit être plus grande que celle de début
		    	}

	    		/*///////////////////////////////////////////////////////////////////////////////////////*/


		    	$scope.addHour = function () {
		    		if ($scope.isCurrentInfoCalCorrect()) {
		    			var pos = $scope.$parent.tabCalendars.length;
		    			console.log($scope.$parent.tabCalendars[0].choix);
		    			$scope.$parent.tabCalendars.push({id : pos, name: Const.NEWHOR, period: {debut: "", fin: ""}, hours: State.getTabCalPrec(pos-1), state: Const.INCOMP, errorName: (pos > 1 ? true : false), errorPeriod: true, choix: angular.copy($scope.$parent.tabCalendars[pos-1].choix)});
		    			$scope.cal = $scope.$parent.tabCalendars[pos];
		    			$scope.affCalendar = true;
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
		    			State.changeAffDefinitif();

		    		} else {
		    			NotifService.error('Informations incorrectes', "Veuillez insérer des données valides pour permettre d'enregistrer les informations");
		    		}
		    		
		    	}
		    	
		    	$scope.supCal = function (item, index) {
	    			UIkit.modal.confirm("Voulez-vous vraiment supprimer l'horaire nomée : <strong>"+ $scope.$parent.tabCalendars[index].name + "</strong> ?", {center: true}).then(function() {
				    	$timeout(function () {
				    		$scope.$parent.tabCalendars.splice(index, 1);
		    				$scope.cal = $scope.$parent.tabCalendars[index-1];
		    				NotifService.success('Suppression Horaires', "L'horaire a été supprimé avec succès !");
			    		}, 0);
				});
		    	}
	
		    	$scope.changeCal = function (item, index) {
		    		$scope.cal = $scope.$parent.tabCalendars[index];
		    		$scope.affCalendar = true;
		    	}

		    	var checkDaysFinished = function() {
		    		var erreur = 0;
		    		for (var i = $scope.$parent.tabCalendars.length - 1; i >= 0; i--) {
		    			var cal = $scope.$parent.tabCalendars[i].hours;
		    			for (var a = cal.length - 1; a >= 0; a--) {
		    				if (cal[a].pause.existe && cal[a].matin.debut != Const.OPEN) {
		    					erreur += (cal[a].matin.fin != Const.END && cal[a].soir.debut != Const.OPEN) ? 0 : 1;
						}	
		    			}
		    		}
		    		return erreur;
		    	}

		    	$scope.goNextStep = function (ev) {
		    		$timeout(Popover.hide, 0);
		    		var nb = $scope.isAllInfoCalCorrect();
		    		if (nb == 0) {
		    			var erreur = checkDaysFinished();
		    			if (erreur == 0) {
		    				ModalTuto.showModal(ev, 9);
		    				$timeout($scope.ctrl.next(5), 2);
			    		} else {
			    			NotifService.error('Configuration non Terminée', "Il vous reste encore " + erreur + " horaire" + (erreur > 1 ? "s" : "") + " dans l'état :<span class='w3-tag incompleted w3-round'>Incomplet</span>. Veuillez les compléter pour continuer !");
			    		}
		    		} else {
		    			if ($scope.affDefinitif && !$scope.state) {
			    			NotifService.error('Configuration non Terminée', "Vous devez valider l'horaire de base pour pouvoir continuer !");
			    			return;
			    		}
		    			NotifService.error('Configuration non Terminée', "Il vous reste encore " + nb + " horaire" + (nb > 1 ? "s" : "") + " dans l'état :<span class='w3-tag incompleted w3-round'>Incomplet</span>. Veuillez les compléter pour continuer !");
		    		}
		    	}
	   	 	
    		} // Fin du link
 	} // Fin du return
}); // Fin de la directive

})();