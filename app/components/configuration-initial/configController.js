/**
* Module qui permet de gérer la parti de la configuration initial
* Qui va permettre de configurer l'établissement, les données seront donc stockés dans la base de données
* 
**/
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('configController', function($rootScope, $mdDialog, $scope, $http, $location, $mdpDatePicker, $mdpTimePicker, SessionService, NotifService) {

   $scope.nbSteps = 4; // Nombre d'étapes de la configuration initiale
   $scope.nbPercentage = 25; // Pourcentage en fonction de l'avancement de la configuration 
   $scope.currentDate = new Date(); // Récupère la date d'aujourd'hui
   $scope.currentView = 1; // Vue courante (1: Informations de l'établissement)
   $scope.pourcentage = 25; // Valeur de pourcentage, avancement des étapes
   $scope.hoursCCNTChosen = 45; // Valeur heures soumis CCNT

   /* Savoir si c'est la première visite pour les afficher ou non les popovers : 
      - Si c'est la première fois les popovers sont à true sinon il passe à false
   */
   $rootScope.firstTimeEta = true;
   $rootScope.firstTimeDep = true;
   $rootScope.firstTimeHours = true;
   $rootScope.firstTimeFerm = true;
   
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

   /* Définition des informations nécessaires pour l'établissement */
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
   ]; // Tableau contenant les noms des champs de l'établissement

   $scope.ccntHeure = [
      {id:1,name:"42 Heures",value:42},
      {id:2,name:"43.5 Heures",value:43.5},
      {id:3,name:"45 Heures",value:45}
   ];

   $scope.selectedDates = [];
   $scope.plagesEvents = [];
   $scope.events = [];
   $scope.calEvents = [];

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

   var getDateStr = function (date) {
      var tabDate = date.split('/');
      return new Date(tabDate[1] + "/" + tabDate[0] + "/" + tabDate[2]);
   }

   this.saveConfiguration = function() {
      var dataEtablissement = { 
         'nom': $scope.infoEtablissement[0].value, 
         'adresse': $scope.infoEtablissement[1].value, 
         'telReservation': $scope.infoEtablissement[3].value, 
         'telDirection': $scope.infoEtablissement[4].value, 
         'email': $scope.infoEtablissement[5].value, 
         'siteWeb': $scope.infoEtablissement[6].value, 
         'adresseInfo': $scope.infoEtablissement[2].value, 
         'codePostal': $scope.infoEtablissement[7].value, 
         'localite': $scope.infoEtablissement[8].value, 
         'nbHeure': $scope.hoursCCNTChosen,
         'user_id' : SessionService.get('user_id'),
         'user_token' : SessionService.get('user_token')
      };

      var $res = $http.post("assets/php/insertEtablissementAPI.php", dataEtablissement);
      $res.then(function (message) {
         console.log(message);
         /* Insertion des horaires */ 
         var idEstablishment = message.data;
         var data = {
            'eta_id' : idEstablishment, 
            'user_id' : SessionService.get('user_id'), 
            'user_token': SessionService.get('user_token')
         };
         var $res = $http.post("assets/php/updatePersonneEstablishmentAPI.php", data);
         $res.then(function (message) {});
         for (var i = 0; i < $scope.hours.length; i++) {
            var obj = $scope.hours[i];
            if (obj.journee.debut != "Ouverture") {
               var dataInsertOuvertureInfo = {'jour': obj.day, 'debut': moment(obj.journee.debut).add(1, 'h').toDate(), 'fin': moment(obj.journee.fin).add(1, 'h').toDate(), 'pauseDebut': moment(obj.pause.debut).add(1, 'h').toDate(), 'pauseFin': moment(obj.pause.fin).add(1, 'h').toDate(), 'etaId': idEstablishment, 'user_id' : SessionService.get('user_id'), 'user_token' : SessionService.get('user_token')};
               var $res = $http.post("assets/php/insertOuvertureInfoAPI.php", dataInsertOuvertureInfo);
               $res.then(function (message) {});
            }
         } 
         /* Insertion des départements */
         for (var i = 0; i < $scope.depart.length; i++) {
            var obj = $scope.depart[i];
            var data = {'nom': obj.name, 'noEta': idEstablishment, 'user_id' : SessionService.get('user_id'), 'user_token' : SessionService.get('user_token')};
            var $res = $http.post("assets/php/insertDepartementAPI.php", data);
            $res.then(function (message) {console.log(message);});
         };

         /* Insertion des jours fériés et vacances */
         for (var i = 0; i < $scope.calEvents.length; i++) {
            var dataFermetureInfo = {
               'date': moment(getDateStr($scope.calEvents[i].date)).add(1, 'h').toDate(), 
               'etaId': idEstablishment, 'user_id' : SessionService.get('user_id'), 
               'user_token' : SessionService.get('user_token')
            };
            var $res = $http.post("assets/php/insertFermetureInfoAPI.php", dataFermetureInfo);
            $res.then(function (message) {console.log(message);});
         };
      });
      if ($rootScope.user != null) {$rootScope.user.config = true;}
      SessionService.set('user_configured', true);
      $location.path('/home');
      NotifService.success("Configuration-Initial","Tous vos paramètres ont bien été enregistrés");  
   }
});