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
})();