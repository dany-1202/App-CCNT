var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configPreHours', function($mdDialog) {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-prehours/config-preHoursView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
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
			    	$scope.hide = function () {
			    		$mdDialog.hide('fini');
			    	}
			    }
			}
		}
	};
});