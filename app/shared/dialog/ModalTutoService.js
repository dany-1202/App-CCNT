var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.service('ModalTuto', function ($mdDialog, $location, State) {
	/* Controller ModalTuto */
	function ModalTutoController(scope, $mdDialog) {
		scope.currentView = self.currentView;
		scope.configTuto = State.getConfigTuto();

		scope.next = function () {
			scope.currentView += 1;
		}

		scope.simple = function() {
			$mdDialog.hide();
			$location.url("/config-init");
		}

		scope.multiple = function(last) {
			if (scope.currentView == last) {
				$mdDialog.hide();
				return;
			}
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

	return {
		showModal : function(ev, currentView) {
			self.currentView = currentView;
			var aff = true;
			switch(currentView) {
				case 1:
					if (State.finishEsta) {$location.url("/config-init");return;}
					State.changeFinishEsta();
					break;
				case 2:
					aff = !State.finishDep;
					State.changeFinishDep();
					break;
				case 3:
					aff = !State.finishHours;
					State.changeFinishHours();
					break;
				case 9:
					aff = !State.finishHolidays;
					State.changeFinishHolidays();
					break;
			}
			if (aff) {
				$mdDialog.show({
					controller: ModalTutoController,
					templateUrl: 'app/components/home/tuto.html',
					parent: angular.element(document.body.parentElement.parentElement),
					targetEvent: ev,
					clickOutsideToClose:false,
					fullscreen: false,
					openFrom : {top: -50,width: 30,height: 80},
					closeTo : {left: 1500},
					multiple: true,
				})
				.then(function(answer) {}, function() {});
			}
		}
	}
});