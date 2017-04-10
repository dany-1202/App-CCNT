var ctrlCCNT = angular.module('ctrlCCNT');


ctrlCCNT.directive('timePicker', function($mdpTimePicker, Const, DateFactory, NotifService ) {
	 return {
	 	restrict : 'A', // Ici se limite à la balise si on veut pour un attribut = A
		//templateUrl : 'app/components/configuration-initial/config-prehours/config-preHoursView.html', // Template à utiliser lorsque la balise est utilisé
		//transclude : true, // Inclu la vue au template déjà existant

		link: function(scope, element, attrs, $timeout) {
			scope.event = {};
			scope.event.startsAt = new Date();
			scope.heureDebut1 = Const.HOUR_OPEN;
			scope.heureFin1 = Const.HOUR_END;
			scope.heureDebut2 = Const.HOUR_OPEN;
			scope.heureFin2 = Const.HOUR_END;



			scope.showHeureDebutSer1 = function(ev, index) {
			 	$mdpTimePicker(scope.heureDebut1, {
			 		targetEvent: ev,
			 		parent: angular.element(document.body.parentElement)
			 	}).then(function(selectedDate) {
			 		var date = DateFactory.newDate(scope.event.startsAt, selectedDate);
			 		if (scope.heureFin1 != Const.HOUR_END) {
			 			var dateFin = DateFactory.newDate(scope.event.startsAt, scope.heureFin1);
			 			if(date >= dateFin){
		   					NotifService.error(Const.TITLE_ERROR_CONFIG, Const.MSG_OPEN_AFTER_END);
		   					return;
			 			}
			 		}
			 		scope.heureDebut1 = date;
			 	});
			};
			
			scope.showHeureFinSer1 = function(ev, index) {
			 	$mdpTimePicker(scope.heureFin1, {
			 		targetEvent: ev,
			 		parent: angular.element(document.body.parentElement)
			 	}).then(function(selectedDate) {

			 		var date = DateFactory.newDate(scope.event.startsAt, selectedDate);
			 		if (scope.heureDebut1 != Const.HOUR_OPEN && date <= scope.heureDebut1) { // Comparer la première heure
		   				NotifService.error(Const.TITLE_ERROR_CONFIG, Const.MSG_END_BEFORE_OPEN);
		   				return;
			 		}
			 		
			 		if (scope.heureDebut2 != Const.HOUR_OPEN) {
			 			var dateFin = DateFactory.newDate(scope.event.startsAt, scope.heureDebut2);
	 					if(date >= dateFin){
			   				NotifService.error(Const.TITLE_ERROR_CONFIG, Const.MSG_FIN1_AFTER_OPEN2);
			   				return;
			 			}
			 		}
			 		
					scope.heureFin1 = date;
			 	});
			};
			
			scope.showHeureDebutSer2 = function(ev, index) {
			 	$mdpTimePicker(scope.heureDebut2, {
			 		targetEvent: ev,
			 		parent: angular.element(document.body.parentElement)
			 	}).then(function(selectedDate) {
			 		
			 		var date = DateFactory.newDate(scope.event.startsAt, selectedDate);
			 		if (scope.heureFin1 != Const.HOUR_END) { // Comparer la première heure
			 			var dateFin = DateFactory.newDate(scope.event.startsAt, scope.heureFin1);
		   				if (date <= dateFin) {
			   				NotifService.error(Const.TITLE_ERROR_CONFIG, Const.MSG_OPEN2_BEFORE_END1);
			   				return;
			 			}
			 		}
			 		
			 		if (scope.heureFin2 != Const.HOUR_END) { // Comparer la première heure
			 			var dateFin = DateFactory.newDate(scope.event.startsAt, scope.heureFin2);
		   				if (date >= dateFin) {
			   				NotifService.error(Const.TITLE_ERROR_CONFIG,  Const.MSG_OPEN_AFTER_END);
			   				return;
			 			}
			 		}
			 		scope.heureDebut2 = date;
			 	});
			};
			scope.showHeureFinSer2 = function(ev, index) {
			 	$mdpTimePicker(scope.heureFin2, {
			 		targetEvent: ev,
			 		parent: angular.element(document.body.parentElement)
			 	}).then(function(selectedDate) {
			 		var date = DateFactory.newDate(scope.event.startsAt, selectedDate);
			 		
			 		if (scope.heureDebut2 != Const.HOUR_OPEN) { // Comparer la première heure
			 			var dateFin = DateFactory.newDate(scope.event.startsAt, scope.heureDebut2);
			 			if (date < dateFin) {
			 				if ((date.getHours() == scope.heureDebut1.getHours() && date.getMinutes() >= scope.heureDebut1.getMinutes()) || date.getHours() > scope.heureDebut1.getHours()) {
			 					NotifService.error(Const.TITLE_ERROR_CONFIG, "L'heure de fermeture est avant celle d'ouverture !");
		   						return;
			 				}
		 					date = moment(date).add(1, 'days').toDate();
			 			}
			 		}
					scope.heureFin2 = date;
			 	});
			};
		}

	 }

});
