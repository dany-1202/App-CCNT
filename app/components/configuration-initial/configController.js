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

  $scope.nbHoursChosen = null;

  /* Définition des horaires de la semaine */
  $scope.hours = [
                    {id: 1, day: 'Lundi', journee : {debut: "Ouverture", fin: "Fermeture"}, pause: {existe: false, debut: "Début", fin:"Fin"}, nbHours : 0},
                    {id: 2, day: 'Mardi', journee : {debut: "Ouverture", fin: "Fermeture"}, pause: {existe: false, debut: "Début", fin:"Fin"}, nbHours : 0},
                    {id: 3, day: 'Mercredi', journee : {debut: "Ouverture", fin: "Fermeture"}, pause: {existe: false, debut: "Début", fin:"Fin"}, nbHours : 0},
                    {id: 4, day: 'Jeudi', journee : {debut: "Ouverture", fin: "Fermeture"}, pause: {existe: false, debut: "Début", fin:"Fin"}, nbHours : 0},
                    {id: 5, day: 'Vendredi', journee : {debut: "Ouverture", fin: "Fermeture"}, pause: {existe: false, debut: "Début", fin:"Fin"}, nbHours : 0},
                    {id: 6, day: 'Samedi', journee : {debut: "Ouverture", fin: "Fermeture"}, pause: {existe: false, debut: "Début", fin:"Fin"}, nbHours : 0},
                    {id: 7, day: 'Dimanche', journee : {debut: "Ouverture", fin: "Fermeture"}, pause: {existe: false, debut: "Début", fin:"Fin"}, nbHours : 0},
                  ]

  /* Définition des départements de l'établissement */
  $scope.depart = [
                    {id:1,name:'Cuisine', carre:'carre-1', format: 'label-carre-100'},
                    {id:2,name:'Salle', carre:'carre-2', format: 'label-carre-100'},
                    {id:3,name:'Bar', carre:'carre-3',format: 'label-carre-50'}
                  ]; //Tableau contenant les departement
  
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