var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.service('PromiseDAO', function ($http, $q) {

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
		}
	}
	
	
	
	
})
