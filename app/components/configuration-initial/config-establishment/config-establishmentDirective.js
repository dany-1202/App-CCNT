var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configEstablishment', function() {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-establishment/config-establishmentView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		link: function(scope, element, attrs) {
			/* Controleur se gère ici */

			scope.verification = function(id, index){
				var obj = scope.infoEtablissement[index];
			}

			scope.validationEmail = function(email) {
		  	var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
		    if (email == null || email == "") {return true;}
		    return pattern.test(email);
		  };

			scope.validation = function() {
				var cpt = 0;
				for (var i = scope.infoEtablissement.length - 1; i >= 0; i--) {
					if (scope.infoEtablissement[i].value == null){
						//$('#' + scope.infoEtablissement[i].id).addClass('required'); 
						cpt++;
					}
				};
				//if (cpt == 0) {scope.$parent.ctrl.next(2);} // Je passe à l'étape suivante
			}
    },
	};
});