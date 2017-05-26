var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('selectDir', function ($timeout) {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) {
			console.log('iciiii');
			$timeout(function() {$(".ui.dropdown").dropdown();}, 50);

		}
	};
})