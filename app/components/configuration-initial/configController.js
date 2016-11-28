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
                                {id:1,name:'Nom'}, 
                                {id:2, name:'Adresse'},
                                {id:3, name:'Adresse Infos +'}, 
                                {id:4, name:'Tél. Réservation'},
                                {id:5, name:'Tél. Direction'},
                                {id:6, name:'Email'},
                                {id:7, name:'Site Web'},
                                {id:8, name:'Code Postal'},
                                {id:9, name:'Localité'},
                              ]; 

  var idDep = 4; // Id de départ
  var self = this; // Référence sur le contrôleur

  /* Change la vue du switch et met à jour les pourcentage pour l'étape */
  this.next = function(ev, no) {
    $scope.currentView = no;
    $scope.pourcentage += 20;
  }

  this.previous = function(ev, no) {
    $scope.currentView = no;
    $scope.pourcentage -= 20;
  }

  this.afficherHeure = function() {
    for (var i = 0; i < $scope.hours.length; i++) {
      console.log($scope.hours[i].day);
      console.log($scope.hours[i].journee.debut);
      console.log($scope.hours[i].journee.fin);
      console.log($scope.hours[i].pause.debut);
      console.log($scope.hours[i].pause.fin);
    };
  }

  this.test = function() {
    /*var data = {'nom': "Dep", 'noEta': "1"};
    var $res = $http.post("assets/php/insertDepartement.php", data);
    $res.then(function (message) {
      
      $location.path('/home');
      
    });*/
    $location.path('/home');
    NotifService.success("Configuration-Initial","Tout vos paramètres ont bien été enregistrés");
  }  
});