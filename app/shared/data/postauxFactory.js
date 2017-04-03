var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.factory("Postaux", function($resource) {
	return $resource("assets/json/nopostaux.json", {}, {
	    query: { method: "GET", isArray: false }
  	});
});