  var ctrlCCNT = angular.module('ctrlCCNT');

  ctrlCCNT.controller('homeController', function($timeout, $rootScope, $scope, $http, $location, SessionService, $mdDialog) {
  	
  	$scope.user = {};
  	$scope.user.configuration = SessionService.get('user_configured');

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

          scope.next = function () {
            scope.currentView += 1;
          }

          scope.precedent = function () {
            scope.currentView -= 1;
          }

			    scope.hide = function() {
  		      $mdDialog.hide();
  		    };

  		    scope.cancel = function() {
  		      $mdDialog.cancel();
  		    };

  		    scope.answer = function(answer) {
  		      $mdDialog.hide(answer);
  		    };
  		};

  	   $location.url("/config-init");

  	}

  		
  });
