(function(){ /* Afin de permettre de ne pas créer de conflit */
/**
* Module qui fournit une factory afin de gérer les popovers
* Il va permettre de savoir si une popovers s'est déjà affiché afin de ne plus l'afficher, 
* car elle vont servir juste à décrire des étapes si nous l'avons jamais faites.
* La création de cette factory sert afin de faire une séparation des popovers par rapport au controleur vue que c'est quelque 
* chose de générale mais surtout elle permet de partager tout ça dans l'application.
**/
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.factory('Popover', function ($timeout) {
	var pop = {}; // Je crée un objet

	pop.firstTimeEta = true; // Popovers dans établissement
	pop.firstTimeDep = true; // Popovers dans les départements
   	pop.firstTimeHours = true; // Popovers dans les horaires d'ouvertures
   	pop.firstTimeHol = true; // Popovers dans les jours fériés et vacances
   	pop.affHourModif = true;
   	pop.affTableDays = true;
   	
   	pop.pops = [true, true, true, true, true, true];

	pop.changeFirstTimeEta = function () { 
		pop.firstTimeEta = false; // Mettre à l'état à false afin de ne plus afficher
	}

	pop.changeFirstTimeDep = function () { 
		pop.firstTimeDep = false; // Mettre à l'état à false afin de ne plus afficher
	}

	pop.changeFirstTimeHours = function () {
		pop.firstTimeHours = false; // Mettre à l'état à false afin de ne plus afficher
	}

	pop.changeFirstTimeHol = function () {
		pop.firstTimeHol = false; // Mettre à l'état à false afin de ne plus afficher
	}

	pop.changeAffHourModif = function () {
		pop.affHourModif = false; // Mettre à l'état à false afin de ne plus afficher
	}

	pop.changeAffTableDays = function () {
		pop.affTableDays = false; // Mettre à l'état à false afin de ne plus afficher
	}
	
	pop.hide = function () {
		$("div.popover").popover('hide');
	}
	
	pop.show = function(id) {
		$(id).popover('show');
	}
	
	pop.putListener = function () {
		$("div.popover").click(function(e) {
			$(e.currentTarget).popover('hide');
		});
	}

	function showPops(tab) {
		for (var i = 0; i < tab.length; i++) {
			pop.show(tab[i]);
		}
		pop.putListener();
	}
	
	pop.showPop = function (index, tab) {
		$timeout(pop.hide, 0);
		$timeout(function () {
			if (pop.pops[index]) {showPops(tab);pop.pops[index] = false;}
		}, 200);
	}
	return pop;
})

})();