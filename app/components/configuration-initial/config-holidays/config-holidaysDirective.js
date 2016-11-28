var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configHolidays', function() {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-holidays/config-holidaysView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		link: function(scope, element, attrs) {
				/* à rajouter ici (Fonctionne comme un contrôleur */

    },
	};
});