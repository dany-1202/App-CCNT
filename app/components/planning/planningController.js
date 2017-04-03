var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('planningController', function($timeout, $scope, moment, calendarConfig, $http, NotifService, $mdpTimePicker, $mdDialog) {
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
	
	$scope.showHeureDebutSer1 = function(ev, index) {
	 	$mdpTimePicker($scope.heureDebut1, {
	 		targetEvent: ev,
	 		parent: angular.element(document.body.parentElement)
	 	}).then(function(selectedDate) {
	 		if(selectedDate > $scope.heureFin1){
	 			var message = "L'heure d'ouverture est après celle de fermeture !";
   				var titre = "Erreur de configuration";
   				NotifService.error(titre, message);
	 		}else{
				$scope.heureDebut1 = selectedDate;
	 		};
	 	});
	};
	$scope.showHeureFinSer1 = function(ev, index) {
		
	 	$mdpTimePicker($scope.heureFin1, {
	 		targetEvent: ev,
	 		parent: angular.element(document.body.parentElement)
	 	}).then(function(selectedDate) {
	 		if(selectedDate < $scope.heureDebut1){
	 			var message = "L'heure de fermeture est avant celle d'ouverture !";
   				var titre = "Erreur de configuration";
   				NotifService.error(titre, message);
	 		}else if(selectedDate > $scope.heureDebut2){
	 			var message = "L'heure de fin de ce service est après la début du service suivant !";
   				var titre = "Erreur de configuration";
   				NotifService.error(titre, message);
	 		}else{
				$scope.heureFin1 = selectedDate;
	 		};
	 	});
	};
	$scope.showHeureDebutSer2 = function(ev, index) {
	 	$mdpTimePicker($scope.heureDebut2, {
	 		targetEvent: ev,
	 		parent: angular.element(document.body.parentElement)
	 	}).then(function(selectedDate) {
	 		if(selectedDate > $scope.heureFin2){
	 			var message = "L'heure d'ouverture est après celle de fermeture !";
   				var titre = "Erreur de configuration";
   				NotifService.error(titre, message);
	 		}else if(selectedDate < $scope.heureFin1){
	 			var message = "L'heure de début est avant la fermeture du service précédent !";
   				var titre = "Erreur de configuration";
   				NotifService.error(titre, message);
	 		}else{
				$scope.heureDebut2 = selectedDate;
	 		};
	 	});
	};
	$scope.showHeureFinSer2 = function(ev, index) {
	 	$mdpTimePicker($scope.heureFin2, {
	 		targetEvent: ev,
	 		parent: angular.element(document.body.parentElement)
	 	}).then(function(selectedDate) {
	 		if(selectedDate < $scope.heureDebut2){
	 			var message = "L'heure de fermeture est avant celle d'ouverture !";
   				var titre = "Erreur de configuration";
   				NotifService.error(titre, message);
	 		}else{
				$scope.heureFin2 = selectedDate;
	 		};
	 		
	 	});
	};
	
	
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