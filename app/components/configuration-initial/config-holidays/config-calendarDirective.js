var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configCalendar', function() {
	return {
		restrict : "E",
		transclude : true,
		templateUrl : "app/components/configuration-initial/config-holidays/config-calendarView.html",
		link : function(scope, attrs, elements) {
			scope.dayFormat = "d";

			var date = new Date();
			scope.year = date.getFullYear();
			scope.selectedDate = scope.$parent.selectedDates;
			scope.month = date.getMonth();
			/*
			if (scope.selectedDate.length > 0) {
					for (var i = 0; i < scope.selectedDate.length; i++) {
							//$(...).toggleClasse('active');
					};
			}*/
			scope.holidays = [
				{mois : '1', jour: '1', nom :"Nouvel an"},
				{mois : '8', jour: '1', nom :"Fête Nationale Suisse"},
				{mois : '12', jour: '24', nom :"Réveillon de Noël"},
				{mois : '12', jour: '25', nom :"Noël"},
				{mois : '12', jour: '31', nom :"Réveillon de Nouvel an"}
			];
			scope.firstDayOfWeek = 1; // First day of the week, 0 for Sunday, 1 for Monday, etc.


			scope.setDirection = function(direction) {
				scope.direction = direction;
				scope.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
			};

			scope.dayClick = function(date) {
				scope.$parent.selectedDates.push(date);
			};

			scope.prevMonth = function(data) {
				scope.msg = "You clicked (prev) month " + data.month + ", " + data.year;
			};

			scope.nextMonth = function(data) {
				scope.msg = "You clicked (next) month " + data.month + ", " + data.year;
			};

			scope.tooltips = false;
			
			scope.setDayContent = function(date) {
				var texte = "";
				for (var i = 0; i < scope.holidays.length; i++) {
					if (scope.holidays[i].mois == date.getMonth()+1 && scope.holidays[i].jour == date.getDate()){
						texte = scope.holidays[i].nom;
					}
				};
				return "<p><strong>" +  texte + "</strong></p>";
			};
			
		}, // Fin  du link
	}; // Fin du return
}) // Fin de la directive

/*****************************************************************************************\
		* Configuration du thème *                        
\*****************************************************************************************/

ctrlCCNT.config(function($mdThemingProvider) {
	$mdThemingProvider
		.theme("default")
		.primaryPalette("brown")
		.accentPalette("light-green");
});



