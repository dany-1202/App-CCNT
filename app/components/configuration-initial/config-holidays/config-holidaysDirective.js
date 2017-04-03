var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configHolidays', function($mdpDatePicker, $mdDialog, $timeout, DateFactory, Popover, Const) {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-holidays/config-holidaysView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		link: function(scope, element, attrs) {

			var monthNames = DateFactory.monthNames;
			var dayNames = DateFactory.dayNames;
			var photo = "https://image.jimcdn.com/app/cms/image/transf/dimension=300x10000:format=jpg/path/se1a08fc9547ef1da/image/i8097eee300b9501a/version/1337253899/jour-f%C3%A9ri%C3%A9.jpg";
			
			scope.afficherJour = false; // Afficher la div pour ajouter un jour
			scope.afficherPlage = false; // Afficher la div pour ajouter une plage
			scope.modifJour = false; // Etat modification
			scope.objIndex = -1;
			scope.modifPlage = false; // Etat modification
			scope.dateDay = {title : '', date: new Date(), dateDebut : '', dateFin : ''};
			
			/* Libellé des boutons */
			scope.messageAjout = Const.ADDDAY;
			scope.messageEnlever = Const.STOPADD;
			scope.messageAjoutPlage = Const.ADDPERIOD;
			scope.btnAdd = Const.ADD;
			scope.btnModif = Const.MODIFY;

			/* Définir un listener qui est appelé quand la date de début dans une plage change */
			scope.$watch('dateDay.dateDebut', function(newValue, oldValue) {
				if (scope.dateDay.dateDebut != '' && !scope.modifPlage) {
					var obj = angular.copy(scope.dateDay.dateDebut);
					scope.dateValide = new Date(obj.setDate(obj.getDate() + 1));
					scope.dateDay.dateFin = angular.copy(newValue);
					scope.dateDay.dateFin.setDate(scope.dateDay.dateFin.getDate() + 7)
				}
			});

			/*****************************************************************************************\
			*                           Gestion de l'affichage des popovers                           *
			\*****************************************************************************************/

			var showPopTableDays = function () {
				Popover.showPop(5, ['#tableDays', '#calendari_lateral1']);
			}
			
			Popover.showPop(3, ['#addDay', '#addPlage']);

			/*///////////////////////////////////////////////////////////////////////////////////////*/

			var reInitJour = function () {
				scope.dateDay.date = new Date();
	    		scope.dateDay.title = "";
			}

			/*****************************************************************************************\
			*                                     Gestion du jour                                     *
			\*****************************************************************************************/
			
			


			scope.showAddDay = function () {
				$timeout(Popover.hide, 0);
				scope.afficherJour = !scope.afficherJour;
			}

			scope.addDayClose = function () { // Quand j'ajoute un jour de fermeture
				scope.addDay(scope.dateDay);
				scope.afficherJour = false;
				if (Popover.affTableDays) {
					$timeout(showPopTableDays, 300);
					$timeout(Popover.hide, 0);
					Popover.changeAffTableDays();
				}
			}

			/* Ajouter un jour dans les deux tableaux : events et calEvents (calendrier) */
			scope.addDay = function (dateDay) {
				scope.$parent.events.push({
					date: dateDay.date.getDate() + "/" + (dateDay.date.getMonth() + 1) + "/" + dateDay.date.getFullYear(),
					dateDebut: '',
					dateFin: '',
					title: dateDay.title,
					color: '#5D4037',
					content: '<img class="image" src="' + photo +'">',
					class: '',
				});
				scope.$parent.calEvents.push({
					date: dateDay.date.getDate() + "/" + (dateDay.date.getMonth() + 1) + "/" + dateDay.date.getFullYear(),
					title: dateDay.title,
					color: '#5D4037',
					content: '<img class="image" src="' + photo +'">',
					class: '',
				});
				$timeout(maj, 1);
			}


			scope.modifierEvent = function (index) {
				$timeout(Popover.hide, 0);
				var obj = scope.$parent.events[index];
				if (obj.date == null || obj.date == "") {

				} else {
					var objDate = obj.date;
					scope.afficherJour = true;
					scope.dateDay.title = obj.title;
					scope.dateDay.date = DateFactory.getDateStr(objDate);

					/* Etat modification */
					scope.objIndex = index;
					scope.modifJour = true;
				}
			}

			scope.modifierEventClose = function () {
				var objModif = scope.$parent.events[scope.objIndex];
				var objCalModif = scope.$parent.calEvents[scope.objIndex];
				objModif.date = DateFactory.getStrDate(scope.dateDay.date);
				objModif.title = scope.dateDay.title;
				objCalModif.date = DateFactory.getStrDate(scope.dateDay.date);
				objCalModif.title = scope.dateDay.title;
				
				$timeout(maj, 1);
				scope.objIndex = -1;
				reInitJour();
				scope.modifJour = false;
				scope.afficherJour = false;
			}

			scope.supprimerEvent = function (index) {
				$timeout(Popover.hide, 0);
				scope.$parent.events.splice(index, 1);
				scope.$parent.calEvents.splice(index, 1);
				$timeout(maj, 1);
			}

			/**********************/
			/* Gestion des plages */

			scope.showAddPlage = function () {
				$timeout(Popover.hide, 0);
				scope.dateDay.dateDebut = new Date();
				scope.dateDay.dateFin = angular.copy(scope.dateDay.dateDebut);
				scope.dateDay.dateFin.setDate(scope.dateDay.dateFin.getDate() + 7);
				scope.afficherPlage = !scope.afficherPlage;
			}

			scope.modifierPlageEvent = function (index) {
				$timeout(Popover.hide, 0);
				
				var obj = scope.$parent.plagesEvents[index];

				if (obj.dateDebut == null || obj.dateDebut == "") {

				} else {
					/* Traitement date début */
					scope.afficherPlage = true;
					scope.dateDay.title = obj.title;
					scope.dateDay.dateDebut = DateFactory.getDateStr(obj.dateDebut);
					scope.dateDay.dateFin = DateFactory.getDateStr(obj.dateFin);
					console.log(scope.dateDay);
					scope.objIndex = index;
					scope.modifPlage = true;
				}
			}

			scope.addPlage = function (dateDay) {
				var nbJours = DateFactory.calculateNbDays(dateDay.dateDebut, dateDay.dateFin);

				if (nbJours.day != 0) {
					if (!scope.modifPlage) {
						scope.$parent.plagesEvents.push({
							date : '',
							dateDebut: DateFactory.getStrDate(dateDay.dateDebut),
							dateFin: DateFactory.getStrDate(dateDay.dateFin),
							title: dateDay.title,
							color: '#5D4037',
							content: '<img class="image" src="' + photo +'">',
							class: '',
						});
					}
					
					/* Ajouter dans le tableau d'events */
					for (var i = 0; i <= nbJours.day; i++) {
						var date = angular.copy(dateDay.dateDebut);
						date.setDate(date.getDate() + i);
						scope.$parent.calEvents.push({
							date: DateFactory.getStrDate(date),
							title: dateDay.title,
							color: '#5D4037',
							content: '<img class="image" src="' + photo +'">',
							class: '',
						});
					};
					$timeout(maj, 1);
				}
			}

			/* Quand j'ajoute une plage de fermeturefa */
			scope.addPlageClose = function () {
				$timeout(showPopTableDays, 300);
				if (scope.modifPlage) {
					var objModif = scope.$parent.plagesEvents[scope.objIndex];
					objModif.dateDebut = DateFactory.getStrDate(scope.dateDay.dateDebut);
					objModif.dateFin = DateFactory.getStrDate(scope.dateDay.dateFin);
					objModif.title = angular.copy(scope.dateDay.title);

				}
				scope.addPlage(scope.dateDay);
				scope.objIndex = -1;
				scope.dateDay.title = "";
				scope.dateDay.dateDebut = "";
				scope.dateDay.dateFin = "";
				if (scope.modifPlage) {scope.modifPlage = !scope.modifPlage;}
				scope.afficherPlage = false;
				$timeout(maj, 1);
			}

			scope.supprimerPlageEvent = function (index) {
				$timeout(Popover.hide, 0);
				var obj = scope.$parent.plagesEvents[index];
				var nbJours = DateFactory.calculateNbDays(DateFactory.getDateStr(obj.dateDebut), DateFactory.getDateStr(obj.dateFin));
				console.log(nbJours);
				scope.$parent.plagesEvents.splice(index, 1);
				scope.$parent.calEvents.splice(index, nbJours.day+1);
				$timeout(maj, 1);
				/* Boucle pour supprimer du calendrier */
			}

			var maj = function () {
				$('#calendari_lateral1').empty();
				$('#calendari_lateral1').bic_calendar({
			        events: scope.$parent.calEvents,			          
			        enableSelect: false,			
			        multiSelect: false,			          
			        dayNames: dayNames,
					monthNames: monthNames,
			        showDays: true,
		    	});
	    		reInitJour();
			}

			var majCalEvents = function () {
				var length = scope.$parent.calEvents.length;
				scope.$parent.calEvents.splice(0, length);
			}

			$('#calendari_lateral1').bic_calendar({
		        events: scope.$parent.calEvents,			          
		        enableSelect: false,			
		        multiSelect: false,			          
		        dayNames: dayNames,
				monthNames: monthNames,
		        showDays: true,
		    });
		},
	}
});