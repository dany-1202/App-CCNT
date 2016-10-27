var dialog= angular.module('myApp');

dialog.controller('DeconnexionCtrl',function($scope, $mdDialog) {
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
      window.location.href = '#/connexion';
    }, function() {});
  };
});