/* JS pour les inputs*/ 
angular.module('connexion', ['ngMaterial'])

.controller('DemoCtrl', function($scope) {
$scope.user = {
  email: 'Developer',
  password: 'ipsum@lorem.com',
};
})
.config(function($mdThemingProvider) {

// Configure a dark theme with primary foreground blue

$mdThemingProvider.theme('docs-dark', 'default')
  .primaryPalette('blue')
  .dark();

});