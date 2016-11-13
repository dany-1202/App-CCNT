var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('homeController', function($scope, $http, $location) {
  $scope.lancerConfig = function () {
    $location.url("/config-init");
  }
});
