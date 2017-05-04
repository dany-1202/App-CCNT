var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('configEstablishment', function($timeout, $rootScope, Popover, State, $q, $log, Postaux, ModalTuto) {
	return {
		restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/components/configuration-initial/config-establishment/config-establishmentView.html', // Template à utiliser lorsque la balise est utilisé
		transclude : true, // Inclu la vue au template déjà existant
		controller: 'postauxController',
		link: function(scope, element, attrs) {
				$timeout(function () {
					/*****************************************************************************************\
					* Gestion du contrôleur == link ici *                        
					\*****************************************************************************************/
					
					/* Vérification de la validation du champ concerné - l'error est mis à true si elle existe à false sinon */
					
					scope.verification = function(id, index){
						$timeout(Popover.hide, 0);
						var obj = scope.infoEtablissement[index];
						obj.error = false;
						if (obj.value === undefined) {
							obj.error = true;
							return;
						}
						if (obj.type == "tel") {
							var patternTel = new RegExp(/^(?:(?:|0{1,2}|\+{0,2})41(?:|\(0\))|0)([1-9]\d)(\d{3})(\d{2})(\d{2})$/);
							obj.error = !patternTel.test(obj.value);
							return;
						} else if (obj.id == 4) {
							if (isNaN(obj.value.no) || obj.value.no <= 0 || obj.value.nom == "") {
								obj.error = true;
								return;
							} else {
								obj.error = false;
								return;
							}
						} else if (obj.type == "email" && obj.value.length != 0) {
							var patternEmail = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
							obj.error = !patternEmail.test(obj.value);
							return;
						} else if (obj.id == 7 && obj.value.toString().length != 0) {//Controle l'url 
							var patternUrl= new RegExp(/(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/);
							obj.error = !patternUrl.test(obj.value.toString());
							return;
						}
						var len = obj.value.toString().length;
						if (len < obj.min || len > obj.max && obj.type != "tel") {
							obj.error = true;
							return;
						}
					}
					/* Valide si l'étape est validé */
					scope.verificationSuivant = function(ev){
						$timeout(Popover.hide, 0);

						var err = false;
						for (var i = scope.infoEtablissement.length - 1; i >= 0; i--) {
							scope.verification(scope.infoEtablissement[i].id,i);
							if (scope.infoEtablissement[i].error == true){err=true;}
						};
						if(err == false){ ModalTuto.showModal(ev, 2); scope.$parent.ctrl.next(2);}
					}
					$timeout(Popover.showPop(0, ['#btnSuivant']), 1000);
				}, 500);
    		}, // Fin Link
	}; // Fin Return
}); // Fin Directive


ctrlCCNT.controller('postauxController', function ($scope, $q, $timeout, Postaux) {
	$scope.simulateQuery = true;
	$scope.isDisabled    = false;
	$scope.selectedItem       = $scope.infoEtablissement[3].value.no == "" || $scope.infoEtablissement[3].value.nom == ""  ? "": {value: $scope.infoEtablissement[3].value, display: $scope.infoEtablissement[3].value.no + " " + $scope.infoEtablissement[3].value.nom};
	
	function init () {
		
		// list of `state` value/display objects
		$scope.states = loadAll();
		$scope.querySearch = querySearch;
		$scope.selectedItemChange = selectedItemChange;
		$scope.searchTextChange = searchTextChange;
		$scope.newState = newState;
		
		function newState(state) {
			alert("Sorry! You'll need to create a Constitution for " + state + " first!");
		}

		/*****************************************************************************************\
				* Internal Méthodes *                        
		\*****************************************************************************************/

		/**
	 	* Pour simuler la recherche on utilise le $timeout
	 	* Simulation d'appel de requête
	 	*/
		function querySearch (query) {
	  		var results = query ? $scope.states.filter( createFilterFor(query) ) : $scope.states, deferred;
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
			if (text == "") {
				$scope.infoEtablissement[3].value = {value : "", display : ""};
			}
		}
		
		var majInfo = function (item) {
			if(isNaN(item.value.no) || item.value.no <= 0 || item.value.nom == ""){
				$scope.infoEtablissement[3].error = true;
			} else {
				$scope.infoEtablissement[3].error = false;
			}
		}
		
		function selectedItemChange(item) {
			//$log.info('Item changed to ' + JSON.stringify(item));
			console.log(item);
			$scope.infoEtablissement[3].value = angular.copy(item.value);
			$timeout($scope.verification(4, 3), 1);
			$timeout(majInfo(item), 10);
		}

	    /**
	     * Build `states` list of key/value pairs
	     */
		function loadAll() {
			var allPostaux = $scope.$parent.postaux.localites;
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
	}
		
	if (angular.isUndefined($scope.$parent.postaux)) {
		Postaux.query(function(data) {$scope.$parent.postaux = data; init();});
	} else {
		init();
	}
})
