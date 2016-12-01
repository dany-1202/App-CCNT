/**
* Module qui permet de gérer la parti de la configuration initial
* Qui va permettre de configurer l'établissement, les données seront donc stockés dans la base de données
* 
**/
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('configController', function($scope, $http, $location, $mdpDatePicker, $mdpTimePicker, NotifService) {
  
  $scope.currentDate = new Date(); // Récupère la date d'aujourd'hui
  $scope.currentView = 1; // Vue courante (1: Informations de l'établissement)
  $scope.pourcentage = 20; // Valeur de pourcentage, avancement des étapes

  /* Définition des horaires de la semaine */
  $scope.hours = [
                    {day: 'Lundi', journee : {debut: "Ouverture", fin: "Fermeture"}, pause: {existe: false, debut: "Début", fin:"Fin"}},
                    {day: 'Mardi', journee : {debut: "Ouverture", fin: "Fermeture"}, pause: {existe: false, debut: "Début", fin:"Fin"}},
                    {day: 'Mercredi', journee : {debut: "Ouverture", fin: "Fermeture"}, pause: {existe: false, debut: "Début", fin:"Fin"}},
                    {day: 'Jeudi', journee : {debut: "Ouverture", fin: "Fermeture"}, pause: {existe: false, debut: "Début", fin:"Fin"}},
                    {day: 'Vendredi', journee : {debut: "Ouverture", fin: "Fermeture"}, pause: {existe: false, debut: "Début", fin:"Fin"}},
                    {day: 'Samedi', journee : {debut: "Ouverture", fin: "Fermeture"}, pause: {existe: false, debut: "Début", fin:"Fin"}},
                    {day: 'Dimanche', journee : {debut: "Ouverture", fin: "Fermeture"}, pause: {existe: false, debut: "Début", fin:"Fin"}},
                  ]

  /* Définition des départements de l'établissement */
  $scope.depart = [{id:1,name:'Cuisine', carre:'carre-1'},{id:2,name:'Salle', carre:'carre-2'},{id:3,name:'Bar', carre:'carre-3'}]; //Tableau contenant les departement
  
  /* Tableau contenant les noms des champs de l'établissement */
  $scope.infoEtablissement = [  
                                {id:1, type: 'text', name:'Nom', value:null}, 
                                {id:2, type: 'text', name:'Adresse', value:null},
                                {id:3, type: 'text', name:'Adresse Infos +', value:null}, 
                                {id:4, type: 'tel', name:'Tél. Réservation', value:null},
                                {id:5, type: 'tel', name:'Tél. Direction', value:null},
                                {id:6, type: 'email', name:'Email', value:null},
                                {id:7, type: 'url', name:'Site Web', value:null},
                                {id:8, type: 'number', name:'Code Postal', value:null},
                                {id:9, type: 'text', name:'Localité', value:null},
                              ];
  $scope.selectedDates = [];

  var idDep = 4; // Id de départ
  var self = this; // Référence sur le contrôleur

  /* Change la vue du switch et met à jour les pourcentage pour l'étape */
  this.next = function(no) {
    $scope.currentView = no;
    $scope.pourcentage += 20;
  }

  this.previous = function(no) {
    $scope.currentView = no;
    $scope.pourcentage -= 20;
  }

  this.afficherHeure = function() {
    for (var i = 0; i < $scope.hours.length; i++) {
      console.log($scope.hours[i].day);
      console.log($scope.hours[i].journee.debut);
      console.log($scope.hours[i].journee.fin);
      console.log($scope.hours[i].pause.debut);
      console.log($scope.hsours[i].pause.fin);
    };
  }

  /* Description : Fonction de test pour les API php*/
  this.test = function() {
    //test de l'ajout d'un département
    /*var dataDepartement = {'nom': "Cuisine du chateau", 'noEta': "1"};
    var $res = $http.post("assets/php/insertDepartement.php", dataDepartement); */   
/*
    //test de la modification d'un département
    var dataDepartement2 = {'depNom': "Cuisine du chateau2", 'etaId': "1"};
    var $res = $http.post("assets/php/setDepartement.php", dataDepartement2);
*/

    //test de l'ajout d'un établissement
    var dataEtablissement = { 'nom': "Chateau du fromage", 
                              'adresse': "fromage land", 
                              'telReservation': "0222222222", 
                              'telDirection': "2222222222", 
                              'email': "fromage@gmail.com", 
                              'siteWeb': "fromage.ch", 
                              'adresseInfo': "plus de gout", 
                              'codePostal': "1225", 
                              'localite': "léaksdjfélk", 
                              'nbHeure': "99"};

    var $res = $http.post("assets/php/insertEtablissement.php", dataEtablissement);

/*
    var dataFermetureInfo = {'date': "1992-05-31", 'etaId': "1"};
    var $res = $http.post("assets/php/insertFermetureInfo.php", dataFermetureInfo);
*/
/*
    var dataInsertOuvertureInfo = {'jour': "lundi", 'debut': "2016-11-09 10:00:00", 'fin': "2016-11-09 12:00:00",'etaId': "1"};
    var $res = $http.post("assets/php/insertOuvertureInfo.php", dataInsertOuvertureInfo);
*/
/* 
    var dataPersonne = {'nom': "da Silva", 'prenom': "Joel", 'mail': "joel@gmail.com", 'mdp': "d8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98", 'token': "", 'dateNaissance': "1992-05-31", 'adresse': "thonex whsh", 'infoSuppAdresse': "fr", 'codePostal': "1221", 'ville': "thonex", 'admin': "1", 'telFixe': "026591651", 'telMobile': "419841", 'depId': "1", 'perGenre': "M"};
    var $res = $http.post("assets/php/insertPersonne.php", dataPersonne);
*/  
    /*var data = {'nom': "Dep", 'noEta': "1"};
    var $res = $http.post("assets/php/insertDepartement.php", data);
>>>>>>> refs/remotes/origin/appCCNT
    $res.then(function (message) {
      
      $location.path('/home');
      
    });*/
    $location.path('/home');
    NotifService.success("Configuration-Initial","Tout vos paramètres ont bien été enregistrés");
  }  
});