var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('employeController', function($timeout, $rootScope, $scope, $http, $location, SessionService) {

	$scope.user = {};
  $scope.idUser = -1;
	$scope.user.configuration = SessionService.get('user_configured');

	$scope.employe = [
                    {id:1,nom:'Gomes', prenom:'Dany',adresse:'ch. des beaux-champs 5C',code:1234,localite:'Vessy',mail:'dany@gmail.com' ,dep: 'Bar',dateIn:'24-01-2015',dateOut:null,horaire:"Mensuel",particularite:0.70,contrat:"Apprentissage"},
                    {id:2,nom:'Jalley', prenom:'Vincent',adresse:'ch. des beaux-champs 5C',code:1222,localite:'Vessy',mail:'vincent@gmail.com' ,dep: 'Cuisine',dateIn:'24-01-2015',dateOut:null,horaire:"Spécial",particularite:15,contrat:"Apprentissage"},
                    {id:3,nom:'Da Silva', prenom:'Joel',adresse:'ch. des beaux-champs 5C',code:1212,localite:'Vessy',mail:'joel@gmail.com' ,dep: 'Salle',dateIn:'24-01-2015',dateOut:null,horaire:"Mensuel",particularite:0.70,contrat:"Apprentissage"}
                  ]; //Tableau contenant les employes

  $scope.ajouterEmploye = function () {
    $rootScope.myEmp = null;
    $location.url("/employe/edition");
  }

  $scope.supEmploye = function(id) {
    //fonctionne : supression de l'utilisateur 
    $scope.employe.splice(id,1);
  };

  $scope.modEmploye = function(id) {
    $rootScope.myEmp = $scope.employe[id];
    $location.url("/employe/edition");
  };

});
