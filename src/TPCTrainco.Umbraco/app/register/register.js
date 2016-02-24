(function(module) {

}(angular.module('train.register', [
  'ngAnimate',
  'ui.bootstrap',
  'selector',
  'rzModule',
  'ngStorage',
  'angular.filter',
  'darthwade.loading'
]).filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
})));
