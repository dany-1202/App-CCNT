(function (){
	var ctrlCCNT = angular.module('ctrlCCNT');

	ctrlCCNT.directive('calCoupure', function($mdpTimePicker, NotifService, $mdDialog, $timeout, Popover, DateFactory, Const, State, $route) {
		return {
			restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
			templateUrl: 'app/components/configuration-initial/config-hours/views/calCoupureView.html',
			 // Inclut la vue au template déjà existant
		}
	})
})();