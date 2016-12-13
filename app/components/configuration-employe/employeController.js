var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('employeController', function($timeout, $rootScope, $scope, $http, $location, SessionService) {
	
	$scope.user = {};
	$scope.user.configuration = SessionService.get('user_configured');

	$scope.employe = [
                    {id:1,nom:'Gomes', prenom:'Dany',adresse:'ch. des beaux-champs 5C',code:1234,localite:'Vessy',mail:'dany@gmail.com' ,dep: 'Bar'},
                    {id:2,nom:'Jalley', prenom:'Vincent',adresse:'ch. des beaux-champs 5C',code:1222,localite:'Vessy',mail:'vincent@gmail.com' ,dep: 'Cuisine'},
                    {id:3,nom:'Da Silva', prenom:'Joel',adresse:'ch. des beaux-champs 5C',code:1212,localite:'Vessy',mail:'joel@gmail.com' ,dep: 'Salle'}
                  ]; //Tableau contenant les employes

  $scope.ajouterEmploye = function () {
    $location.url("/employe/edition");
  }
});
