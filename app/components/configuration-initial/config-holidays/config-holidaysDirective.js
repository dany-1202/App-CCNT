var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller()


ctrlCCNT.directive('configHolidays', function($mdpDatePicker, $mdDialog, $timeout, DateFactory, Popover) {
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
			scope.messageAjout = "Ajouter un jour férié";
			scope.messageEnlever = "Annuler l'insertion";
			scope.messageAjoutPlage = "Ajouter une période";
			scope.btnAdd = "Ajouter";
			scope.btnModif = "Modifier"; 

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
					scope.dateDay.date = getDateStr(objDate);

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
					scope.dateDay.dateDebut = getDateStr(objDate);

					/* Traitement date fin */
					var objDate = obj.dateFin;
					scope.dateDay.dateFin = getDateStr(objDate);

					scope.afficherPlage = true;
					scope.dateDay.title = obj.title;

					scope.objIndex = index;
					scope.modifPlage = true;
				}
			}

			scope.addPlage = function (dateDay) {
				var nbJours = scope.getNbJours(dateDay.dateDebut, dateDay.dateFin);

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

			/*******************/
			/* Divers méthodes */

			var getDateStr = function (date) {
				var tabDate = date.split('/');
				return new Date(tabDate[1] + "/" + tabDate[0] + "/" + tabDate[2]);
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

		    /* Faudrait externaliser cettre procédure en créant un service afin de pouvoir l'utiliser à volonté */
			scope.getNbJours = function (date1, date2) {
				var diff = {}                           // Initialisation du retour
			    var tmp = date2 - date1;
			 
			    tmp = Math.floor(tmp/1000);             // Nombre de secondes entre les 2 dates
			    diff.sec = tmp % 60;                    // Extraction du nombre de secondes
			 
			    tmp = Math.floor((tmp-diff.sec)/60);    // Nombre de minutes (partie entière)
			    diff.min = tmp % 60;                    // Extraction du nombre de minutes
			 
			    tmp = Math.floor((tmp-diff.min)/60);    // Nombre d'heures (entières)
			    diff.hour = tmp % 24;                   // Extraction du nombre d'heures
			     
			    tmp = Math.floor((tmp-diff.hour)/24);   // Nombre de jours restants
			    diff.day = tmp;
		     
		        return diff;
			}


/*
     $('#addDay').popover({
			    html: true,
			    title: 'Jour de fermeture',
			    placement: 'bottom',
			    content: '<button class="btn btn-default" id="click-me">Click Me!</button>'
			}).parent().on('click', '#click-me', function() {alert("click!");}); */

/*
			document.addEventListener('bicCalendarSelect', function(e) {
				var confirm = $mdDialog.confirm()
				.title('Voulez-vous ajouter une plage ?')
				.ariaLabel('Ajout de plage')
				.targetEvent(e)
				          .ok('Oui') // Bouton Oui - veut se déconnecter
				          .cancel('Non'); // Bouton Non - annulation

							    $mdDialog.show(confirm).then(function() { // Si l'utilisateur clic sur Oui 
							    	console.log("sauvegarder");
							    	var dateFirst = new moment(e.detail.dateFirst);
							    	var dateLast = new moment(e.detail.dateLast);
							    	console.log(e.detail.dateLast);
							    	console.log(e.detail.dateFirst);
							    }, function() {
							    	scope.$parent.events.push({
							    		date: e.detail.date,
							    		title: 'Test',
							    		color: '#5D4037',
							    		content: '<img class="image" src="http://a403.idata.over-blog.com/0/42/87/80/Divers/joyeux_noel.jpg">',
							    		class: '',
							    	});
							    	
							    });
							}); */




/* à rajouter ici (Fonctionne comme un contrôleur */
		// 	var date = moment().locale('fr').format('LL');
		// 	scope.currentDate = date;
		// 	scope.selectedDate = scope.$parent.selectedDate;
		// 	console.log(calendarConfig);

		// 	/* Ces deux variables doivent être définis sinon problème !! */
		//     scope.calendarView = 'month'; // Définit l'affichage par défaut en 'mois'
		//     scope.viewDate = new Date(); // Prend la date du jour

		//     /* Récupérer les données des personnes et créer ainsi les horaires  */
		//     scope.persons = [{nom: 'Baptiste Bartolomei'}, {nom: 'Joel Marques'}];

		//     var actions = [{
		//     	label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
		//     	onClick: function(args) {
		//     		alert.show('Deleted', args.calendarEvent);      
		//     	}
		//     }, {
		//     	label: '<i class=\'glyphicon glyphicon-remove\'></i>',
		//     	onClick: function(args) {
		//     		scope.events.splice(args.calendarEvent.calendarEventId, 1);
		//     	}
		//     }];

		//     /* Toutes les dates configurées */
		//     scope.events = [
		//     {
		//     	title: 'Baptiste Bartolomei',
		//     	color: calendarConfig.colorTypes.warning,
		//     	startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
		//     	endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
		//     	draggable: true,
		//     	resizable: true,
		//     	actions: actions
		//     }, {
		//     	title: 'Joel Marques',
		//     	color: calendarConfig.colorTypes.info,
		//     	startsAt: moment().subtract(1, 'day').toDate(),
		//     	endsAt: moment().add(5, 'days').toDate(),
		//     	draggable: true,
		//     	resizable: true,
		//     	actions: actions
		//     }, {
		//     	title: 'Vincent Jalley',
		//     	color: calendarConfig.colorTypes.important,
		//     	startsAt: moment().startOf('day').add(7, 'hours').toDate(),
		//     	endsAt: moment().startOf('day').add(19, 'hours').toDate(),
		//     	recursOn: 'year',
		//     	draggable: true,
		//     	resizable: true,
		//     	actions: actions
		//     }
		//     ];

		//     scope.cellIsOpen = true;

		//     scope.addEvent = function() {
		//     	scope.events.push({
		//     		title: 'Un employé',
		//     		startsAt: moment().startOf('day').toDate(),
		//     		endsAt: moment().endOf('day').toDate(),
		//     		color: calendarConfig.colorTypes.important,
		//     		draggable: true,
		//     		resizable: true
		//     	});
		//     };

		//     scope.eventClicked = function(event) {

		//     	var res = alert.show('Clicked', event);
		//     	console.log(res);
		//     };

		//     scope.eventEdited = function(event) {
		//     	alert.show('Edited', event);
		//     };

		//     scope.eventDeleted = function(event) {
		//     	alert.show('Deleted', event);
		//     };

		//     scope.eventTimesChanged = function(event) {
		//     	alert.show('Dropped or resized', event);
		//     };

		//     scope.toggle = function($event, field, event) {
		//     	$event.preventDefault();
		//     	$event.stopPropagation();
		//     	event[field] = !event[field];
		//     };

		//     scope.timespanClicked = function(date, cell) {
		// /*
		//       if (scope.calendarView === 'month') {
		//         if ((scope.cellIsOpen && moment(date).startOf('day').isSame(moment(scope.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
		//           scope.cellIsOpen = false;
		//         } else {
		//           scope.cellIsOpen = true;
		//           scope.viewDate = date;
		//         }
		//       } else if (scope.calendarView === 'year') {
		//         if ((scope.cellIsOpen && moment(date).startOf('month').isSame(moment(scope.viewDate).startOf('month'))) || cell.events.length === 0) {
		//           scope.cellIsOpen = false;
		//         } else {
		//           scope.cellIsOpen = true;
		//           scope.viewDate = date;
		//         }
		//     } */

		// 	};



			/*
			scope.showDatePicker = function(ev) {
				$mdpDatePicker(scope.currentDate, {
					targetEvent: ev
				}).then(function(selectedDate) {
					moment.lang('fr');
					scope.currentDate = moment(selectedDate).format('LL');
				});
}; */
},
}
});