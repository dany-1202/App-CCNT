var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('planningController', function($route, $timeout, $scope, moment, calendarConfig, $http, NotifService, $mdpTimePicker, $mdDialog) {
	$scope.$route = $route;
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
	$scope.motifAfficher = false
	$scope.absent1 = false;
	$scope.absent2 = false;
	$scope.nbPause = [];
	$scope.fabIsOpen = false;
	$scope.hidden = true;
	$scope.selectedMode = 'md-fling';
	$scope.selectedDirection = 'up';
	for (var nb = 0; nb <= 60; nb+=5) {
		$scope.nbPause.push({name: nb + ' minutes', value:nb});
	}

	
	$scope.$on('$destroy', function() {
     		calendarConfig.dateFormats.hour = originalFormat; // reset for other demos
     	});

	$scope.changeAb1 = function(){
		if($scope.absent1){$scope.absent1 = false;}else{$scope.absent1 = true;}

	};
	$scope.changeAb2 = function(){
		if($scope.absent2){$scope.absent2 = false;}else{$scope.absent2 = true;}

	};

});