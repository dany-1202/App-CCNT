var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller()


ctrlCCNT.directive('configHolidays', function($mdpDatePicker, $mdDialog, $timeout) {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-holidays/config-holidaysView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		link: function(scope, element, attrs) {

			var monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

			var dayNames = ["L", "M", "M", "J", "V", "S", "D"];

			scope.afficherJour = false;
			scope.dateDay = new Date();
			console.log(scope.dateDay);

			scope.addDayClose = function () {
				scope.addDay(scope.dateDay);
				scope.afficherJour = false;
			}

			scope.addDay = function (date) {
				console.log(date);
				scope.$parent.events.push({
					date: date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(),
					title: 'Test',
					color: '#5D4037',
					content: '<img class="image" src="http://a403.idata.over-blog.com/0/42/87/80/Divers/joyeux_noel.jpg">',
					class: '',
				});
				console.log(scope);
				$timeout(maj, 10);
			}

			var maj = function () {
				$('#calendari_lateral1').empty();
				$('#calendari_lateral1').bic_calendar({
	          //list of events in array
		          events: scope.$parent.events,
		          //enable select
		          enableSelect: true,
		          //enable multi-select
		          multiSelect: true,
		          //set day names
		          dayNames: dayNames,
		          //set month names
		          monthNames: monthNames,
		          //show dayNames
		          showDays: true,
		          //set ajax call
	      		});
			}


			$('#calendari_lateral1').bic_calendar({
	          //list of events in array
	          events: scope.$parent.events,
	          //enable select
	          enableSelect: true,
	          //enable multi-select
	          multiSelect: true,
	          //set day names
	          dayNames: dayNames,
	          //set month names
	          monthNames: monthNames,
	          //show dayNames
	          showDays: true,
	          //set ajax call
	      	});

			scope.showDatePickerJour = function(ev) {
				$mdpDatePicker(scope.currentDate, {
					targetEvent: ev
				}).then(function(selectedDate) {
					scope.currentDate = moment(selectedDate);
					scope.addDay(selectedDate);
				});
			};




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