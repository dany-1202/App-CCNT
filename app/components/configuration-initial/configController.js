/**
* Module qui permet de gérer la parti de la configuration initial
* Qui va permettre de configurer l'établissement, les données seront donc stockés dans la base de données
* 
**/
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('configController', function($scope, $http, $location, $mdpDatePicker, $mdpTimePicker, NotifService) {
  /* à mettre ce qu'on veut */
  $scope.currentDate = new Date();
  $scope.currentView = 1;
  $scope.pourcentage = 20;

  /* Définition des horaires de la semaine */
  $scope.hours = [
                    {day: 'lundi', journee : {debut: null, fin: null}, pause: {debut: null, fin:null}},
                    {day: 'mardi', journee : {debut: null, fin: null}, pause: {debut: null, fin:null}},
                    {day: 'mercredi', journee : {debut: null, fin: null}, pause: {debut: null, fin:null}},
                    {day: 'jeudi', journee : {debut: null, fin: null}, pause: {debut: null, fin:null}},
                    {day: 'vendredi', journee : {debut: null, fin: null}, pause: {debut: null, fin:null}},
                    {day: 'samedi', journee : {debut: null, fin: null}, pause: {debut: null, fin:null}},
                    {day: 'dimanche', journee : {debut: null, fin: null}, pause: {debut: null, fin:null}},
                 ]

  /* Définition des départements de l'établissement */
  $scope.depart = [{id:1,name:'Cuisine', carre:'carre-1'},{id:2,name:'Salle', carre:'carre-2'},{id:3,name:'Bar', carre:'carre-3'}]; //Tableau contenant les departement
  
    $scope.infoEtablissement = [  {id:1,name:'Nom'}, 
                {id:2, name:'Adresse'},
                {id:3, name:'Adresse plus'}, 
                {id:4, name:'telReservation'},
                {id:5, name:'telDirection'},
                {id:6, name:'email'},
                {id:7, name:'siteWeb'},
                {id:8, name:'codePostal'},
                {id:9, name:'localite'},
                {id:10, name:'nbHeure'}
  ]; // Tableau contenant les noms des champs de l'établissement

  var idDep = 4; // Id de départ
  var self = this; // Référence sur le contrôleur
  var CARRE = "carre-";

  /* Change la vue du switch et met à jour les pourcentage pour l'étape */
  this.next = function(ev, no) {
    $scope.currentView = no;
    $scope.pourcentage += 20;
  }

  this.previous = function(ev, no) {
    $scope.currentView = no;
    $scope.pourcentage -= 20;
  }

  /* Affiche le timePicker pour ouverture */
	this.showTimePicker = function(ev) {
    	$mdpTimePicker($scope.currentTime, {
        targetEvent: ev
      }).then(function(selectedDate) {
        $scope.currentTime = selectedDate;
      });;
  }

   /* Affiche le timePicker pour fermeture */
   this.showTimePicker2 = function(ev) {
    	$mdpTimePicker($scope.currentTime2, {
        targetEvent: ev
      }).then(function(selectedDate) {
        $scope.currentTime2 = selectedDate;
      });;
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

  // Ajouter un departement au tableau depuis la div visuel des départements
  this.ajouterDepartementTab = function(event){
    if ($(event.target).get(0).nodeName=="SPAN") {return;}
    if ($(event.target).hasClass("transparence")) {
      $(event.target).toggleClass("transparence");
      self.ajouterDepartement();
    } 
    console.log($scope.depart[0].name);
  }

  // Ajouter un département au tableau depuis le bouton ajouter département
  this.ajouterDepartement = function(event){
    if ($scope.depart.length < 4) {
      if ($scope.depart.length == 3) {idDep = 4};
      if ($scope.depart.length == 2) {idDep = 3};
      if ($scope.depart.length == 1) {idDep = 2};
      if ($scope.depart.length == 0) {idDep = 1};
    }
    if ($scope.depart.length < 8) {
      $scope.depart.push({id:idDep,name:'Votre département', carre:CARRE + idDep});
      var el = document.getElementById(CARRE + idDep);
      if ($(el).hasClass("transparence")) {
        $(el).toggleClass("transparence");
      }
      idDep++;
    };
  }

  // Supression d'un departement qui se trouve dans le tableau
  this.supprimerDepartement = function(event, id){
    for (var i = 0; i < $scope.depart.length; i++) {
        if ($scope.depart[i].id == id) {
          $scope.depart[i].name = "";
          $scope.depart.splice(i,1);
        };
    };
    var el = document.getElementById(CARRE + id);
    if (!$(el).hasClass("transparence")) {
      $(el).toggleClass('transparence');
    }
  }
});