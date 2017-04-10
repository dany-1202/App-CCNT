var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('employeController', function($timeout, $rootScope, $scope, $http, $location, SessionService, NotifService, State, $route) {
    	$scope.$route = $route;

      $scope.user = {};
      $scope.idUser = -1;
      $scope.user.configuration = SessionService.get('user_configured');
      console.log(SessionService.get('user_confEmp'));
  
      
      
      var data = {user_id : SessionService.get('user_id'), user_token: SessionService.get('user_token')};
      
      $scope.employe = []; //Tableau contenant les employes
      
     

      $scope.getEmployes = function () {
            var $promise = $http.post('assets/php/getEmployeesAPI.php', data);
            $promise.then(function (message) {
              console.log(message);
                  var tab = message.data;
                  	for (var i = 0; i < tab.length; i++) {
                  		var person = tab[i];
                  		$scope.employe.push({
                               	id:person.id,nom:person.nom,prenom:person.prenom,
                              	adresse:person.adresse,code:person.codePostal,
                                localite:person.ville,mail:person.mail,dep:person.dep,
                                dateIn:person.contrat.dateIn == null ? null: new Date (person.contrat.dateIn),
                                dateOut:person.contrat.dateOut == null ? null: new Date (person.contrat.dateOut),
                                horaire:person.contrat.horaire,particularite:person.contrat.particularite,contrat:person.contrat.type, 
                                dateNaissance: new Date(person.dateNaissance), telFixe: person.telFixe, telMobile: person.telMobile, 
                                genre: person.genre, adresseSup: person.adresseSup
                         	});
                  	}
            });
      }

      $scope.getEmployes();

      /* Ajout d'une personne */
      $scope.ajouterEmploye = function () {
        	$rootScope.myEmp = null;
        	$location.url("/employe/edition");
      }

      /* Suppression d'un employé (la suppression n'a pas vraiment lieu - le champ per_inactif est mis à 1) */
      $scope.supEmploye = function(index) {
            data.id = $scope.employe[index].id;
            var nom = $scope.employe[index].nom;
            UIkit.modal.confirm('<h3>Voulez vous vraiment supprimer <strong>' + nom + "</strong>?</h3>", {center: true}).then(function() {
                    
                  // Supprimer de la base de données
                    var $promise = $http.post('assets/php/supEmployeeAPI.php', data);
                    $promise.then(function (message) {
                          if (message.data) {
                            NotifService.success("Suppression d'employé", "L'employé n°" + data.id + " , " + nom + " a été supprimé");
                          } else {
                            NotifService.error("Suppression d'employé", "L'employé n°" + data.id + " , " + nom + " n'a pu étre supprimé");
                          }
                    });
                    $scope.employe.splice(index,1);
                  if ($scope.employe.length == 0) {
                        SessionService.set('user_confEmp', false);
                  } else {
                        SessionService.set('user_confEmp', true);
                  }
            }, function () {return;});
            
      };

      $scope.modEmploye = function(id) {
          	$rootScope.myEmp = $scope.employe[id];
              	$location.url("/employe/edition");
          	};
      });

/*****************************************************************************************\
    * Filtre pour afficher l'age comme il faut exemple : 17 ans *                        
\*****************************************************************************************/
ctrlCCNT.filter('age', function(DateFactory) {
      	return function(date) {
            	return DateFactory.getAge(date) + " ans";
      	};
})

/*///////////////////////////////////////////////////////////////////////////////////////*/