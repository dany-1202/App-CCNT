var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.service('PromiseDAO', function ($http, $q, SessionService) {

	return {
		insertEstablishment: function(dataEtablissement) {
			var deferred = $q.defer();
			var $res = $http.post("assets/php/insertEtablissementAPI.php", dataEtablissement);
			$res.then(function (data) {
				deferred.resolve(data);
			}).then(function (error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		},
		insertDepartment: function(dataDep) {
			var deferred = $q.defer();
			var $res = $http.post("assets/php/insertDepartementAPI.php", dataDep);
			$res.then(function (data) {
				deferred.resolve(data);
			}).then(function (error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		},
		getHourPreConfigure: function(tabDeps) {
			var deferred = $q.defer();
			
			for (var i = 0; i < tabDeps.length; i++) {
				var data = {user_id : SessionService.get('user_id'), user_token: SessionService.get('user_token'), dep_id: tabDeps.id};
				$res = $http.post('assets/php/getHoraireTypePreConfigAPI.php', data);
				$res.then(function(message) {
					if (message.data.length == 1) {deferred.resolve(message);}
				}).then(function(error){
					deferred.resolve(error);
				});
			}

			return deferred.promise;
		},
		getAllEmployees : function(data) {
			var deferred = $q.defer();
			var emps = [];
			var $promise = $http.post('assets/php/getEmployeesAPI.php', data);
			$promise.then(function (message) {
				var tab = message.data;
				for (var i = 0; i < tab.length; i++) {
					var person = tab[i];
					emps.push({
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
				deferred.resolve(emps);
			}).then(function(error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		},
		getDeps : function(data) {
			var deferred = $q.defer();
			var deps = [];
			var $promise = $http.post('assets/php/getDepartementsAPI.php', data);
			$promise.then(function (message) {
				var tab = message.data;
				console.log(message);
				for (var i = 0; i < tab.length; i++) {
					var dep = tab[i];
					deps.push({
						id:dep.id,
						name:dep.name,
						carre: "carre-" + dep.img,
						format: 'label-carre-100',
						error: false
					});
				}
				deferred.resolve(deps);
			}).then(function(error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		},
		getInfosEstablishment : function(data) {
			var deferred = $q.defer();
			var $promise = $http.post('assets/php/getInfosEstablishmentAPI.php', data);
			$promise.then(function (message) {
				var info = message.data;
				deferred.resolve(info);
			}).then(function(error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		},
		getHolidays : function(data) {
			var deferred = $q.defer();
			var $promise = $http.post('assets/php/getFermetureInfosAPI.php', data);
			$promise.then(function (message) {
				var info = message.data;
				deferred.resolve(info);
			}).then(function(error) {
				deferred.resolve(error);
			});
			return deferred.promise;
		}

	}
	
	
	
	
})
