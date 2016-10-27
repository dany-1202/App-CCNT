var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('ngMenu', function() {
	return {
		restrict : 'E',
		templateUrl : 'app/shared/menu/menu-principaleView.html'
	};
});