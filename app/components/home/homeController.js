var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('homeController', function($timeout, $rootScope, $scope, $http, $location, SessionService, $mdDialog, State, $route) {
	$scope.$route = $route;
	$scope.user = {};
	$scope.user.configuration = SessionService.get('user_configured');
	
	
	$scope.lancerConfigEmp = function () {
		$location.url("/employe");
	}
	
	$scope.envoyerMail = function () {
		console.log('ici');
		var $promise = $http.post('assets/php/sendEmailAPI.php', {'user_id': SessionService.get('user_id'), 'user_token': SessionService.get('user_token'), 'email' : 'vincent.jalley@hotmail.com'});
	
		$promise.then(function (message) {
			console.log(message.data);
		});
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