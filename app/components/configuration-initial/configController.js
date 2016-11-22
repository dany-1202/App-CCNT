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
  $scope.pourcentage = 25;
  $scope.depart = [{id:1,name:'Cuisine'},{id:2,name:'Salle'},{id:3,name:'Bar'}]; //Tableau contenant les departement
  
  var idDep = 4; // Id de départ

  /* Change la vue du switch et met à jour les pourcentage pour l'étape */
  this.change = function(ev, no) {
    $scope.currentView = no;
    $scope.pourcentage += 25;
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
    var data = {'nom': "lfsdjljkjfsalk", 'noEta': "1"};
    var $res = $http.post("assets/php/insertDepartement.php", data);
    $res.then(function (message) {
      console.log(message);
    });
  }

  // Ajouter un departement au tableau 
   this.ajouterDepartement = function(){
      if ($scope.depart.length < 8) {
        $scope.depart.push({id:idDep,name:'Votre département'});
        idDep++;
      };
   }

   // Supression d'un departement qui se trouve dans le tableau
   this.supprimerDepartement = function(id){
      for (var i = 0; i < $scope.depart.length; i++) {
          if ($scope.depart[i].id == id) {
            $scope.depart.splice(i,1)
          };
      };
   }
});