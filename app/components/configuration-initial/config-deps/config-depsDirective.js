var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configDeps', function($timeout, Popover) {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-deps/config-depsView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		link: function(scope, element, attrs) {
			var self = scope;
			var CARRE = "carre-"; // Constante pour les objets du département (div#carre-id)

			var hide = function () {
				$("div.popover").popover('hide');
			}

			var show = function () {
				$('#grand-carre').popover('show');
				$('#btnAjoutDep').popover('show');
				$('#supDep0').popover('show');
				$("div.popover").click(function(e) {
					$(e.currentTarget).popover('hide');
				});
			}
			
			if (Popover.firstTimeDep) {
				$timeout(show, 1);
				$timeout(hide, 30000);
				Popover.changeFirstTimeDep();
			}
			

      	  // Ajouter un departement au tableau depuis la div visuel des départements
		  scope.ajouterDepartementTab = function(event){
		  	var length = scope.$parent.depart.length;
		  	scope.ajouterDepartement(event);
		  	/*
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
		      
		    }*/
		  }

		  var enregistrer  = function() {
		  	if (scope.$parent.depart.length == 0) {
		  		$('#grand-carre').notify(
					  "Vous n'avez pas de département" , { className: 'error', position:"top center"}
					);
		  		$('#btnAjoutDep').notify(
					  "Vous devez insérer au moins 1 département" , { className: 'error', position:"top center"}
					).focus();
					return;
		  	} else {  		
			  	for (var i = scope.$parent.depart.length - 1; i >= 0; i--) {
			  		var obj = scope.$parent.depart[i];
			  		if (obj.error == true) { // Dès que je trouve une erreur je ne met pas suivant
			  			$('#' + obj.id).focus();
			  			return;
			  		}
			  	}
		  	};
		  	scope.ctrl.next(3);
		  }

		  scope.suivant = function () {
		  	$timeout(hide, 1);
		  	$timeout(enregistrer, 2);
		  }

		  scope.precedent = function () {
		  	$timeout(hide, 1);
		  	$timeout(scope.ctrl.previous(1), 2);
		  }

		  scope.verification = function (index) {
		  	var obj = scope.$parent.depart[index];
		  	obj.error = false;
		  	var len = obj.name.toString().length;
				if(len < 3 || len > 45){
					obj.error = true;
				}
				return obj.error;
		  }

		  var add = function () {
		  	var length = scope.$parent.depart.length;
		  	if (length < 8) {
		  		var posIns = length + 1;
			   	var el = document.getElementById(CARRE + posIns);
			    if ($(el).hasClass("transparence")) {
			    	$(el).toggleClass("transparence");
			    }
			    scope.$parent.depart.push({id:posIns,name:'Votre département', carre:CARRE + posIns, error: false});
			};
		  }

		  // Ajouter un département au tableau depuis le bouton ajouter département
		  scope.ajouterDepartement = function(event){
		  	$timeout(hide, 1);
		  	var length = scope.$parent.depart.length;
		  	var posIns = length + 1;
		  	$timeout(add, 2);
		  	$timeout(focus, 3);
		  }

		  var focus = function () {
		  	var length = scope.$parent.depart.length;
		  	$('#' + length).focus().select();
		  }

		  // Supression d'un departement qui se trouve dans le tableau
		  scope.supprimerDepartement = function(event, id, index){
		  	$timeout(hide, 1);
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