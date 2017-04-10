var ctrlCCNT = angular.module('ctrlCCNT');


ctrlCCNT.service('ChooseDaysModal', function($mdpTimePicker, Const, DateFactory, NotifService, $mdDialog) {
	var fillTimeDays = function (days, objHour) {
		console.log(objHour);
		for (var i = days.length - 1; i >= 0; i--) {
	 		if (days[i].chosen && days[i].day != objHour.day) { // Il a choisi ce jour pour reprendre les même horaires
	 			objHour[i].matin.debut = moment(objHour.matin.debut).add(objHour[i].id - objHour.id, 'days').toDate();
	 			objHour[i].soir.fin = moment(objHour.soir.fin).add(objHour[i].id - objHour.id, 'days').toDate();
	 			if (objHour.pause.existe) {
	 				objHour[i].matin.fin = moment(objHour.matin.fin).add(objHour[i].id - objHour.id, 'days').toDate();
	 				objHour[i].soir.debut = moment(objHour.soir.debut).add(objHour[i].id - objHour.id, 'days').toDate();;
	 			}
	 		}
		};
	}

	return {
		showChooseDays : function(ev, objHour) {
			$mdDialog.show({
		      	controller: chooseDaysController, // Je lui passe le contrôleur afin de gérer les actions dans la modale
		      	templateUrl: 'app/components/configuration-initial/config-hours/views/chooseDaysView.html',
		      	parent: angular.element(document.body), // Son parent (très important) - position, enfants, etc...
		      	targetEvent: ev,
		      	clickOutsideToClose:true,
		      	fullscreen: true, // Only for -xs, -sm breakpoints.
		    })
		    .then(function(days) {
				fillTimeDays(days, objHour); // Je met à jour les jours respectifs
		    }, function() { /* Annulation */ });
			
			/*****************************************************************************************\
					* Controleur de la modale *                        
			\*****************************************************************************************/
			function chooseDaysController($scope, $mdDialog) {
			  	$scope.days = [
					{day: 'Lundi', chosen : false},
                	{day: 'Mardi', chosen : false},
                	{day: 'Mercredi', chosen : false},
                	{day: 'Jeudi', chosen : false},
                	{day: 'Vendredi', chosen : false},
                   	{day: 'Samedi', chosen : false},
                	{day: 'Dimanche', chosen : false}
				];

		    	$scope.hide = function() {$mdDialog.hide();};

		    	$scope.cancel = function() {$mdDialog.cancel();};

		    	$scope.answer = function() {$mdDialog.hide($scope.days);}
		    	
		    	$scope.isChecked = function() {return allDaysChosen();};
			  	
		  	  	$scope.isIndeterminate = function() {return (countDaysChosen() > 0 && countDaysChosen() < $scope.days.length);};
		    	
		    	var allDaysChosen = function () {
		    		for (var i = 0; i < $scope.days.length; i++) {
		    			if (!$scope.days[i].chosen) {
		    				return false;
		    			}
		    		}
		    		return true;
		    	}
		    	
		    	var countDaysChosen = function () {
		    		var count = 0;
		    		for (var i = 0; i < $scope.days.length; i++) {
		    			if (!$scope.days[i].chosen) {
		    				count += 1;
		    			}
		    		}
		    		return count;
		    	}
		    	
		    	var changeAllDays = function (val) {
		    		for (var i = 0; i < $scope.days.length; i++) {
		    			$scope.days[i].chosen = val;
		    		}
		    	}
		    	
		    	$scope.toggleAll = function () {
				    changeAllDays(allDaysChosen());
		    	}
	    	
			};
		}
	}
});
