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
  $scope.showSpe = false; //


  $scope.ajouterEmploye = function () {
    $scope.idUser = -1;
    $location.url("/employe/edition");
  }

  $scope.supEmploye = function(id) {
    //fonctionne : supression de l'utilisateur 
    $scope.employe.splice(id,1);
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
