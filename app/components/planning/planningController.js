var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('planningController', function($timeout, $scope, moment, calendarConfig, $http, NotifService) {
	$scope.affFiltre = false;
	$scope.affAddHoraire = false;
	 var originalFormat = calendarConfig.dateFormats.hour;
    	calendarConfig.dateFormats.hour = 'HH:mm';
    	calendarConfig.displayAllMonthEvents = true;
     	calendarConfig.showTimesOnWeekView = true;
     	
	$scope.$on('$destroy', function() {
	     	calendarConfig.dateFormats.hour = originalFormat; // reset for other demos
    	});
});