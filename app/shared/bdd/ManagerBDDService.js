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
		}
	}
	
	
	
	
})
