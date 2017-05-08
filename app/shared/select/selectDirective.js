var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('selectDir', function ($timeout) {
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs) {
			$timeout(function() {$(".ui.dropdown").dropdown();}, 0);
		}
	};
})