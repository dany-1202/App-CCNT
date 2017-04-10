var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('dateRangePicker', function ($timeout) {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) {
			$timeout(function(){
				$('#dateRange').daterangepicker({
				 	"showDropdowns": true,
    				"autoApply": true,
				    "showWeekNumbers": true,
				    "alwaysShowCalendars": true,
				    "startDate": scope.event.startsAt,
				    "endDate": scope.event.endsAt,
				    "parentEl": "#modalHoraireType",
				    "opens": "center",
				    "drops": "down",
				    "locale": {
				        "format": "MM/DD/YYYY",
				        "separator": " - ",
				        "applyLabel": "Appliquer",
				        "cancelLabel": "Annuler",
				        "fromLabel": "De",
				        "toLabel": "Jusqu'à",
				        "customRangeLabel": "Personnalisé",
				        "weekLabel": "S",
				        "daysOfWeek": [
				            "Di",
				            "Lu",
				            "Ma",
				            "Me",
				            "Je",
				            "Ve",
				            "Sa"
				        ],
				        "monthNames": [
				            "Janvier",
				            "Février",
				            "Mars",
				            "Avril",
				            "Mai",
				            "Juin",
				            "Juillet",
				            "Août",
				            "Septembre",
				            "Octobre",
				            "Novembre",
				            "Décembre"
				        ],
				        "firstDay": 1
					},
				}, function(start, end, label) {
					scope.event.startsAt = start.toDate();
					scope.event.endsAt = end.toDate();
				  	console.log("New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label + ')");
				});
			}, 0);
			
		}
	};
})