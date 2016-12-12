/**
* Module qui permet de gérer la parti de la configuration initial
* Qui va permettre de configurer l'établissement, les données seront donc stockés dans la base de données
* 
**/
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('configController', function($rootScope, $scope, $http, $location, $mdpDatePicker, $mdpTimePicker, SessionService, NotifService) {
  $scope.nbSteps = 4;
  $scope.nbPercentage = 25;
  $scope.currentDate = new Date(); // Récupère la date d'aujourd'hui
  $scope.currentView = 1; // Vue courante (1: Informations de l'établissement)
  $scope.pourcentage = 25; // Valeur de pourcentage, avancement des étapes

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
                    {id:1,name:'Cuisine', carre:'carre-1', format: 'label-carre-100', error: false},
                    {id:2,name:'Salle', carre:'carre-2', format: 'label-carre-100', error: false},
                    {id:3,name:'Bar', carre:'carre-3',format: 'label-carre-50', error: false}
                  ]; //Tableau contenant les departement
  
  /* Tableau contenant les noms des champs de l'établissement */
  $scope.infoEtablissement = [  
                                {id:1, type: 'text', name:'Nom', value:"",min:2, max:40,error:false,message:"Le nom n'est pas correct!"}, 
                                {id:2, type: 'text', name:'Adresse', value:"",min:2, max:50,error:false,message:"L'adresse ne réponds pas aux critères!"},
                                {id:3, type: 'text', name:'Adresse Infos +', value:"",min:0, max:100,error:false,message:""}, 
                                {id:4, type: 'tel', name:'Tél. Réservation', value:"",min:10, max:10,error:false,message:"Le numéro n'est pas correcte!"},
                                {id:5, type: 'tel', name:'Tél. Direction', value:"",min:10, max:10,error:false,message:"Le numéro n'est pas correcte!"},
                                {id:6, type: 'email', name:'Email', value:"",min:6, max:30,error:false,message:"Email incorrect!"},
                                {id:7, type: 'text', name:'Site Web', value:"",min:0, max:30,error:false,message:"Url incorrect"},
                                {id:8, type: 'number', name:'Code Postal', value:"",min:4, max:4,error:false,message:"Code Postal invalide!"},
                                {id:9, type: 'text', name:'Localité', value:"",min:2, max:30,error:false,message:"La Localité est incorrecte!"},
                              ];
  $scope.ccntHeure = [
                        {id:1,name:"42 Heures",value:42,check:""},
                        {id:2,name:"43.5 Heures",value:43.5,check:""},
                        {id:3,name:"45 Heures",value:45,check:"checked"}
                      ];

  $scope.selectedDates = [];

  var self = this; // Référence sur le contrôleur

  /* Change la vue du switch et met à jour les pourcentage pour l'étape */
  this.next = function(no) {
    $scope.currentView = no;
    $scope.pourcentage += $scope.nbPercentage;
  }

  this.previous = function(no) {
    $scope.currentView = no;
    $scope.pourcentage -= $scope.nbPercentage;
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

  this.saveConfiguration = function() {

    var dataEtablissement = { 'nom': $scope.infoEtablissement[0].value, 
                            'adresse': $scope.infoEtablissement[1].value, 
                            'telReservation': $scope.infoEtablissement[3].value, 
                            'telDirection': $scope.infoEtablissement[4].value, 
                            'email': $scope.infoEtablissement[5].value, 
                            'siteWeb': $scope.infoEtablissement[6].value, 
                            'adresseInfo': $scope.infoEtablissement[2].value, 
                            'codePostal': $scope.infoEtablissement[7].value, 
                            'localite': $scope.infoEtablissement[8].value, 
                            'nbHeure': $scope.nbHoursChosen};

    var $res = $http.post("assets/php/insertEtablissement.php", dataEtablissement);
    $res.then(function (message) {
      /* Insertion des horaires */ 
      var idEstablishment = message.data;
      var data = {'eta_id' : idEstablishment, 'user_id' : SessionService.get('user_id')};
      var $res = $http.post("assets/php/updatePersonneEstablishment.php", data);
      $res.then(function (message) {});
      for (var i = 0; i < $scope.hours.length; i++) {
        var obj = $scope.hours[i];
        if (obj.journee.debut != "Ouverture") {
          var dataInsertOuvertureInfo = {'jour': obj.day, 'debut': moment(obj.journee.debut).add(1, 'h').toDate(), 'fin': moment(obj.journee.fin).add(1, 'h').toDate(), 'pauseDebut': moment(obj.pause.debut).add(1, 'h').toDate(), 'pauseFin': moment(obj.pause.fin).add(1, 'h').toDate(), 'etaId': idEstablishment};
          var $res = $http.post("assets/php/insertOuvertureInfo.php", dataInsertOuvertureInfo);
          $res.then(function (message) {});
        }
      } 
      /* Insertion des départements */
      for (var i = 0; i < $scope.depart.length; i++) {
        var obj = $scope.depart[i];
        var data = {'nom': obj.name, 'noEta': idEstablishment};
        var $res = $http.post("assets/php/insertDepartement.php", data);
        $res.then(function (message) {});
      };

      /* Insertion des jours fériés et vacances */
      for (var i = 0; i < $scope.selectedDates.length; i++) {
        var dataFermetureInfo = {'date': moment($scope.selectedDates[i] ).add(1, 'h').toDate(), 'etaId': idEstablishment};
        var $res = $http.post("assets/php/insertFermetureInfo.php", dataFermetureInfo);
        $res.then(function (message) {});
      };
    });
    console.log($rootScope);
    if ($rootScope.user != null) {
      $rootScope.user.config = true;
    }
    SessionService.set('user_configured', true);
    $location.path('/home');
    NotifService.success("Configuration-Initial","Tout vos paramètres ont bien été enregistrés");  
  }

});