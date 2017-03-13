var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('employePassword', function($timeout, $rootScope, $scope, $http, $location, SessionService, NotifService, State, $route,$routeParams) {
			$scope.$route = $route;
			$scope.valide = true;

			//Récupère le token de l'utilisateur
			var self = this;
  			self.token = $routeParams.t;
			console.log(self.token);
			//vérification dans la base de données si le token existe
			var checkToken = {'token': self.token };
			var $res = $http.post("assets/php/checkAccount.php", checkToken);
			$res.then(function (message) { console.log(message); });

			/* Validation des mots de passes */
			$scope.enregistrer = function () {

							// vérification des deux mots de passes
							if($("#newPass").val() == $("#confPass").val() && $("#newPass").val().trim() != "" && $("#newPass").val().length >= 8){
								$scope.valide = true;
								var data = {
									'password': $("#newPass").val(),
									'user_id': 4,
									'user_token': 'Bedonni | 58b43130b8ccc58b43130b8cde58b43130b8ce7'
								};
								//insertion du mot de passe dans la base
								var $res = $http.post("assets/php/updatePasswordEmploye.php", data);
								$res.then(function (message) { console.log(message); });
								document.location.href="https://play.google.com/store";
							}else{
								$scope.valide = false;
							}
			}
		});