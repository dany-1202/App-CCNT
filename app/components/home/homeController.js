<<<<<<< HEAD
(function(){
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('homeController', function($timeout, $rootScope, $scope, $http, $location, SessionService, $mdDialog, State, $route) {
	$scope.$route = $route;
	$scope.user = {};
	$scope.user.configuration = angular.copy(SessionService.get('user_configured'));
	
	var user_confEmp = SessionService.get('user_confEmp');
	if (angular.isString($scope.user.configuration)) {
		if ($scope.user.configuration == 'false') {
			$scope.user.configemp = true;
		} else {
			if (angular.isString(user_confEmp)) {
				if (user_confEmp == 'false') {
					$scope.user.configemp = false;
				} else {
					$scope.user.configemp = true;
				}
			} else {
				$scope.user.configemp = user_confEmp;
			}
		}
	} else {
		if ($scope.user.configuration) {
			$scope.user.configemp = true;
		} else {
			if (angular.isString(user_confEmp)) {
				if (user_confEmp == 'false') {
					$scope.user.configemp = false;
				} else {
					$scope.user.configemp = true;
				}
			} else {
				$scope.user.configemp = user_confEmp;
			}
		}
	}
	//console.log($scope.confEmp);
	
	$scope.lancerConfigEmp = function () {
		$location.url("/employe");
	}
	
	$scope.envoyerMail = function () {
		console.log('envoyerMail');
		var $promise = $http.post('assets/php/sendEmailAPI.php', {'user_id': SessionService.get('user_id'), 'user_token': SessionService.get('user_token'), 'email' : 'vincent.jalley@gmail.com'});
	
		$promise.then(function (message) {
			console.log(message);
			console.log(message.data);
		});
	}
	
	if (SessionService.get('user_configured') == false) {
		console.log('test');
		$scope.confEmp = false;
	} else {
		$scope.confEmp = SessionService.get('user_configured');
	}

	$scope.lancerConfig = function (ev) {
		
		$mdDialog.show({
			controller: DialogController,
			templateUrl: 'app/components/home/tuto.html',
			parent: angular.element(document.body.parentElement),
			targetEvent: ev,
			clickOutsideToClose:false,
			fullscreen: false,
			openFrom : {top: -50,width: 30,height: 80},
			closeTo : {left: 1500}
		 })
		.then(function(answer) {
			$scope.status = 'You said the information was "' + answer + '".';
		}, function() {
			$scope.status = 'You cancelled the dialog.';
		});

		function DialogController(scope, $mdDialog) {
			scope.currentView = 1;
			scope.configTuto = State.getConfigTuto();

			scope.next = function () {
				scope.currentView += 1;
			}

			scope.precedent = function () {
				scope.currentView -= 1;
			}

			scope.hide = function() {
				$mdDialog.hide();
				State.changeFinishTuto();
				$location.url("/config-init");
			};

			scope.cancel = function() {
				$mdDialog.cancel();
				State.changeFinishTuto();
				$location.url("/config-init");
			};

			scope.answer = function(answer) {
				$mdDialog.hide(answer);
				State.changeFinishTuto();
				$location.url("/config-init");
			};
		};
	}
	
	
});
=======
(function(){
	var ctrlCCNT = angular.module('ctrlCCNT');

	ctrlCCNT.controller('homeController', function($timeout, $rootScope, $scope, $http, $location, SessionService, $mdDialog, State, $route) {
		$scope.$route = $route;
		$scope.user = {};
		$scope.user.configuration = angular.copy(SessionService.get('user_configured'));

		$('.ui.dropdown').dropdown();

		if (angular.isUndefined($rootScope.count)) {
			/*Morris.Donut({
				element: 'donut-example',
				data: [
				{label: "Download Sales", value: 12},
				{label: "In-Store Sales", value: 30},
				{label: "Mail-Order Sales", value: 20}
				]
			});
			Morris.Donut({
				element: 'donut-example1',
				data: [
				{label: "Download Sales", value: 12},
				{label: "In-Store Sales", value: 30},
				{label: "Mail-Order Sales", value: 20}
				]
			});
			Morris.Donut({
				element: 'donut-example2',
				data: [
				{label: "Download Sales", value: 12},
				{label: "In-Store Sales", value: 30},
				{label: "Mail-Order Sales", value: 20}
				]
			});*/
			/*
			Morris.Line({
				element: 'line-example',
				data: [
				{ y: '2006', a: 100, b: 90 },
				{ y: '2007', a: 75,  b: 65 },
				{ y: '2008', a: 50,  b: 40 },
				{ y: '2009', a: 75,  b: 65 },
				{ y: '2010', a: 50,  b: 40 },
				{ y: '2011', a: 75,  b: 65 },
				{ y: '2012', a: 100, b: 90 }
				],
				xkey: 'y',
				ykeys: ['a', 'b'],
				labels: ['Series A', 'Series B']
			});
			$rootScope.count = true;*/
		}

		var user_confEmp = SessionService.get('user_confEmp');
		if (angular.isString($scope.user.configuration)) {
			if ($scope.user.configuration == 'false') {
				$scope.user.configemp = true;
			} else {
				if (angular.isString(user_confEmp)) {
					if (user_confEmp == 'false') {
						$scope.user.configemp = false;
					} else {
						$scope.user.configemp = true;
					}
				} else {
					$scope.user.configemp = user_confEmp;
				}
			}
		} else {
			if ($scope.user.configuration) {
				$scope.user.configemp = true;
			} else {
				if (angular.isString(user_confEmp)) {
					if (user_confEmp == 'false') {
						$scope.user.configemp = false;
					} else {
						$scope.user.configemp = true;
					}
				} else {
					$scope.user.configemp = user_confEmp;
				}
			}
		}

		$scope.getHeuresBrut = function() {
			var data = {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token'),per_id : 11, dateDebut: '2017-01-01', dateFin: '2017-12-31', mois: 5, annee: 2017, eta_id: 2};
			var $res = $http.post('assets/php/getInfosSoldeHoraireEmployeeAPI.php', data);
			$res.then(function(value){
				console.log(value);
			}).then(function(error){
				console.log(error);
			});
		}

		$scope.lancerConfigEmp = function () {
			$location.url("/employe");
		}

		$scope.envoyerMail = function () {
			console.log('envoyerMail');
			var $promise = $http.post('assets/php/sendEmailAPI.php', {'user_id': SessionService.get('user_id'), 'user_token': SessionService.get('user_token'), 'email' : 'vincent.jalley@gmail.com'});

			$promise.then(function (message) {
				console.log(message);
				console.log(message.data);
			});
		}

		if (SessionService.get('user_configured') == false) {
			console.log('test');
			$scope.confEmp = false;
		} else {
			$scope.confEmp = SessionService.get('user_configured');
		}

		$scope.lancerConfig = function (ev) {

			$mdDialog.show({
				controller: DialogController,
				templateUrl: 'app/components/home/tuto.html',
				parent: angular.element(document.body.parentElement),
				targetEvent: ev,
				clickOutsideToClose:false,
				fullscreen: false,
				openFrom : {top: -50,width: 30,height: 80},
				closeTo : {left: 1500}
			})
			.then(function(answer) {
				$scope.status = 'You said the information was "' + answer + '".';
			}, function() {
				$scope.status = 'You cancelled the dialog.';
			});

			function DialogController(scope, $mdDialog) {
				scope.currentView = 1;
				scope.configTuto = State.getConfigTuto();

				scope.next = function () {
					scope.currentView += 1;
				}

				scope.precedent = function () {
					scope.currentView -= 1;
				}

				scope.hide = function() {
					$mdDialog.hide();
					State.changeFinishTuto();
					$location.url("/config-init");
				};

				scope.cancel = function() {
					$mdDialog.cancel();
					State.changeFinishTuto();
					$location.url("/config-init");
				};

				scope.answer = function(answer) {
					$mdDialog.hide(answer);
					State.changeFinishTuto();
					$location.url("/config-init");
				};
			};
<<<<<<< HEAD
		};
	}
	
	
});
>>>>>>> appCCNT
=======
		}


	});
>>>>>>> appCCNT
})();