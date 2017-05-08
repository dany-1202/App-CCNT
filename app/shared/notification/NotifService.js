/**
* Module qui fournit un Service pour les Notifications
* Il est adapté pour un formatage bien défini, à l'avenir il se pourrait créer aussi 
* des méthodes qui reçoivent les délai et plus de paramètres afin de rendre le service très personnalisable
**/
var ctrlCCNT = angular.module('ctrlCCNT');

/**
* Création du service NotifService qui reprend Notification
* 
**/
ctrlCCNT.service('NotifService', function(Notification) {
	return {
		/* Fonction déjà faite pour les messages de la connexion */
		successCon : function () {
			Notification.success({message: "<p class='notifTexte'>Connexion réussi !</p>", delay: 3000, title: '<h3 class="notifTitre"><i class="fa fa-check"></i> Statut Connexion</h3>'});
		},
		errorCon : function () {
			Notification.error({message: "<p class='notifTexte'> Connexion échoué ! </p>", delay: 3000, title: '<h3 class="notifTitre"><i class="fa fa-exclamation-triangle"></i> Statut Connexion</h3>'});
		},
		warningCon : function () {
			Notification.warning({message: "<p class='notifTexte'> La connexion avec la base de donnée a échoué, Veuillez contacter l'administrateur </p>", title: '<h3 class="notifTitre"><i class="fa fa-exclamation-triangle"></i> Connexion Base de données</h3>'});
		},
		infoCon : function(nom) {
			Notification.info({message: "<p class='notifTexte'> Vous-êtes déjà connecté M." + nom + " !</p>", delay: 3000, title: '<h3 class="notifTitre"><i class="fa fa-info"></i> Statut Connexion</h3>'});
		},
		/* Fonction qui reçoivent en paramètre les messages et titres à afficher selon le type de notification */
		success : function (titre, message) {
			Notification.success({message: '<p class="notifTexte">' + message + '</p>', delay: 5000, title: '<h3 class="notifTitre"><i class="fa fa-check"></i> ' + titre + '</h3>'});
		},
		error : function(titre, message) {
			Notification.error({message: '<p class="notifTexte">' + message + '</p>', delay: 8000, title: '<h3 class="notifTitre"><i class="fa fa-exclamation-triangle"></i> ' + titre + '</h3>'});
		},
		warning : function(titre, message) {
			Notification.warning({message: '<p class="notifTexte">' + message + '</p>', delay: 8000, title: '<h3 class="notifTitre"><i class="fa fa-exclamation-triangle"></i> ' + titre + '</h3>'});
		}
	}
});