var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('employePassword', function($timeout, $rootScope, $scope, $http, $location, SessionService, NotifService, State, $route) {
    	$scope.$route = $route;

      /* Validation des mots de passes */
      $scope.enregistrer = function () {
              console.log($("#newPass").val());
              console.log($("#confPass").val());
              if($("#newPass").val() == $("#confPass").val()){
                console.log("LANCER L'API !!! ");
              }
      }
    });