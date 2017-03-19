(function(){ 
var ctrlCCNT = angular.module('ctrlCCNT');
/**
* Directive qui va permettre de valider le nom pour un horaire
* 	- Il va voir si le string est valide pas null ou vide
*  	- Contrôler dans le tab reçu en paramètre le nom n'existe pas encore
*  Attention cette directive est mutable c'est à dire qu'elle manipule des instances et à la fin de ces traitements les valeurs passées en paramètres vont changer
**/
ctrlCCNT.directive('validatorName', function(NotifService) {
	return {
		restrict: 'A',
		controller: function($scope) {
	    	$scope.isNameValid = function (cal, tab, limit) {
    			cal.errorName = false;
    			console.log('ici');
	    		if (cal.name === "" || angular.isUndefined(cal.name)) {
	    			cal.errorName = true;
	    		} else {
	    			var nb = 0;
	    			for (var i = 0; i < tab.length; i++) {
	    				if (tab[i].name === cal.name) {
	    					nb++;
	    					if (nb > limit) {
				    			cal.errorName = true;
				    			NotifService.error('Nom période existant', "Le nom : <span class='uk-label uk-label-default'>" + cal.name+ "</span> existe déjà !");
				    			return;
	    					}
	    				}
	    			}
	    		}
	    	}
		}
	};
}) // Fin de directive

})();

			