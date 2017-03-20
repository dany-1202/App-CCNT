(function (){
	var ctrlCCNT = angular.module('ctrlCCNT');

	ctrlCCNT.directive('typeOuverture', function($mdpTimePicker, NotifService, $mdDialog, $timeout, Popover, DateFactory, Const, State, $route) {
		return {
			restrict : 'A', // Ici se limite à la balise si on veut pour un attribut = A
			 // Inclut la vue au template déjà existant
			link: function($scope, element, attrs) {
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
		  			$timeout(Popover.hide, 0);
		  			if ($scope.modifHours == false) {
		  				$scope.modifCCNT = !$scope.modifCCNT;	
		  			}
		  		}

		  		/* Affiche la modification des heures (Valeurs) CCNT*/
		  		$scope.affModifHours = function () {
		  			$timeout(Popover.hide, 0);
		  			$scope.modifCCNT = false;
		  			$scope.modifHours = true;
		  		}

		  		/* Enregistre la modification des Heures CCNT*/
		  		$scope.modifHoursCCNT = function (hours) {
		  			$scope.$parent.hoursCCNTChosen = hours;
		  			$scope.modifCCNT = false;
		  			$scope.modifHours = false;
		  			$timeout(Popover.hide, 0);
		  		}

		  		$scope.endCoupures = function () {
					$timeout(function (){
						$scope.afficherCalendar();
			  			if (Popover.affHourModif) {
							$timeout($scope.showHourModif, 400);
							Popover.changeAffHourModif();
						}
						//$('#dropOppening').addClass('none');
					}, 0);
		  		}

				/*///////////////////////////////////////////////////////////////////////////////////////*/
			}
		}
	})
})();