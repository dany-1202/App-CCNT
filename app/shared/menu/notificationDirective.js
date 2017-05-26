
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('notifDemandes', function ($timeout, SessionService, $http, State, NotifService) {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) {
			scope.notif = scope;
			scope.demandeCours = {};
			scope.affMessage = false;

			var timer; 
			var data = {user_id : SessionService.get('user_id'), user_token: SessionService.get('user_token')};
			
			
			scope.affDemande = function(demande) {
				scope.demandeCours = angular.copy(demande);
			}
			
			scope.traiterDemande = function(boolean) {
				data.demande = scope.demandeCours;
		    		data.demande.accept = boolean;
		    		var $promise = $http.post('assets/php/accepterDemandesAPI.php', data);
			   	 $promise.then(function (message) {
			    		console.log(message);
			    		var pos = 0;
			    		for (var i = 0; i < scope.demandesNotif.length; i++) {
			    			if (scope.demandesNotif[i].idDem == scope.demandeCours.idDem) {
			    				pos = i;
			    			}
			    		}
			    		scope.demandesNotif.splice(pos, 1);
			    	});
			}
			
			scope.demandesNotif = [];

			var getDemandesNotif = function() {
				var $promise = $http.post('assets/php/getNouvelleDemandesAPI.php', data);
		    		$promise.then(function (message) {
		    			if (message.data != 'false') {
		    				scope.demandesNotif = message.data;
		    				if (State.affMessageDemandes == false) {
		    					console.log('ici');
		    					if (message.data.length > 0) {
		    						$timeout(function() {
		    							NotifService.info("Nouvelles demandes", "Vous avez nouvelles <span class='w3-badge w3-green'>" + message.data.length + "</span> demandes !");
		    						}, 1500);
		    					}
		    					State.changeAffMessage();
		    				}
		    			}
		    		});
				timer = $timeout(getDemandesNotif, 20000);
			}
			
			getDemandesNotif();

			scope.affParametrageVue = function() {}

			scope.$on('$destroy', function () {
			    	$timeout.cancel(timer);
			    	$( "#modal-example" ).remove();
			});
			
		}
	};
})