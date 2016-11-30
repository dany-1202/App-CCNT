var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configDeps', function() {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-deps/config-depsView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		link: function(scope, element, attrs) {
			var self = scope;
			var CARRE = "carre-"; // Constante pour les objets du département (div#carre-id)
      // Ajouter un departement au tableau depuis la div visuel des départements
		  scope.ajouterDepartementTab = function(event){
		  	var length = scope.$parent.depart.length;
		    if ($(event.target).get(0).nodeName=="SPAN") {return;}
		    if ($(event.target).hasClass("transparence")) {
		      $(event.target).toggleClass("transparence");
		      if (scope.$parent.depart.length < 4) {
			      if (length == 3) {idDep = 4};
			      if (length == 2) {idDep = 3};
			      if (length == 1) {idDep = 2};
			      if (length == 0) {idDep = 1};
			    }
			    if (scope.$parent.depart.length < 8) {
			      scope.$parent.depart.push({id:idDep,name:'Votre département', carre: event.target.id});
			      var el = document.getElementById(event.target.id);
			      if ($(el).hasClass("transparence")) {
			        $(el).toggleClass("transparence");
			      }
			      
			    };
		      
		    } 
		  }
		  // Ajouter un département au tableau depuis le bouton ajouter département
		  scope.ajouterDepartement = function(event){
		  	var length = scope.$parent.depart.length;
		  	// Si la taille de depart est < 4 cela veut dire qu'il faut redéfinir idDep
		    if (scope.$parent.depart.length < 4) {
		      if (length == 3) {idDep = 4};
		      if (length == 2) {idDep = 3};
		      if (length == 1) {idDep = 2};
		      if (length == 0) {idDep = 1};
		    }
		    if (scope.$parent.depart.length < 8) {
		      scope.$parent.depart.push({id:idDep,name:'Votre département', carre:CARRE + idDep});
		      var el = document.getElementById(CARRE + idDep);
		      if ($(el).hasClass("transparence")) {
		        $(el).toggleClass("transparence");
		      }
		      
		    };
		  }
		  // Supression d'un departement qui se trouve dans le tableau
		  scope.supprimerDepartement = function(event, id){
		  	var pos = id-1;
		  	var length = scope.$parent.depart.length;
		  	var el = (length == id ? document.getElementById(CARRE + id) : document.getElementById(CARRE + length));
		  	if (!$(el).hasClass("transparence")) {
		      $(el).toggleClass('transparence');
		    }
	  		if (length == 1) {
	  			scope.$parent.depart[0].name = "";
	      	scope.$parent.depart.splice(0,1);
	  			return;
	  		}
	  		scope.$parent.depart[pos].name = "";
	      scope.$parent.depart.splice(pos,1);
	  		
		  }
    },
	};
});