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
		    if ($(event.target).get(0).nodeName=="SPAN") {return;} // Si je clique sur le span
		    $(event.target).children('span').val('{{depart[1].name}}');
		    if ($(event.target).hasClass("transparence")) {
		      $(event.target).toggleClass("transparence");
		      		    
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
		  	var posIns = length + 1;
		    if (length < 8) {
		    	var el = document.getElementById(CARRE + posIns);
		      if ($(el).hasClass("transparence")) {
		        $(el).toggleClass("transparence");
		      }
		      scope.$parent.depart.push({id:posIns,name:'Votre département', carre:CARRE + posIns});
		    };
		  }


		  // Supression d'un departement qui se trouve dans le tableau
		  scope.supprimerDepartement = function(event, id, index){
		  	var length = scope.$parent.depart.length;
		  	var el = (index == 0 && length == 1 ? document.getElementById(CARRE + 1): document.getElementById(CARRE + length));
		  	scope.$parent.depart.splice(index, 1);
		  	if (!$(el).hasClass("transparence")) {
		      $(el).toggleClass('transparence');
		    }
		  }
    },
	};
});