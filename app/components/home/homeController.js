(function(){
	var ctrlCCNT = angular.module('ctrlCCNT');

	ctrlCCNT.controller('homeController', function($timeout, $rootScope, $scope, $http, $location, SessionService, $mdDialog, State, $route) {
		$scope.$route = $route;

		$scope.lancerConfigEmp = function () {
			$location.url("/employe");
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
			.then(function(answer) {}, function() {});

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