/**
* Module qui gère la configuration par défaut du NotificationProvider du package angular-ui-notification
* 
**/
var ctrlCCNT = angular.module('ctrlCCNT');

/**
* Configuration du NotificationProvider du package angular-ui-notification
* Ici les valeurs par défaut sont définis donc à changer si il le faut !
**/
ctrlCCNT.config(function(NotificationProvider) {
      NotificationProvider.setOptions({
	      delay: 10000, // Le délai est mis à 10 secondes mais lorsque l'utilisateur clic il disparaît
	      startTop: 300, // La notification aparraît sur 300px après le top
	      startRight: 200, 
	      verticalSpacing: 50, // Espacement vertical
	      horizontalSpacing: 40, // Espacement Horizontal
	      maxCount: 1, // Il ne garde qu'un notification à la fois (à changer si il le faut)
	      positionX: 'center', // Les notifications sont centrés sur l'écran
	      positionY: 'top' // Les notifications sont centrés et au top
      });
});
