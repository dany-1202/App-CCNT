<<<<<<< HEAD
(function (){
	var ctrlCCNT = angular.module('ctrlCCNT');

	ctrlCCNT.directive('eventDataAfter', function() {
		return {
			restrict : 'A', // Ici se limite à la balise si on veut pour un attribut = A
			link: function (scope, element, attrs) {
				var getInitialTitle = function() {
					return scope.event.title.split(' ');
				}
				var obj = getInitialTitle(); // Récupérer le titre
				
				var style = '';
				if (scope.event.absence.absence) {
					style = '<span style="display:inline-block;overflow: hidden;font-weight:bold;font-size:11px;text-align:center;line-height:23px!important;background-color:#2c3e50; color:white;width:23px;height:23px;border-radius:23px;margin-right:2px;margin-bottom:2px;-webkit-box-shadow:inset 0 0 5px 0 rgba(0,0,0,.4);box-shadow:inset 0 0 5px 0 rgba(0,0,0,.4)">'  + obj[0].charAt(0).toUpperCase() + obj[obj.length-1].charAt(0).toUpperCase() + '</span>';
				} else {
					style = '<span style="display:inline-block;overflow: hidden;font-weight:bold;text-align:center;letter-spacing:1px;line-height:30px!important;background-color:' + scope.event.color.primary + ';color:white!important;width:30px;height:30px;border-radius:30px;margin-right:2px;margin-bottom:2px;-webkit-box-shadow:inset 0 0 5px 0 rgba(0,0,0,.4);box-shadow:inset 0 0 5px 0 rgba(0,0,0,.4)">' + obj[0].charAt(0).toUpperCase() + obj[obj.length-1].charAt(0).toUpperCase() + '</span>';
				}
				$(element[0]).after(style);
				/*
				if (scope.$parent.$parent.$parent.day.nbTime == null) {
					scope.$parent.$parent.$parent.day.nbTime = [];
					scope.$parent.$parent.$parent.day.nbTime.push(scope.event.title);
					$(element[0]).after(style);
				} else {
					if (scope.$parent.$parent.$parent.day.nbTime.indexOf(scope.event.title) != -1){
						return;
					} else {
						scope.$parent.$parent.$parent.day.nbTime.push(scope.event.title);
						$(element[0]).after(style);
					}
				} */
			}
		}
	})
=======
(function (){
	var ctrlCCNT = angular.module('ctrlCCNT');

	ctrlCCNT.directive('eventDataAfter', function() {
		return {
			restrict : 'A', // Ici se limite à la balise si on veut pour un attribut = A
			link: function (scope, element, attrs) {
				var getInitialTitle = function() {
					return scope.event.title.split(' ');
				}
				var obj = getInitialTitle(); // Récupérer le titre
				
				var style = '';
				if (scope.event.absence.absence) {
					style = '<span style="display:inline-block;overflow: hidden;font-weight:bold;font-size:11px;text-align:center;line-height:23px!important;background-color:#2c3e50; color:white;width:23px;height:23px;border-radius:23px;margin-right:2px;margin-bottom:2px;-webkit-box-shadow:inset 0 0 5px 0 rgba(0,0,0,.4);box-shadow:inset 0 0 5px 0 rgba(0,0,0,.4)">'  + obj[0].charAt(0).toUpperCase() + obj[obj.length-1].charAt(0).toUpperCase() + '</span>';
					if (scope.$parent.$parent.$parent.day.nbTimeAbs == null) {
						scope.$parent.$parent.$parent.day.nbTimeAbs = [];
						scope.$parent.$parent.$parent.day.nbTimeAbs.push(scope.event.title);
						$(element[0]).after(style);
					} else {
						if (scope.$parent.$parent.$parent.day.nbTimeAbs.indexOf(scope.event.title) == -1){
							scope.$parent.$parent.$parent.day.nbTimeAbs.push(scope.event.title);
							$(element[0]).after(style);
						}
					}
				
				} else {
					style = '<span style="display:inline-block;overflow: hidden;font-weight:bold;text-align:center;letter-spacing:1px;line-height:30px!important;background-color:' + scope.event.color.primary + ';color:white!important;width:30px;height:30px;border-radius:30px;margin-right:2px;margin-bottom:2px;-webkit-box-shadow:inset 0 0 5px 0 rgba(0,0,0,.4);box-shadow:inset 0 0 5px 0 rgba(0,0,0,.4)">' + obj[0].charAt(0).toUpperCase() + obj[obj.length-1].charAt(0).toUpperCase() + '</span>';
					if (scope.$parent.$parent.$parent.day.nbTime == null) {
						scope.$parent.$parent.$parent.day.nbTime = [];
						scope.$parent.$parent.$parent.day.nbTime.push(scope.event.title);
						$(element[0]).after(style);
					} else {
						if (scope.$parent.$parent.$parent.day.nbTime.indexOf(scope.event.title) == -1){
							scope.$parent.$parent.$parent.day.nbTime.push(scope.event.title);
							$(element[0]).after(style);
						}
					}
				}
				//$(element[0]).after(style);
				
				
			}
		}
	})
>>>>>>> appCCNT
})();