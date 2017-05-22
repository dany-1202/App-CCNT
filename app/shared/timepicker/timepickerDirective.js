var ctrlCCNT = angular.module('ctrlCCNT');


ctrlCCNT.directive('timePicker', function($mdpTimePicker, Const, DateFactory, NotifService, $http, SessionService) {
	 return {
	 	restrict : 'A', // Ici se limite à la balise si on veut pour un attribut = A
		//templateUrl : 'app/components/configuration-initial/config-prehours/config-preHoursView.html', // Template à utiliser lorsque la balise est utilisé
		//transclude : true, // Inclu la vue au template déjà existant

		link: function(scope, element, attrs, $timeout) {
			scope.event = {};
			scope.errorHoraire = false;
			scope.errorJour = '';
			scope.ouvertures = '';
			scope.event.startsAt = new Date();
			scope.heureDebut1 = Const.HOUR_OPEN;
			scope.heureFin1 = Const.HOUR_END;
			scope.heureDebut2 = Const.HOUR_OPEN;
			scope.heureFin2 = Const.HOUR_END;
			
			var checkHoursInOpenning = function() {
				if ((scope.heureDebut1 != Const.HOUR_OPEN && scope.heureFin1 != Const.HOUR_END)) {
					isHoursInOpenning(scope.heureDebut1, scope.heureFin1, 2, scope.heureFin1);
				}
				if ((scope.heureDebut2 != Const.HOUR_OPEN && scope.heureFin2 != Const.HOUR_END)) {
					isHoursInOpenning(scope.heureDebut2, scope.heureFin2, 4, scope.heureFin2);
				}
			}
			
			
			var isHoursInOpenning = function (heureDebut, heureFin, id, date) {
				var heureDebutS1 = heureDebut.getHours()+":"+heureDebut.getMinutes()+":00";
	  			var heureFinS1 = heureFin.getHours() +":"+heureFin.getMinutes()+":00";
		 		var data = {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'), 'per_id': scope.myPerson, 'date': DateFactory.getDateBDD(scope.event.startsAt), 'heureDebut': heureDebutS1, 'heureFin': heureFinS1};
		 		var $res = $http.post('assets/php/checkHoraireReadyToModify.php', data);
		 		$res.then(function(message) {
		 			console.log(message);
		 			var objet = message.data;
		 			var res = null;
		 			if (!objet.valide) {
		 				scope.errorHoraire = true;
		 				var res = DateFactory.getJourById(objet.jour);
		 				scope.errorJour = res;
		 				scope.ouvertures = (objet.coupures === 1 ? (' Matin: ' + objet.matinDebut + ' - ' + objet.matinFin + ' | Soir: ' + objet.soirDebut + ' - ' + objet.soirFin) : (' Début: ' + objet.heureDebut + ' | Fin: ' + objet.heureFin));
		 				NotifService.error('Heures Hors-Ouverture Établissement', objet.message);
		 				res = (id == 1 || id == 3) ? Const.HOUR_OPEN : Const.HOUR_END;
		 			} else {
		 				scope.errorHoraire = false;
		 				res = date;
		 			}
		 			switch(id) { 
	 					case 1:
					        		scope.heureDebut1 = res;
					        		scope.hourToValidate = {id : 1, hour: date};
					        		break;
				   	 	case 2:
					       		scope.heureFin1 = res;
					       		scope.hourToValidate = {id : 2, hour: date};
					        		break;
			       			 case 3:
						        	scope.heureDebut2 = res;
						        	scope.hourToValidate = {id : 3, hour: date};
						        	break;
				        		case 4:
				        			scope.heureFin2 = res;
				        			scope.hourToValidate = {id : 4, hour: date};
				        			break;
			   		}
		 		});
			}
			
			scope.showHeureDebutSer1 = function(ev, index) {
			 	$mdpTimePicker(scope.heureDebut1 == Const.HOUR_OPEN ? DateFactory.matinDebut : scope.heureDebut1, {
			 		targetEvent: ev,
			 		parent: angular.element(document.body.parentElement)
			 	}).then(function(selectedDate) {
			 		if (selectedDate == Const.ANNULER) { scope.heureDebut1 = Const.HOUR_OPEN; return; }
			 		
			 		var date = DateFactory.newDate(scope.event.startsAt, selectedDate);
			 		if (scope.heureFin1 != Const.HOUR_END) {
			 			var dateFin = DateFactory.newDate(scope.event.startsAt, scope.heureFin1);
			 			if(date >= dateFin){
		   					NotifService.error(Const.TITLE_ERROR_CONFIG, Const.MSG_OPEN_AFTER_END);
		   					return;
			 			}
			 		}
			 		if (scope.heureFin1 != Const.HOUR_END) {
			 			isHoursInOpenning(date, scope.heureFin1, 1, date);
			 		} else {
			 			scope.heureDebut1 = date;
			 		}
			 		
			 	});
			};
			
			scope.showHeureFinSer1 = function(ev, index) {
			 	$mdpTimePicker(scope.heureFin1 == Const.HOUR_END ? DateFactory.matinFin : scope.heureFin1, {
			 		targetEvent: ev,
			 		parent: angular.element(document.body.parentElement)
			 	}).then(function(selectedDate) {
			 		if (selectedDate == Const.ANNULER) { scope.heureFin1 = Const.HOUR_END; return; }
			 		
			 		var date = DateFactory.newDate(scope.event.startsAt, selectedDate);
			 		if (scope.heureDebut2 != Const.HOUR_OPEN) {
			 			var dateFin = DateFactory.newDate(scope.event.startsAt, scope.heureDebut2);
	 					if(date >= dateFin){
			   				NotifService.error(Const.TITLE_ERROR_CONFIG, Const.MSG_FIN1_AFTER_OPEN2);
			   				return;
			 			}
			 		} else {
			 			if (scope.heureDebut1 != Const.HOUR_OPEN && date <= scope.heureDebut1) { // Comparer la première heure
			   				date = moment(date).add(1, 'days').toDate();
			 			}
			 		}
			 		
			 		if (scope.heureDebut1 != Const.HOUR_OPEN) { // Si valide par rapport aux autres
			 			isHoursInOpenning(scope.heureDebut1, date, 2, date);
			 		} else {
			 			scope.heureFin1 = date;
			 		}
					
			 	});
			};
			
			scope.showHeureDebutSer2 = function(ev, index) {
			 	$mdpTimePicker(scope.heureDebut2 == Const.HOUR_OPEN ? DateFactory.soirDebut : scope.heureDebut2, {
			 		targetEvent: ev,
			 		parent: angular.element(document.body.parentElement)
			 	}).then(function(selectedDate) {
			 		console.log(selectedDate);
			 		
			 		if (selectedDate == Const.ANNULER) { scope.heureDebut2 = Const.HOUR_OPEN; return; }
			 		
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
			 			isHoursInOpenning(date, scope.heureFin2, 3, date);
			 		} else {
			 			scope.heureDebut2 = date;
			 		}
			 		
			 	});
			};
			scope.showHeureFinSer2 = function(ev, index) {
			 	$mdpTimePicker(scope.heureFin2 == Const.HOUR_END ? DateFactory.soirFin : scope.heureFin2, {
			 		targetEvent: ev,
			 		parent: angular.element(document.body.parentElement)
			 	}).then(function(selectedDate) {
			 		if (selectedDate == Const.ANNULER) { scope.heureFin2 = Const.HOUR_END; return; }
			 		
			 		var date = DateFactory.newDate(scope.event.startsAt, selectedDate);
			 		
			 		if (scope.heureDebut2 != Const.HOUR_OPEN) { // Comparer la première heure
			 			var dateFin = DateFactory.newDate(scope.event.startsAt, scope.heureDebut2);
			 			if (date < dateFin) {
			 				if (scope.heureDebut1 != Const.HOUR_OPEN) {
				 				if ((date.getHours() == scope.heureDebut1.getHours() && date.getMinutes() >= scope.heureDebut1.getMinutes()) || date.getHours() > scope.heureDebut1.getHours()) {
				 					NotifService.error(Const.TITLE_ERROR_CONFIG, "L'heure de fermeture est avant celle d'ouverture !");
			   						return;
				 				}
			 				}
		 					date = moment(date).add(1, 'days').toDate();
			 			}
			 			isHoursInOpenning(scope.heureDebut2, date, 4, date);
			 		} else {
						scope.heureFin2 = date;
			 		}
			 	});
			};
		}

	 }

});
