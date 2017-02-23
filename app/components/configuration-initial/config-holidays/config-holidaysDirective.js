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
				if (scope.dateDay.dateDebut != '') {
					scope.dateDay.dateFin = angular.copy(newValue);
					scope.dateDay.dateFin.setDate(scope.dateDay.dateFin.getDate() + 7)
				}
			});


			/*****************************************************************************************\
			*                           Gestion de l'affichage des popovers                           *
			\*****************************************************************************************/

			var show = function () {
				$('#addDay').popover('show');
				$('#addPlage').popover('show');
				$("div.popover").click(function(e) { // Ajout d'évennement pour pouvoir cacher les popovers quand on clique dessus
		   			e.preventDefault();
					$(e.currentTarget).popover('hide');
				});
			}

			var showPopTableDays = function () {
				$('#tableDays').popover('show');
				$('#calendari_lateral1').popover('show');
				$("div.popover").click(function(e) { // Ajout d'évennement pour pouvoir cacher les popovers quand on clique dessus
		   			e.preventDefault();
					$(e.currentTarget).popover('hide');
				});
			}

			var hide = function () {
				$('div.popover').popover('hide');
			}
			
			if (Popover.firstTimeHol) { // Savoir grâce au factory si c'est la première fois qu'il affiche le poppover
				$timeout(show, 200); // Lancer les popovers
				$timeout(hide, 30000); // Cacher les popovers 
				Popover.changeFirstTimeHol(); // Change à false pour que la prochaine fois il ne rentre plus dans le test, car il l'aura afficher
			}

			/* Cacher les popovers */
			scope.hidePopovers = function () { 
				$timeout(hide, 1);
			}

			/*///////////////////////////////////////////////////////////////////////////////////////*/


			/*****************************************************************************************\
			*                                     Gestion du jour                                     *
			\*****************************************************************************************/

			scope.showAddDay = function () {
				$timeout(hide, 1);
				scope.afficherJour = !scope.afficherJour;
			}

			scope.addDayClose = function () { // Quand j'ajoute un jour de fermeture
				scope.addDay(scope.dateDay);
				scope.afficherJour = false;
				if (Popover.affTableDays) {
					$timeout(showPopTableDays, 300);
					$timeout(hide, 1);
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
				objModif.date = scope.dateDay.date.getDate() + "/" + (scope.dateDay.date.getMonth() + 1) + "/" + scope.dateDay.date.getFullYear(),
				objModif.title = scope.dateDay.title;
				console.log(scope.$parent.events);
				console.log(scope.$parent.calEvents);
				$timeout(maj, 1);
				scope.objIndex = -1;
				scope.dateDay.title = "";
				scope.dateDay.date = "";
				scope.afficherJour = false;
				scope.modifJour = false;

			}

			scope.supprimerEvent = function (index) {
				scope.$parent.events.splice(index, 1);
				scope.$parent.calEvents.splice(index, 1);
				$timeout(maj, 1);
			}

			/**********************/
			/* Gestion des plages */

			scope.showAddPlage = function () {
				$timeout(hide, 1);
				scope.dateDay.dateDebut = new Date();
				scope.dateDay.dateFin = angular.copy(scope.dateDay.dateDebut);
				scope.dateDay.dateFin.setDate(scope.dateDay.dateFin.getDate() + 7);
				scope.afficherPlage = !scope.afficherPlage;
			}

			scope.modifierPlageEvent = function (index) {
				var obj = scope.$parent.plagesEvents[index];
				if (obj.dateDebut == null || obj.dateDebut == "") {

				} else {
					/* Traitement date début */
					var objDate = obj.dateDebut;
					scope.dateDay.dateDebut = DateFactory.getDateStr(objDate);

					/* Traitement date fin */
					var objDate = obj.dateFin;
					scope.dateDay.dateFin = DateFactory.getDateStr(objDate);

					scope.afficherPlage = true;
					scope.dateDay.title = obj.title;

					scope.objIndex = index;
					scope.modifPlage = true;
				}
			}

			scope.addPlage = function (dateDay) {
				var nbJours = DateFactory.calculateNbDays(dateDay.dateDebut, dateDay.dateFin);

				if (nbJours.day != 0) {
					scope.$parent.plagesEvents.push({
						date : '',
						dateDebut: dateDay.dateDebut.getDate() + "/" + (dateDay.dateDebut.getMonth() + 1) + "/" + dateDay.dateDebut.getFullYear(),
						dateFin: dateDay.dateFin.getDate() + "/" + (dateDay.dateFin.getMonth() + 1) + "/" + dateDay.dateFin.getFullYear(),
						title: dateDay.title,
						color: '#5D4037',
						content: '<img class="image" src="' + photo +'">',
						class: '',
					});
					/* Ajouter dans le tableau d'events */
					for (var i = 0; i <= nbJours.day; i++) {
						var date = angular.copy(dateDay.dateDebut);
						date.setDate(date.getDate() + i);
						scope.$parent.calEvents.push({
							date: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(),
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
				scope.addPlage(scope.dateDay);
				scope.afficherPlage = false;
				if (Popover.affTableDays) {
					$timeout(showPopTableDays, 300);
					$timeout(hide, 1);
					Popover.changeAffTableDays();
				}
			}

			scope.supprimerPlageEvent = function (index) {
				scope.$parent.plagesEvents.splice(index, 1);
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

			var reInitJour = function () {
				scope.dateDay.date = new Date();
	    		scope.dateDay.title = "";
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