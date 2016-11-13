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
      Notification.success({message: "<p class='notifTexte'>Déconnexion réussi !</p>", delay: 3000, title: '<h3 class="notifTitre"><i class="fa fa-check"></i> Statut Connexion</h3>'});
    }, function() {});
  };
});