var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configPreHours', function($mdDialog, $timeout) {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-prehours/config-preHoursView.html', // Template à utiliser lorsque la balise est utilisé

		link: function(scope, element, attrs) {
			/* Controleur se gère ici */
			
			

			scope.test = function () {
				$mdDialog.show({
			      controller: DialogController,
			      templateUrl: 'app/components/configuration-initial/config-prehours/config-preModalInfoView.html',
			      parent: angular.element(document.body),
			      targetEvent: event,
			      clickOutsideToClose:true,
			      fullscreen: false,
			    })
			    .then(function(answer) {
			    }, function() {/* Annulation */});
			    
			    
			    function DialogController ($scope) {

					$scope.user = 0;
					$scope.nbPause = [];
					$scope.users =  [
					    { id: 1, name: 'Scooby Doo' },
					    { id: 2, name: 'Shaggy Rodgers' },
					    { id: 3, name: 'Fred Jones' },
					    { id: 4, name: 'Daphne Blake' },
					    { id: 5, name: 'Velma Dinkley' }
				    ];

					for (var nb = 0; nb <= 60; nb+=5) {
						$scope.nbPause.push({name: nb + ' minutes', value:nb});
					}

					$scope.nbPause2 = angular.copy($scope.nbPause);

					$scope.pauseService1 = $scope.nbPause[0];
					$scope.pauseService2 = $scope.nbPause2[0];
					console.log($scope.pauseService2);

			    	$scope.hide = function () {
			    		$mdDialog.hide('fini');
			    	}
				    $scope.test = function () {
				    	console.log($scope.pauseService2);console.log($scope.pauseService1);
				    }
			    }
			}

		}
	};
});
