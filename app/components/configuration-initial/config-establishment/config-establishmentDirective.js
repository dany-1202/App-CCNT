var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configEstablishment', function() {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-establishment/config-establishmentView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		link: function(scope, element, attrs) {
			/* Controleur se gère ici */
    },
	};
});