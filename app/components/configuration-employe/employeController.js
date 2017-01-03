var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('employeController', function($timeout, $rootScope, $scope, $http, $location, SessionService) {

	$scope.user = {};
  $scope.idUser = -1;
	$scope.user.configuration = SessionService.get('user_configured');

	$scope.employe = []; //Tableau contenant les employes

  $scope.getEmployes = function () {
    var data = {user_id : SessionService.get('user_id'), user_token: SessionService.get('user_token')};
    var $promise = $http.post('assets/php/getEmployeesAPI.php', data);
    $promise.then(function (message) {
      var tab = message.data;
      for (var i = 0; i < tab.length; i++) {
        var person = tab[i];
        $scope.employe.push({id:person.id,nom:person.nom,prenom:person.prenom,adresse:person.adresse,code:person.codePostal,localite:person.ville,mail:person.mail,dep:person.dep,dateIn:new Date(person.contrat.dateIn),dateOut:person.contrat.dateOut == null ? null: new Date (person.contrat.dateOut),horaire:person.contrat.horaire,particularite:person.contrat.particularite,contrat:person.contrat.type, dateNaissance: new Date(person.dateNaissance), telFixe: person.telFixe, telMobile: person.telMobile, genre: person.genre, adresseSup: person.adresseSup});
      }
    });
  }
  
  $scope.getEmployes();

  $scope.ajouterEmploye = function () {
    $rootScope.myEmp = null;
    $location.url("/employe/edition");
  }

  $scope.supEmploye = function(id) {
    //fonctionne : supression de l'utilisateur 
    $scope.employe.splice(id,1);
    // Supprimer de la base de données
    
  };

  $scope.modEmploye = function(id) {
    $rootScope.myEmp = $scope.employe[id];
    $location.url("/employe/edition");
  };

});
