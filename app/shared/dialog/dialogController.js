/**
* Module qui gérer les fenêtre dialog pour la déconnexion de l'utilisateur
* Ce module devra être généralisé afin qu'il gère toutes sortes de fenêtres modales
* 
**/
var dialog= angular.module('ctrlCCNT');

dialog.controller('DeconnexionCtrl',function($scope, $mdDialog, NotifService, $location, AuthenticationService) {
      $scope.status = '  ';
      $scope.customFullscreen = false; // Prend tout l'écran : non

      $scope.showConfirm = function(ev) {
            ev.preventDefault();
            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                  .title('Voulez-vous vraiment vous déconnecter ?')
                  .ariaLabel('Déconnexion')
                  .targetEvent(ev)
                  .ok('Oui') // Bouton Oui - veut se déconnecter
                  .cancel('Non')
                  .parent(angular.element(document.body.parentElement)); // Bouton Non - annulation
            $mdDialog.show(confirm).then(function() { // Si l'utilisateur clic sur Oui 
                  AuthenticationService.logout();
                  NotifService.success("Statut Connexion", "Déconnexion réussi !");
            }, function() {});
      };
});