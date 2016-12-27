var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('employeController', function($timeout, $rootScope, $scope, $http, $location, SessionService) {
	
	$scope.user = {};
  $scope.idUser = -1;
	$scope.user.configuration = SessionService.get('user_configured');

  $scope.dep = [
                    {name:"Bar"},{name:'Cuisine'},{name:'Salle'}
                    ];
  $scope.monDep = $scope.dep[0];

  $scope.horaire = [
                    {name:"A l heure"},{name:'Mensuel'},{name:'Spécial'},{name:'Cadre'}
                    ];
  $scope.monHoraire = $scope.horaire[0];

  $scope.pourcentage = [
                    {name:"20%",value:0.20},{name:"25%",value:0.25},{name:"30%",value:0.30},{name:"35%",value:0.35},{name:"40%",value:0.40},
                    {name:"45%",value:0.45},{name:"50%",value:0.50},{name:"55%",value:0.55},{name:"60%",value:0.60},{name:"65%",value:0.65},
                    {name:"70%",value:0.70},{name:"75%",value:0.75},{name:"80%",value:0.80},{name:"85%",value:0.85},{name:"90%",value:0.90},
                    {name:"95%",value:0.95},{name:"100%",value:1.0},
                    ];
  $scope.monPourc = $scope.pourcentage[0];

  $scope.contrat = [
                    {name:"Normal"},{name:'Apprentissage'},{name:'Personne externe'}
                    ];
  $scope.monContrat = $scope.contrat[0];

	$scope.employe = [
                    {id:1,nom:'Gomes', prenom:'Dany',adresse:'ch. des beaux-champs 5C',code:1234,localite:'Vessy',mail:'dany@gmail.com' ,dep: 'Bar',dateIn:null,dateOut:null,horaire:null,particularite:null,contrat:null},
                    {id:2,nom:'Jalley', prenom:'Vincent',adresse:'ch. des beaux-champs 5C',code:1222,localite:'Vessy',mail:'vincent@gmail.com' ,dep: 'Cuisine'},
                    {id:3,nom:'Da Silva', prenom:'Joel',adresse:'ch. des beaux-champs 5C',code:1212,localite:'Vessy',mail:'joel@gmail.com' ,dep: 'Salle'}
                  ]; //Tableau contenant les employes

  $scope.showMen = false; // savoir si on doit afficher champs mensuel
  $scope.showSpe = false; // Savoir si on doit afficher champs spécial

  $scope.nbHeure = 0; // nb d'heure spécifier dans le champs 

  $scope.ajouterEmploye = function () {
    $scope.myEmp = null;
    $rootScope.test = true;
    $location.url("/employe/edition");
  }

  $scope.retour = function () {
    $location.url("/employe");
  }

  $scope.supEmploye = function(id) {
    //fonctionne : supression de l'utilisateur 
    $scope.employe.splice(id,1);
  };

  $scope.modEmploye = function(id) {
    $scope.myEmp = $scope.employe[id];
    $location.url("/employe/edition");
  };

  $scope.changementHoraire = function(){
    if($scope.monHoraire.name == "Mensuel"){
      $scope.showMen = true; 
      $scope.showSpe = false;
    }else if($scope.monHoraire.name == "Spécial"){
      $scope.showMen = false; 
      $scope.showSpe = true;
    }else {
      $$scope.showMen = false; 
      $scope.showSpe = false;
    };
    
  };

});
