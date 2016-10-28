var dialog= angular.module('ctrlCCNT');

dialog.controller('DeconnexionCtrl',function($scope, $mdDialog, Notification, $location, AuthenticationService) {
  $scope.status = '  ';
  $scope.customFullscreen = false;

  $scope.showConfirm = function(ev) {
    // Appending dialog to document.body to cover sidenav in docs app
    var confirm = $mdDialog.confirm()
          .title('Voulez-vous vraiment vous déconnecter ?')
          .ariaLabel('Déconnexion')
          .targetEvent(ev)
          .ok('Oui')
          .cancel('Non');

    $mdDialog.show(confirm).then(function() {
      AuthenticationService.logout();
      Notification.info('Déconnexion réussi');
    }, function() {});
  };
});