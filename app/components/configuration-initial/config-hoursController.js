var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('config-hoursController', function($scope, $http, $location, $mdpDatePicker, $mdpTimePicker, NotifService, $injector) {
	 // Pour récupérer le $scope du parent $scope.$parent.$parent;

	/* Affiche le timePicker pour ouverture */
	this.showTimeJourneeDebut = function(ev, index) {
	 	$mdpTimePicker($scope.currentTime, {
	 		targetEvent: ev
	 	}).then(function(selectedDate) {
	 		$scope.$parent.$parent.hours[index].journee.debut = selectedDate;
	 	});
	}

	/* Affiche le timePicker pour fermeture */
	this.showTimeJourneeFin = function(ev, index) {
	 	$mdpTimePicker($scope.currentTime, {
	 		targetEvent: ev
	 	}).then(function(selectedDate) {
	 		$scope.$parent.$parent.hours[index].journee.fin = selectedDate;
	 	});
	}

	/* Affiche le timePicker pour la pause début  */
	this.showTimePauseDebut = function(ev, index) {
	 	$mdpTimePicker($scope.currentTime, {
	 		targetEvent: ev
	 	}).then(function(selectedDate) {
	 		$scope.$parent.$parent.hours[index].pause.debut = selectedDate;
	 	});
	}


	/* Affiche le timePicker pour la pause fin  */
	this.showTimePauseFin = function(ev, index) {
	 	$mdpTimePicker($scope.currentTime, {
	 		targetEvent: ev
	 	}).then(function(selectedDate) {
	 		$scope.$parent.$parent.hours[index].pause.fin = selectedDate;
	 	});
	}
});

