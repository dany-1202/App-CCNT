/**
* Module qui contient toutes les constantes de l'application. 
* Améliore le débug, car tout se trouve ici.
* Il faut le remplir au fur et à mesure de l'avancement de l'application
**/
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.constant("Const", {
	 /* Constantes Générales de l'application */
    "ANNULER" : "Annuler",
    "ADD" : "Ajouter",
	"MODIFY" : "Modifier",
	"DELETE" : "Supprimer",

	/* Constantes utilisé dans Config des horaires d'ouvertures */
    "OPEN": "Ouverture",
    "END": "Fermeture",
    "PAUSED": "Début",
    "PAUSEF": "Fin",

    /* Constantes utilisé dans Config des jours fériés et vacances*/
    "ADDDAY": "Ajouter un jour férié",
    "STOPADD": "Annuler l'insertion",
    "ADDPERIOD" : "Ajouter une période",

    /* Constantes utilisé dans Config des informations de l'établissement et horaires ouvertures */
    "CCNT1": 42,
    "CCNT2": 43.5,
    "CCNT3": 45,

    /* Constantes utilisé pour les messages de notifications */
    "CONFIG-INIT":"Configuration-Initiale",
    "CONFIG-SUCCESS" : "Tous vos paramètres ont bien été enregistrés",

    /* Constantes utilisé pour les messages d'erreur */
    "ERRORNAME" : "Le nom n'est pas correct!",
    "ERRORADRESS" : "L'adresse ne réponds pas aux critères!",
    "ERRORPHONE" : "Le numéro n'est pas correcte!",
    "ERROREMAIL" : "Email incorrect!",
    "ERRORURL" : "Url incorrect!",
    "ERRORPOST" : "Code Postal invalide!",
    "ERRORLOCATION" : "La Localité est incorrecte!",

})