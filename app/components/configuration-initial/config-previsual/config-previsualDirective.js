var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configPrevisual', function() {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-previsual/config-previsualView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		link: function(scope, element, attrs) {
			/* Controleur se gère ici */
            	}
	};
});