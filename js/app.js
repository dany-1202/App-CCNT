(function(){

	var appCCNT = angular.module('myApp', ['ngMaterial']);
	
	appCCNT.directive('ngMenu', function() {
		return {
			restrict : 'E',
			templateUrl : 'pages/menu-principale.html'
		};
	});

})();