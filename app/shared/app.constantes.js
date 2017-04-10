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
            "SAVE" : "Enregistrer",

            /* Constantes utilisé dans Config des informations de l'établissement */
            "NAME" : "Nom",
            "ADRESSE" : "Adresse 1",
            "ADRESSEPLUS" : "Adresse 2",
            "PHONERES" : "Tél. Réservation, exemple: 0228245715",
            "PHONEDIR" : "Tél. Direction, exemple: 0228245719",
            "EMAIL" : "Email",
            "URL" : "Site Web",
            "POST" : "Code Postale",
            "LOCATION" : "Localité",
            
            /* Icônes */
            "INAME" : "home",
            "IADRESSE" : "location",
            "IADRESSEPLUS" : "location",
            "IPHONERES" : "phone",
            "IPHONEDIR" : "phone",
            "IEMAIL" : "mail",
            "IURL" : "world",
            "IPOST" : "search",
            
            /* Constantes utilisé dans Home Controller */
            "TITLEESTA" : "Etape 1 - Informations Etablissement",
            "TITLEDEPS" : "Etape 2 - Départements",
            "TITLEHOURS" : "Etape 3 - Horaire d'ouverture",
            "TITLEHOLI" : "Etape 4 - Jours Fériés et Vacances",
            "PATH1" : "assets/img/Etablissement-CCNT.png",
            "PATH2" : "assets/img/Departement-Etape2.png",
            "PATH3" : "assets/img/Horaires-1.png",
            "PATH4" : "assets/img/Horaires-2.png",
            "PATH5" : "assets/img/Horaires-3.png",
            "PATH6" : "assets/img/Horaires-4.png",
            "PATH7" : "assets/img/Horaires-5.png",
            "PATH8" : "assets/img/Horaires-6.png",
            "PATH9" : "assets/img/JoursFermeture-Etape4-1.png",
            "PATH10" : "assets/img/JoursFermeture-Etape4-2.png",

            /* Constantes utilisé dans Config des horaires d'ouvertures */
            "OPEN": "Ouverture",
            "END": "Fermeture",
            "PAUSED": "Début",
            "PAUSEF": "Fin",
            "HORAIREBASE" : "Semaine de base",
            "TOUSLESJOURS" : "Tous les jours",
            "CERTAINSJOURS" : "Certains jours",
            "COMP" : "Complet",
            "INCOMP" : "Incomplet",
            "NEWHOR" : "Nouveau horaire",
            "CONTINUE" : "En Continue",
            "COUPURE" : "Avec Coupures",

            /* Constantes utilisé dans Config des jours fériés et vacances*/
            "ADDDAY": "Ajouter un jour férié",
            "STOPADD": "Annuler l'insertion",
            "ADDPERIOD" : "Ajouter une période",

            /* Constantes utilisé dans Config des informations de l'établissement et horaires ouvertures */
            "CCNT1": 42,
            "CCNT2": 43.5,
            "CCNT3": 45,

            /* Constantes utilisé pour les messages de notifications */
            "CONFIGINIT" : "Configuration-Initiale",
            "CONFIGSUCCESS" : "Tous vos paramètres ont bien été enregistrés",
            
            
            /* Constantes utilisé pour les messages de notifications */
            "TITLE_DELETE_HOUR" : "Suppression horaire",
            "MSG_DELETE_HOUR_SUCCESS" : "L'horaire a été supprimé avec succès",

            /* Constantes utilisé pour les messages d'erreur */
            "ERRORNAME" : "Le nom n'est pas correct!",
            "ERRORADRESS" : "L'adresse ne réponds pas aux critères!",
            "ERRORPHONE" : "Le numéro n'est pas correcte!",
            "ERROREMAIL" : "Email incorrect!",
            "ERRORURL" : "Url incorrect!",
            "ERRORPOST" : "Code Postal invalide!",
            "ERRORLOCATION" : "La Localité est incorrecte!",
            
            /* Couleurs */
            "COLORCONTINUE" : "#27ae60",
            "COLORCOUPURE" : "#428bca",
            
            /* Création de planning */
            "HOUR_OPEN" : "Heure début",
            "HOUR_END" : "Heure fin",
            
            /* Erreurs choix des heures création de planning */
            "TITLE_ERROR_CONFIG" : "Erreur de configuration",
            "MSG_OPEN_AFTER_END" : "L'heure d'ouverture est après celle de fermeture !",
            "MSG_END_BEFORE_OPEN" : "L'heure de fermeture est avant celle d'ouverture !",
            "MSG_FIN1_AFTER_OPEN2" : "L'heure de fin de ce service est après la début du service suivant !",
            "MSG_OPEN2_BEFORE_END1" : "L'heure de début est avant la fermeture du service précédent !",
            
            
            "TITLE_IMCOMPLETE_FIELDS" : "Champs incomplets",
            "MSG_FILL_FIELDS" : "Vous avez des champs qui sont incomplets, veuillez les remplir pour continuer !",
            "MSG_FILL_HOURS" : "Vous n'avez pas configurer votre horaire pour la semaine, veuillez remplir au moins un service (Matin ou Soir)!",
            

})