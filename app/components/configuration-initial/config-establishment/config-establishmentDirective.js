var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configEstablishment', function($timeout, $rootScope, Popover, State) {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-establishment/config-establishmentView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		link: function(scope, element, attrs) {

			/*****************************************************************************************\
					* Gestion des popovers *                        
			\*****************************************************************************************/

			/* Cache les popovers */
			var hide = function () {
				$("#btnSuivant").popover('hide');
			}

			/* Afficher les popovers et défini un listener pour chacune d'entre elle si on clique sur la popover elle la cache */
			var show = function () {
				$('#btnSuivant').popover('show');
				$("div.popover").click(function(e) {
					$(e.currentTarget).popover('hide');
				});
			}

			if (Popover.firstTimeEta && State.finishTuto) {
				$timeout(show, 300);
				$timeout(hide, 30000);
				Popover.changeFirstTimeEta() // Je vois si c'est la première fois que j'affiche le popover ou non
			}

			/*///////////////////////////////////////////////////////////////////////////////////////*/


			/*****************************************************************************************\
					* Gestion du contrôleur == link ici *                        
			\*****************************************************************************************/

			/* Vérification de la validation du champ concerné - l'error est mis à true si elle existe à false sinon */

			scope.verification = function(id, index){
				$timeout(hide, 1);
				var obj = scope.infoEtablissement[index];
				obj.error = false;
				if (obj.value === undefined) {
					obj.error = true;
					return;
				}
				if(obj.type == "tel"){
					var patternTel = new RegExp(/^(?:(?:|0{1,2}|\+{0,2})41(?:|\(0\))|0)([1-9]\d)(\d{3})(\d{2})(\d{2})$/);
		    		obj.error = !patternTel.test(obj.value);
		    		return;
				}else if(obj.type == "number"){
					if(Number.isInteger(obj.value) == false && obj.value < 0){
						obj.error = true;
					}
				}else if(obj.type == "email" && obj.value.length != 0){
					var patternEmail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
					obj.error = !patternEmail.test(obj.value);
					return;
				}else if(obj.id == 7 && obj.value.toString().length != 0){//Controle l'url 
					var patternUrl= new RegExp(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/);
					obj.error = !patternUrl.test(obj.value.toString());
					return;
				}
				var len = obj.value.toString().length;
				if(len < obj.min || len > obj.max && obj.type != "tel"){
					obj.error = true;
					return;
				}
			}

			/*///////////////////////////////////////////////////////////////////////////////////////*/

			/* Valide si l'étape est validé */
			scope.verificationSuivant = function(){
				$timeout(hide, 1);
				var err = false;
				for (var i = scope.infoEtablissement.length - 1; i >= 0; i--) {
					scope.verification(scope.infoEtablissement[i].id,i);
					if (scope.infoEtablissement[i].error == true){err=true;}
				};
				if(err == false){scope.$parent.ctrl.next(2);}
			}
    	}, // Fin Link
	}; // Fin Return
}); // Fin Directive