var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('employePassword', function($timeout, $rootScope, $scope, $http, $location, SessionService, NotifService, State, $route,$routeParams) {
			$scope.$route = $route;
			$scope.valide = true;
			$scope.activated = false;

			//Récupère le token de l'utilisateur
			var self = this;
  			self.token = $routeParams.t;
			console.log(self.token);
			//vérification dans la base de données si le token existe
			var checkToken = {'token': self.token };
			var $res = $http.post("assets/php/checkAccount.php", checkToken);
			//On vérifie si le token est dans la base sinon on redirige l'utilisateur
			$res.then(function (message) { 
				//Attention ici le false est pris comme un string et non boolean
				if(message.data == 'false'){
					$location.url("/connexion");
				};
				
			});

			/* Validation des mots de passes */
			$scope.enregistrer = function () {

							// vérification des deux mots de passes
							if($("#newPass").val() == $("#confPass").val() && $("#newPass").val().trim() != "" && $("#newPass").val().length >= 8){
								$scope.valide = true;
								var data = {
									'password': $("#newPass").val(),
									'user_id': 4,
									'user_token': '58b43130b8ccc58b43130b8cde58b43130b8ce7'
								};
								//insertion du mot de passe dans la base
								var $res = $http.post("assets/php/updatePasswordEmploye.php", data);
								$scope.activated = true;
								
							}else{
								$scope.valide = false;
							}
			}

			$scope.goPlayStore = function (){
				document.location.href="https://play.google.com/store";
			}

			$scope.goAppleStore = function (){
				document.location.href="https://itunes.apple.com/fr/genre/ios/id36?mt=8";
			}
		});