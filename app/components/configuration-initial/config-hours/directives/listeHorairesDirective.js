(function (){
	var ctrlCCNT = angular.module('ctrlCCNT');

	ctrlCCNT.directive('listeHoraires', function() {
		return {
			restrict : 'A', // Ici se limite à la balise si on veut pour un attribut = A
			templateUrl : "app/components/configuration-initial/config-hours/views/listeHorairesView.html",
		}
	})
})();