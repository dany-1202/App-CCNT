(function (){
	var ctrlCCNT = angular.module('ctrlCCNT');

	ctrlCCNT.directive('typeQ1', function($mdpTimePicker, NotifService, $mdDialog, $timeout, Popover, DateFactory, Const, State, $route) {
		return {
			restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
			templateUrl: 'app/components/configuration-initial/config-hours/views/typeQ1View.html',
			transclude: true
		}
	});

	ctrlCCNT.directive('typeQ2', function($mdpTimePicker, NotifService, $mdDialog, $timeout, Popover, DateFactory, Const, State, $route) {
		return {
			restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
			templateUrl: 'app/components/configuration-initial/config-hours/views/typeQ2View.html',
			transclude: true
		}
	});
	
	ctrlCCNT.directive('typeQ3', function($mdpTimePicker, NotifService, $mdDialog, $timeout, Popover, DateFactory, Const, State, $route) {
		return {
			restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
			templateUrl: 'app/components/configuration-initial/config-hours/views/typeQ3View.html',
			transclude: true
		}
	});
})();