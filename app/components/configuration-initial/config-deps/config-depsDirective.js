/**
* Module qui fournit une directive afin de gérer la partie 2 des départements
* Son contrôleur sera défini dans Link 
* - Il permettra d'ajouter et de supprimer des départements
**/
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configDeps', function($timeout, Popover, PromiseDAO, SessionService, NotifService, ModalTuto) {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-deps/config-depsView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		link: function(scope, element, attrs) {
			$timeout(function () {
				scope.msgError = "Le département doit posséder entre 3 et 45 lettres";
				var self = scope;
				var CARRE = "carre-"; // Constante pour les objets du département (div#carre-id)

				for (var i = 1; i <= scope.$parent.depart.length; i++) {
					$('#' + CARRE + i).removeClass('transparence');
				}
				
				/*****************************************************************************************\
				* Gestion de l'affichage des popovers leur position en fonction de la largeur  *                        
				\*****************************************************************************************/

				var larg = (window.innerWidth);

				scope.popCarre = {position : 'top'};
				scope.popSup = {position : 'top'};
				scope.popAdd = {position : 'top'};

				/* Configuration de l'affichage de la position de l'affichage des popovers en fonction de la largeur de l'écran et de sa longeur */
				if (larg >= 1012 && !scope.state) {
					scope.popCarre = {position : 'right'};
					scope.popSup = {position : 'right'};
					scope.popAdd = {position : 'left'};
				}

				/*///////////////////////////////////////////////////////////////////////////////////////*/

				/*****************************************************************************************\
				* Gestion des popovers *                        
				\*****************************************************************************************/
				if (!scope.state) {
					Popover.showPop(1, ['#grand-carre', '#btnAjoutDep', '#supDep0']);
				}

				/*///////////////////////////////////////////////////////////////////////////////////////*/

		      	  	// Ajouter un departement au tableau depuis la div visuel des départements
		      	  	scope.ajouterDepartementTab = function(event){
		      	  		var length = scope.$parent.depart.length;
		      	  		scope.ajouterDepartement(event);
		      	  	}

		      	  	var enregistrer  = function(ev) {
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
				  	//ModalTuto.showModal(ev, 3);
				  	scope.ctrl.next(3);
				}

			  	/*****************************************************************************************\
	  			* Gestion des actions de l'étape *                        
	  			\*****************************************************************************************/

	  			scope.suivant = function (ev) {
	  				$timeout(enregistrer(ev), 2);
	  			}

	  			scope.precedent = function () {
	  				$timeout(scope.ctrl.previous(1), 2);
	  			}

	  			/*///////////////////////////////////////////////////////////////////////////////////////*/

			  	/*****************************************************************************************\
	  			* Validation des champs *                        
	  			\*****************************************************************************************/

	  			scope.verification = function (index) {
	  				var obj = scope.$parent.depart[index];
	  				obj.error = false;
	  				var len = obj.name.toString().length;
	  				if(len < 3 || len > 45){
	  					obj.error = true;
	  				}
	  				return obj.error;
	  			}

	  			/*///////////////////////////////////////////////////////////////////////////////////////*/

			  	/*****************************************************************************************\
				  		* Gestion des boutons des départements *                        
				  		\*****************************************************************************************/

			  	// Ajouter un département au tableau depuis le bouton ajouter département
			  	scope.ajouterDepartement = function(event){
			  		console.log(scope.state);
			  		$timeout(Popover.hide, 0);
			  		var length = scope.$parent.depart.length;
			  		console.log(length);
			  		var posIns = length + 1;
			  		$timeout(add, 1);
			  	}

			  	var decrementerSuivant = function(index) {
			  		var deps = scope.$parent.depart;
			  		for (var i = index; i < deps.length; i++) {
			  			deps[i].id = i + 1;
			  		}
			  	}

			  	var realSuppressionDep = function(index) {
			  		$timeout(Popover.hide, 0);
			  		var length = scope.$parent.depart.length;
			  		var el = (index == 0 && length == 1 ? document.getElementById(CARRE + 1): document.getElementById(CARRE + length));
			  		scope.$parent.depart.splice(index, 1);
			  		if (scope.$parent.depart.length != 0) {decrementerSuivant(index);}
			  		if (!$(el).hasClass("transparence")) {
			  			$(el).toggleClass('transparence');
			  		}
			  	}

			  	// Supression d'un departement qui se trouve dans le tableau
			  	scope.supprimerDepartement = function(event, id, index){
			  		if (scope.state) {
			  			var dataDep = {'noEta': scope.idEsta, 'noDep': id, 'user_id': SessionService.get('user_id'), 'user_token': SessionService.get('user_token') };
			  			PromiseDAO.departmentsReadyToDelete(dataDep).then(function(value) {
			  				if (value.data.length > 0) {
			  					var emp = value.data[0];
			  					NotifService.error('Suppression Département', 'Cet établissement est actuellement relié à ' + emp.per_nom +" "+ emp.per_prenom + ' vous ne pouvez pas le supprimer !');
			  				} else {
			  					realSuppressionDep(index);
			  				}
			  			}).then(function(value) {});
			  		} else {
			  			realSuppressionDep(index);
			  		}

			  	}

			  	var add = function () {
			  		var length = scope.$parent.depart.length;
			  		if (length < 8) {
			  			var posIns = length + 1;
			  			var el = document.getElementById(CARRE + posIns);
			  			if ($(el).hasClass("transparence")) {
			  				$(el).toggleClass("transparence");
			  			}
			  			scope.$parent.depart.push({id:posIns,name:'Votre département', carre:CARRE + posIns, error: false, state : 'new'});
			  			$timeout(focus, 10);
			  		};
			  	}
			  	
			  	var focus = function () {
			  		var length = scope.$parent.depart.length;
			  		$('#' + length).focus().select();
			  	}
			  	

			  }, 0);

    		}, // Fin du link
	}; // Fin du return
}); // Fin Directive