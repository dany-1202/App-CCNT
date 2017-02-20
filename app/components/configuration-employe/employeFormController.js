var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.controller('employeFormController', function($timeout, $rootScope, $scope, $http, $location, SessionService, NotifService, $q, State) {
	
	function init() {
		$scope.user = {};
		$scope.idUser = -1;
		
		$scope.user.configuration = SessionService.get('user_configured');
		
		var data = {user_id: SessionService.get('user_id'), user_token: SessionService.get('user_token')};

		/* Récupération de l'employé courant */
		if($rootScope.myEmp == null){
			$scope.myEmp = {id:'',nom:'',prenom:'',adresse:'',code:'',localite:'',mail:'',dep:'',dateIn:null,dateOut:null,horaire:'',particularite:null,contrat:'', dateNaissance: '', telFixe: '', telMobile: '', genre: '', adresseSup: ''};
			$scope.selectedItem = "";
		} else {
			$scope.myEmp = angular.copy($rootScope.myEmp);
			$scope.selectedItem =  {value: $scope.myEmp.code, display: $scope.myEmp.code + "  " +$scope.myEmp.localite};
		}

		$scope.genres = [{id: 0, name: "Masculin", val:'M'}, {id:1, name:"Féminin", val:'F'}];
		
			/* Sélection du genre */
		var selGenre = function () {
			if ($rootScope.myEmp == null) {
				$scope.selectedGenre = 0;
			} else {
				for (var i = 0; i < $scope.genres.length; i++) {
					if ($scope.genres[i].val == $scope.myEmp.genre) {
						$scope.selectedGenre = i;
					}
				}
			}
		}

		selGenre(); // Appelle la méthode selGenre afin de séléctionner le genre de l'employé

		$scope.simulateQuery = true;
		$scope.isDisabled    = false;

		// list of `state` value/display objects
		$scope.states  = loadAll();
		$scope.querySearch   = querySearch;
		$scope.selectedItemChange = selectedItemChange;
		$scope.searchTextChange   = searchTextChange;


		$scope.newState = newState;

		function newState(state) {
			alert("Sorry! You'll need to create a Constitution for " + state + " first!");
		}

		// ******************************
		// Internal methods
		// ******************************

		/**
		 * Search for states... use $timeout to simulate
		 * remote dataservice call.
		 */
		function querySearch (query) {
			var results = query ? $scope.states.filter( createFilterFor(query) ) : $scope.states,
					deferred;
			if ($scope.simulateQuery) {
				deferred = $q.defer();
				$timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
				return deferred.promise;
			} else {
				return results;
			}
		}

		function searchTextChange(text) {
			//$log.info('Text changed to ' + text);
		}

		function selectedItemChange(item) {
			//$log.info('Item changed to ' + JSON.stringify(item));
			if (!angular.isUndefined(item)) {
				$scope.myEmp.code = item.value.no;
				$scope.myEmp.localite = State.capitalize(item.value.nom);
			}

		}

		/**
		 * Build `states` list of key/value pairs
		 */
		function loadAll() {
			var allPostaux = $scope.postaux.localites;
			return allPostaux.map( function (state) {
				return {
					value: {no: state.no, nom: angular.lowercase(state.ville)},
					display: state.no + " " + state.ville
				};
			});
		}

		/**
		 * Create filter function for a query string
		 */
		function createFilterFor(query) {
			var lowercaseQuery = angular.lowercase(query);
			return function filterFn(state) {
				return isNaN(lowercaseQuery) ? (state.value.nom.indexOf(lowercaseQuery) === 0) : (state.value.no.toString().indexOf(lowercaseQuery) === 0) ;
			};

		}

		/*///////////////////////////////////////////////////////////////////////////////////////*/
		
		$scope.pourcentage = [
			{name:"20%",value:0.20},{name:"25%",value:0.25},{name:"30%",value:0.30},{name:"35%",value:0.35},{name:"40%",value:0.40},
			{name:"45%",value:0.45},{name:"50%",value:0.50},{name:"55%",value:0.55},{name:"60%",value:0.60},{name:"65%",value:0.65},
			{name:"70%",value:0.70},{name:"75%",value:0.75},{name:"80%",value:0.80},{name:"85%",value:0.85},{name:"90%",value:0.90},
			{name:"95%",value:0.95},{name:"100%",value:1.0},
		];
		$scope.monPourc = $scope.pourcentage[0];

		$scope.showMen = false; // Savoir si on doit afficher champs mensuel
		$scope.showSpe = false; // Savoir si on doit afficher champs spécial

		$scope.nbHeure = 0; // nb d'heure spécifier dans le champs 

		$scope.validations = [
			{name:"Nom",valide:true},{name:"Prenom",valide:true},{name:"Adresse",valide:true},
			{name:"code",valide:true},{name:"localite",valide:true},{name:"mail",valide:true},
			{name:"dep",valide:true},{name:"dateIn",valide:true},{name:"dateOut",valide:true},
			{name:"horaire",valide:true},{name:"particularite",valide:true},{name:"contrat",valide:true},
			{name:"dateNaissance", valide:true},{name:"telFixe", valide:true},{name:"telMobile", valide:true}
		];

		$scope.deps = [];
		$scope.monDep = null;
		$scope.horaire = [];
		$scope.monHoraire = null;
		$scope.contrat = [];
		$scope.monContrat = null;

		/* Récupération et traitement des départements */
		var majDep = function() {
			if ($rootScope.myEmp != null && $scope.deps.length == 0) {
					//Met à jour le dep
				for (var i = $scope.deps.length - 1; i >= 0; i--) {
					if($scope.deps[i].name == $scope.myEmp.dep.nom){
							$scope.monDep = $scope.deps[i];
					};
				};
			}
		}

		var getDeps = function () {
			var $promise = $http.post('assets/php/getDepartementsAPI.php', data);
			$promise.then(function (message) {
				var tab = message.data;
				$scope.deps = tab;
				$scope.monDep = $scope.deps[0]; // Défini le premier département par défaut
				majDep();
			});
		}

		/* Récupération et traitement des horaires du contrat */
		var majHoraire = function () {
			if ($rootScope.myEmp != null) {
				// Met a jour le champ de l'horaire
				for (var i = $scope.horaire.length - 1; i >= 0; i--) {
					// Si on trouve le type d'horaire
					if($scope.horaire[i].name == $scope.myEmp.horaire.nom){
						$scope.monHoraire = $scope.horaire[i];
						if($scope.horaire[i].name == "Mensuel"){
							// Boucle de parcours pour trouver la valeur du pourcentage de travail
							for (var k = $scope.pourcentage.length - 1; k >= 0; k--) {
								if($scope.pourcentage[k].value == $scope.myEmp.particularite){
									$scope.monPourc = $scope.pourcentage[k];
									$scope.showMen = true;
								};
							};
						} else if ($scope.horaire[i].name == "Spécial"){
							$scope.nbHeure = $scope.myEmp.particularite;
							$scope.showSpe = true;
						};
					};
				};
			}
		}
		var getHoraires = function () {
			var $promise = $http.post('assets/php/getHorairesContratAPI.php', data);
			$promise.then(function (message) {
				var tab = message.data;
				$scope.horaire = tab;
				$scope.monHoraire = $scope.horaire[0]; // Défini le premier horaire contrat par défaut
				majHoraire();
			});
		}

		/* Récupération et traitement des types de contrat */
		var majTypeContrat = function () {
			// Met a jour le champs contrat
			for (var i = $scope.contrat.length - 1; i >= 0; i--) {
				if($scope.contrat[i].name == $scope.myEmp.contrat.nom){
					$scope.monContrat = $scope.contrat[i];
				};
			};
		}

		var getTypesContrat = function () {
			var $promise = $http.post('assets/php/getTypesContratAPI.php', data);
			$promise.then(function (message) {
				var tab = message.data;
				$scope.contrat = tab;
				$scope.monContrat = $scope.contrat[0]; // Défini le premier horaire contrat par défaut
				majTypeContrat();
			});
		}

		$timeout(getDeps, 10); // Lance la requête (besoin du timeout pour mettre à jour les infos)
		$timeout(getHoraires, 10); // Lance la requête (besoin du timeout pour mettre à jour les infos)
		$timeout(getTypesContrat, 10); // Lance la requête (besoin du timeout pour mettre à jour les infos)



		$scope.retour = function () {
			$location.url("/employe");
		};

		/**************************************************************************************************/
		/******************************** Validation des données ******************************************/
		$scope.validationNom = function () {
			if ($scope.myEmp.nom.trim().length < 2) {
				$scope.validations[0].valide = false;
			} else {
				$scope.validations[0].valide = true;
			};
		}

		$scope.validationPrenom = function () {
			if ($scope.myEmp.prenom.trim().length < 2) {
				$scope.validations[1].valide = false;
			} else {
				$scope.validations[1].valide = true;
			};
		}

		$scope.validationAdresse = function () {
			if ($scope.myEmp.adresse.trim().length == 0) {
				$scope.validations[2].valide = false;
			} else {
				$scope.validations[2].valide = true;
			};
		}

		$scope.validationCodePost = function () {
			/*if ($scope.myEmp.code < 1000 || $scope.myEmp.code > 99999 ) {
				$scope.validations[3].valide = false;
			} else {
				$scope.validations[3].valide = true;
			};*/
		}

		$scope.validationLocalite = function () {
			if ($scope.myEmp.localite.trim().length == 0) {
				$scope.validations[4].valide = false;
			} else {
				$scope.validations[4].valide = true;
			};
		}

		$scope.validationEmail = function () {
			var patternEmail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
			$scope.validations[5].valide = patternEmail.test($scope.myEmp.mail);
		}

		$scope.validationTelFixe = function () {
			if (isNaN($scope.myEmp.telFixe) || $scope.myEmp.telFixe.length != 10) {
				$scope.validations[13].valide = false;
			} else {
				$scope.validations[13].valide = true;
			};
		}

		$scope.validationTelMobile = function () {
		 if (isNaN($scope.myEmp.telMobile) || $scope.myEmp.telMobile.length != 10) {
				$scope.validations[14].valide = false;
			} else {
				$scope.validations[14].valide = true;
			};
		}

		$scope.validationDateNaissance = function () {
			if ($scope.myEmp.dateNaissance == null || $scope.myEmp.dateNaissance == "") {
				$scope.validations[12].valide = false;
			} else {
				$scope.validations[12].valide = true;
			}
		}

		$scope.validationDateEntree = function () {
			if ($scope.myEmp.dateIn == null || $scope.myEmp.dateIn == "") {
				$scope.validations[7].valide = false;
			} else {
				$scope.validations[7].valide = true;
			}
		}

		$scope.validationDateOut = function () {
			if ($scope.myEmp.dateOut == null || $scope.myEmp.dateOut == "") {
				 $scope.validations[8].valide = true;
			} else {
				if ($scope.myEmp.dateIn == null || $scope.myEmp.dateIn == "") {
					$scope.validations[7].valide = false;
					$scope.validations[8].valide = false;
				} else {
					if (moment($scope.myEmp.dateOut).isAfter(moment($scope.myEmp.dateIn))) {
						$scope.validations[8].valide = true;
					} else {
						$scope.validations[8].valide = false;
					}
				}
			}
		}

		$scope.validation = function () {
			var valideForm = true;
			//attribution des valeurs
			$scope.myEmp.dep.nom = $scope.monDep.name;
			$scope.myEmp.horaire.nom = $scope.monHoraire.name;
			if($scope.monHoraire.name == "Mensuel"){
				$scope.myEmp.particularite = $scope.monPourc.value;
			}else if($scope.monHoraire.name == "Spécial"){
				$scope.myEmp.particularite = $scope.nbHeure;
			}else{
				$scope.myEmp.particularite = null;
			};

			$scope.myEmp.contrat.nom = $scope.monContrat.name;
			
			//vérification de la saisie
			$scope.validationNom();
			$scope.validationPrenom();
			$scope.validationAdresse();
			$scope.validationCodePost();
			$scope.validationLocalite();
			$scope.validationEmail();
			$scope.validationDateNaissance();
			$scope.validationTelFixe();
			$scope.validationTelMobile();
			$scope.validationDateEntree();
			$scope.validationDateOut();

			if($scope.myEmp.horaire.nom =="Spécial"){
				$scope.validations[10].valide = $scope.myEmp.particularite <= 0 ? false : true;
			}
			
			for (var i = 0; i < $scope.validations.length; i++) {
				//console.log($scope.validations[i].name+" "+$scope.validations[i].valide);
				if(!$scope.validations[i].valide){
					valideForm = false;
					return valideForm; // Dès qu'un champ n'est pas valide 
				};
			};
			return valideForm;
		};

		/**************************************************************************************************/
		/* Insertion d'un employé */
		var insertionEmploye = function() {
			var $promise = $http.post('assets/php/insertEmployeeAPI.php', $scope.myEmp);
			$promise.then(function (message) {
				var id = message.data;
				if (id != -1) {
					NotifService.success('Insertion employé', "L'employé " + $scope.myEmp.nom + " a été inséré avec succès.");
					$scope.retour();
				} else {
					NotifService.error('Insertion employé', "L'employé n'a pas pu être inséré");
				}
			});
		}

		/* Modification d'un employé */
		var modificationEmploye = function() {
			var $promise = $http.post('assets/php/updateEmployeeAPI.php', $scope.myEmp);
			$promise.then(function (message) {
				var id = message.data;
				if (id != -1) {
					NotifService.success('Modification employé', "L'employé n° " + $scope.myEmp.id + " , " + $scope.myEmp.nom + " a été modifié avec succès.");
					$scope.retour();
				} else {
					NotifService.error('Modification employé', "L'employé n° " + $scope.myEmp.id + " , " + $scope.myEmp.nom + " n'a pas pu être modifié.");
				}
			});
		}

		/* Lance les enregistrements configurés */
		$scope.enregistrer = function () {
			/* Récupère les données afin de compléter l'objet myEmp */
			$scope.myEmp.user_id = SessionService.get('user_id');
			$scope.myEmp.user_token = SessionService.get('user_token');
			$scope.myEmp.dep = $scope.monDep;
			$scope.myEmp.horaire = $scope.monHoraire;
			$scope.myEmp.contrat = $scope.monContrat;
			$scope.myEmp.genre = $scope.genres[$scope.selectedGenre].val;

			/* Toutes les validations ont été faites */
			if ($scope.validation()) {
				if ($rootScope.myEmp == null) { // Lancer l'insertion de l'employé
					$scope.myEmp.dateIn = moment($scope.myEmp.dateIn).add(1, 'd').toDate(); // Ajouter l'heure pour ajouter correctement
					$scope.myEmp.dateNaissance = moment($scope.myEmp.dateNaissance).add(1, 'd').toDate();
					if ($scope.myEmp.dateOut != null || $scope.myEmp.dateOut != '') {
						$scope.myEmp.dateOut = moment($scope.myEmp.dateOut).add(1, 'd').toDate();
					}
					console.log($scope.myEmp);
					insertionEmploye();
				} else { // Lancer la modification de l'employé 
					modificationEmploye();
				}
			}
		}

		// permet d'afficher les champs en plus si on choisi un certain type d'horaire pour l'employé
		$scope.changementHoraire = function(){
			if($scope.monHoraire.name == "Mensuel"){
				$scope.showMen = true; 
				$scope.showSpe = false;
			} else if($scope.monHoraire.name == "Spécial"){
				$scope.showMen = false; 
				$scope.showSpe = true;
			} else {
				$scope.showMen = false; 
				$scope.showSpe = false;
			};
			
		};

		$scope.changementGenre = function() {
			console.log($scope.genres[0]);
			console.log($scope.genres[1]);
		}
	}
	
	if ($scope.postaux == null) {;
		var $res = $http.get("assets/json/nopostaux.json"); // Lancement de la requête pour récupérer les numéros postaux
            $res.then(function (message) {
            		$scope.postaux = message.data;
	            init();
            });
            
	} else {
		
	}
	

});