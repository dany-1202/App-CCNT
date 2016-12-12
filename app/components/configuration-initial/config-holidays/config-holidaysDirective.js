var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configHolidays', function($mdpDatePicker, calendarConfig) {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-holidays/config-holidaysView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		link: function(scope, element, attrs, alert) {
			/* à rajouter ici (Fonctionne comme un contrôleur */
			var date = moment().locale('fr').format('LL');
			scope.currentDate = date;
			scope.selectedDate = scope.$parent.selectedDate;
			console.log(calendarConfig);

			/* Ces deux variables doivent être définis sinon problème !! */
		    scope.calendarView = 'month'; // Définit l'affichage par défaut en 'mois'
		    scope.viewDate = new Date(); // Prend la date du jour

		    /* Récupérer les données des personnes et créer ainsi les horaires  */
		    scope.persons = [{nom: 'Baptiste Bartolomei'}, {nom: 'Joel Marques'}];

		    var actions = [{
		    	label: '<i class=\'glyphicon glyphicon-pencil\'></i>',
		    	onClick: function(args) {
		    		alert.show('Deleted', args.calendarEvent);      
		    	}
		    }, {
		    	label: '<i class=\'glyphicon glyphicon-remove\'></i>',
		    	onClick: function(args) {
		    		scope.events.splice(args.calendarEvent.calendarEventId, 1);
		    	}
		    }];

		    /* Toutes les dates configurées */
		    scope.events = [
		    {
		    	title: 'Baptiste Bartolomei',
		    	color: calendarConfig.colorTypes.warning,
		    	startsAt: moment().startOf('week').subtract(2, 'days').add(8, 'hours').toDate(),
		    	endsAt: moment().startOf('week').add(1, 'week').add(9, 'hours').toDate(),
		    	draggable: true,
		    	resizable: true,
		    	actions: actions
		    }, {
		    	title: 'Joel Marques',
		    	color: calendarConfig.colorTypes.info,
		    	startsAt: moment().subtract(1, 'day').toDate(),
		    	endsAt: moment().add(5, 'days').toDate(),
		    	draggable: true,
		    	resizable: true,
		    	actions: actions
		    }, {
		    	title: 'Vincent Jalley',
		    	color: calendarConfig.colorTypes.important,
		    	startsAt: moment().startOf('day').add(7, 'hours').toDate(),
		    	endsAt: moment().startOf('day').add(19, 'hours').toDate(),
		    	recursOn: 'year',
		    	draggable: true,
		    	resizable: true,
		    	actions: actions
		    }
		    ];

		    scope.cellIsOpen = true;

		    scope.addEvent = function() {
		    	scope.events.push({
		    		title: 'Un employé',
		    		startsAt: moment().startOf('day').toDate(),
		    		endsAt: moment().endOf('day').toDate(),
		    		color: calendarConfig.colorTypes.important,
		    		draggable: true,
		    		resizable: true
		    	});
		    };

		    scope.eventClicked = function(event) {

		    	var res = alert.show('Clicked', event);
		    	console.log(res);
		    };

		    scope.eventEdited = function(event) {
		    	alert.show('Edited', event);
		    };

		    scope.eventDeleted = function(event) {
		    	alert.show('Deleted', event);
		    };

		    scope.eventTimesChanged = function(event) {
		    	alert.show('Dropped or resized', event);
		    };

		    scope.toggle = function($event, field, event) {
		    	$event.preventDefault();
		    	$event.stopPropagation();
		    	event[field] = !event[field];
		    };

		    scope.timespanClicked = function(date, cell) {
		/*
		      if (scope.calendarView === 'month') {
		        if ((scope.cellIsOpen && moment(date).startOf('day').isSame(moment(scope.viewDate).startOf('day'))) || cell.events.length === 0 || !cell.inMonth) {
		          scope.cellIsOpen = false;
		        } else {
		          scope.cellIsOpen = true;
		          scope.viewDate = date;
		        }
		      } else if (scope.calendarView === 'year') {
		        if ((scope.cellIsOpen && moment(date).startOf('month').isSame(moment(scope.viewDate).startOf('month'))) || cell.events.length === 0) {
		          scope.cellIsOpen = false;
		        } else {
		          scope.cellIsOpen = true;
		          scope.viewDate = date;
		        }
		    } */

			};



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