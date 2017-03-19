var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('planningController', function($timeout, $scope, moment, calendarConfig, $http, NotifService, $mdpTimePicker) {
	$scope.affFiltre = false;
	$scope.affAddHoraire = false;
	var originalFormat = calendarConfig.dateFormats.hour;
	calendarConfig.dateFormats.hour = 'HH:mm';
	calendarConfig.displayAllMonthEvents = true;
 	calendarConfig.showTimesOnWeekView = true;
    $scope.heureDebut1 = 'Heure début';
    $scope.heureFin1 = 'Heure fin';
    $scope.heureDebut2 = 'Heure début';
    $scope.heureFin2 = 'Heure fin';
    $scope.absent1 = false;
    $scope.absent2 = false;
    $scope.nbPause = [];
	
	for (var nb = 0; nb <= 60; nb+=5) {
		$scope.nbPause.push({name: nb + ' minutes', value:nb});
	}
	
	$scope.showHeureDebutSer1 = function(ev, index) {
	 	$mdpTimePicker($scope.heureDebut1, {
	 		targetEvent: ev,
	 		parent: angular.element(document.body.parentElement)
	 	}).then(function(selectedDate) {
	 		$scope.heureDebut1 = selectedDate;
	 	});
	};
	$scope.showHeureFinSer1 = function(ev, index) {
		
	 	$mdpTimePicker($scope.heureFin1, {
	 		targetEvent: ev,
	 		parent: angular.element(document.body.parentElement)
	 	}).then(function(selectedDate) {
	 		$scope.heureFin1 = selectedDate;
	 	});
	};
	$scope.showHeureDebutSer2 = function(ev, index) {
	 	$mdpTimePicker($scope.heureDebut2, {
	 		targetEvent: ev,
	 		parent: angular.element(document.body.parentElement)
	 	}).then(function(selectedDate) {
	 		$scope.heureDebut2 = selectedDate;
	 	});
	};
	$scope.showHeureFinSer2 = function(ev, index) {
	 	$mdpTimePicker($scope.heureFin2, {
	 		targetEvent: ev,
	 		parent: angular.element(document.body.parentElement)
	 	}).then(function(selectedDate) {
	 		$scope.heureFin2 = selectedDate;
	 	});
	};
	
	
	$scope.$on('$destroy', function() {
     	calendarConfig.dateFormats.hour = originalFormat; // reset for other demos
	});

});