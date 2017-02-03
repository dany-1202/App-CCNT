var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configEstablishment', function($timeout, $rootScope) {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-establishment/config-establishmentView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		link: function(scope, element, attrs) {

			/* Cache les popovers */
			var hide = function () {
				$("#btnSuivant").popover('hide');
			}


			/* Afficher les popovers et défini un listner pour chacune d'entre elle si on clique sur la popover elle la cache */
			var show = function () {
				$('#btnSuivant').popover('show');
				$("div.popover").click(function(e) {
					$(e.currentTarget).popover('hide');
				});
			}

			if ($rootScope.firstTimeEta) {
				$timeout(show, 1);
				$timeout(hide, 30000);
				$rootScope.firstTimeEta = false; // Je vois si c'est la première fois que j'affiche le popover ou non
			}

			/* Controleur se gère ici */
			scope.verification = function(id, index){
				$timeout(hide, 10);
				var obj = scope.infoEtablissement[index];
				obj.error = false;
				console.log(obj);
				if(obj.type == "tel"){
					var patternTel = new RegExp(/^(?:(?:|0{1,2}|\+{0,2})41(?:|\(0\))|0)([1-9]\d)(\d{3})(\d{2})(\d{2})$/);
		    		obj.error = !patternTel.test(obj.value);
		    		return;
				}else if(obj.type == "number"){
					if(Number.isInteger(obj.value) == false && obj.value < 0){
						obj.error = true;
					}
				}else if(obj.type == "email" && obj.value.toString().length != 0){
					var patternEmail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
					obj.error = !patternEmail.test(obj.value.toString());
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

			//Verifie l'etat de l'attribut error
			scope.verificationError = function(id, index){
				var obj = scope.infoEtablissement[index];
				return obj.error;
			}

			scope.verificationSuivant = function(){
				$timeout(hide, 10);
				var err = false;
				for (var i = scope.infoEtablissement.length - 1; i >= 0; i--) {
					scope.verification(scope.infoEtablissement[i].id,i);
					if (scope.infoEtablissement[i].error == true){err=true;}
				};
				if(err == false){scope.$parent.ctrl.next(2);}
			}
    },
	};
});