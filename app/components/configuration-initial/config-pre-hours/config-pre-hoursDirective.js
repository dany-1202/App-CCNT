var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configPreHours', function($timeout, $mdDialog, $rootScope, Popover, State, $q, $log, Postaux) {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-pre-hours/config-pre-hoursView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		link : function(scope,elements,attrs){
			console.log("hello");
			scope.showAddHoraire = function(){
			
			$mdDialog.show({
		      	controller: testcontroller,
		      	templateUrl: 'app/components/configuration-initial/config-pre-hours/modalInfoPreHours.html',
		      	parent: angular.element(document.body),
		      	targetEvent: event,
		      	clickOutsideToClose:true,
		      	fullscreen: true,
		    })
		    .then(function(answer) {
		    	// Faire quelque chose
		    }, function() {
		    });

		    function testcontroller($scope){

		    };
			};console.log(scope);
		}



	}

	
})
