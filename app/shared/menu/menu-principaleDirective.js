/**
* Module qui gère les directives du Menu principale
* Il possède une directive ngMenu qui affichera le menu dans l'application 
* lorsqu'elle est utilisé comme suit : <ng-menu></ng-menu>
**/
var ctrlCCNT = angular.module('ctrlCCNT');

ctrlCCNT.directive('ngMenu', function() {
	return {
       	restrict : 'E', // Ici se limite à la balise si on veut pour un attribut = A
		templateUrl : 'app/shared/menu/menu-principaleView.html' // Template à utiliser lorsque la balise est utilisé
	};
});