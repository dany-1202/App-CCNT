var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('notifDemandes', function ($timeout, SessionService, $http) {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) {
			scope.notif = scope;
			scope.demandeCours = {};
			var data = {user_id : SessionService.get('user_id'), user_token: SessionService.get('user_token')};
			
			
			scope.affDemande = function(demande) {
				scope.demandeCours = angular.copy(demande);
			}
			
			scope.traiterDemande = function(boolean) {
				data.demande = scope.demandeCours;
		    	data.demande.accept = boolean;
		    	var $promise = $http.post('assets/php/accepterDemandesAPI.php', data);
			    $promise.then(function (message) {
			    	console.log(message.data);
			    });
			}
			
			scope.demandesNotif = [];
			var getDemandesNotif = function() {
				var $promise = $http.post('assets/php/getNouvelleDemandesAPI.php', data);
	    		$promise.then(function (message) {
	    			if (message.data != false) {
	    				scope.demandesNotif = message.data;
	    			}
	    		});
				$timeout(getDemandesNotif, 30000);
			}
			
			getDemandesNotif();
			
			
		}
	};
})