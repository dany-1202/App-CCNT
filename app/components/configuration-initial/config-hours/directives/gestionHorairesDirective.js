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
			    		} else {
			    			NotifService.error('Informations incorrectes', "Veuillez insérer des données valides pour permettre d'enregistrer les informations");
			    		}
				}

				$scope.showAffModifOtherHours = function () {
					$scope.affModifOtherHours = false;
					$scope.affModifOtherHours1 = false;
					$scope.affModifOtherHours2 = true;
					$scope.affCalendar = false;
					var pos = $scope.tabCalendars.length;
		    			$scope.tabCalendars.push({name: Const.NEWHOR, period: {debut: "", fin: ""}, hours: State.getTabCalDefault(), state: Const.INCOMP, errorName: false, errorPeriod: true});
		    			$scope.cal = $scope.tabCalendars[pos];
				}

				$scope.showDivOtherHours = function () {
					if ($scope.isHoursCompleted()) {
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
					}/* else {
						$scope.affModifOtherHours = false;
						$scope.affModifOtherHours1 = false;
						$scope.affModifOtherHours2 = true;
						$scope.affCalendar = false;
					} */
				}
				/*///////////////////////////////////////////////////////////////////////////////////////*/
			}
		}
	})
})();