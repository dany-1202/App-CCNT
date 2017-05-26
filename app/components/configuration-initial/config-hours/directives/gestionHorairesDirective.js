(function (){
	var ctrlCCNT = angular.module('ctrlCCNT');

	ctrlCCNT.directive('gestionHoraires', function(NotifService, Const, State) {
		return {
			restrict : 'A', // Ici se limite à la balise si on veut pour un attribut = A
			 // Inclut la vue au template déjà existant
			link: function($scope, element, attrs) {
		      		/*****************************************************************************************\
				*              Gestion de l'affichage de la question avez vous d'autre horaires           *
				\*****************************************************************************************/

				$scope.closeAddOtherHours = function () {
					if ($scope.isCurrentInfoCalCorrect()) {
		    				$scope.affOtherHours = false;
						$scope.affModifOtherHours1 = false;
						$scope.affModifOtherHours2 = false;
		    				$scope.affDefinitif = false;
			    		} else {
			    			NotifService.error('Informations incorrectes', "Veuillez insérer des données valides pour permettre d'enregistrer les informations");
			    		}
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

				$scope.showAffModifOtherHours = function () {
					$scope.affModifOtherHours = false;
					$scope.affModifOtherHours1 = false;
					$scope.affModifOtherHours2 = true;
					$scope.affCalendar = false;
					var pos = $scope.tabCalendars.length;
		    			$scope.tabCalendars.push({name: Const.NEWHOR, period: {debut: "", fin: ""}, hours: State.getTabCalPrec(pos-1), state: Const.INCOMP, errorName: false, errorPeriod: false, choix: angular.copy($scope.tabCalendars[0].choix)});
		    			$scope.cal = $scope.tabCalendars[pos];
		    			$scope.affCalendar = true;
				}

				$scope.showDivOtherHours = function () {
					var erreur = checkDaysFinished();
					if ($scope.isHoursCompleted() && erreur == 0) {
						$scope.cal.state = Const.COMP;
						$scope.affOtherHours = true;
						$scope.addOtherHours();
					} else {
						$scope.cal.state = Const.INCOMP;
						$scope.affOtherHours = false;
					}
				}

				$scope.addOtherHours = function () {
					if ($scope.tabCalendars.length == 1) { // Tester si c'est la semaine de base ou pas
						$scope.affModifOtherHours = true; // Div enregistrer infos de la semaine de base
						$scope.affModifOtherHours1 = false; // Div question autre horaires
						$scope.affModifOtherHours2 = false; // Div enregistrer autre horaire
					}
				}
				/*///////////////////////////////////////////////////////////////////////////////////////*/
			}
		}
	})
})();