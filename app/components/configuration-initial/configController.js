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
    var dataDepartement = {'nom': "Cuisine du chateau", 'noEta': "1"};
    var $res = $http.post("assets/php/insertDepartement.php", dataDepartement);
/* test de la modification d'un département
    var dataDepartement = {'nom': "Cuisine du chateau2", 'depNo': "1"};
    var $res = $http.post("assets/php/insertDepartement.php", dataDepartement);
*/
/*
    var dataEtablissement = {'nom': "Chateau du fromage", 'adresse': "fromage land", 'telReservation': "0222222222", 'telDirection': "2222222222", 'email': "fromage@gmail.com", 'siteWeb': "fromage.ch", 'adresseInfo': "+ de gout", 'codePostal': "1225", 'localite': "léaksdjfélk", 'nbHeure': "99"};
    var $res = $http.post("assets/php/insertDepartement.php", dataEtablissement);
*/
/*
    var dataPersonne = {'nom': "Joel", 'prenom': "DaSilva", 'mail': "joel@gmail.com", 'mdp': "d8afab9d9d21a8906b16cb6eec67643602f7ecff38bc8dba1921d01a7c852b607df225ba1a0274f79b5d1b92ee2c45b4363d8f1fc84ebfba9bd245cdbb13ad98", 'token': "", 'dateNaissance': "1992-05-31", 'adresse': "thonex whsh", 'infoSuppAdresse': "fr", 'codePostal': "1221", 'ville': "thonex", 'admin': "1", 'telFixe': "026591651", 'telMobile': "419841", 'depId': "1"};
    var $res = $http.post("assets/php/insertDepartement.php", dataDepartement);
*/
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