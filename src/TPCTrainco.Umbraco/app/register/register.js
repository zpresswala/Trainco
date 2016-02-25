/**
 * @ngdoc overview
 * @name train.register
 * @description
 * The register / search module for TrainCO
 */

(function() {
  'use strict';

angular
  .module('train.register', [
    'ngAnimate',
    'ui.bootstrap',
    'selector',
    'rzModule',
    'ngStorage',
    'angular.filter',
    'darthwade.loading'
  ]).filter('startFrom', function() {
 return function(input, start) {
      if (input === undefined) {
        return input;
      } else {
        return input.slice(+start);
      }
    };
}).filter('createarray', function () {
    return function (value, propertyName) {
        var arrayList = [];
        angular.forEach(value, function (val) {
            angular.forEach(val[propertyName], function (v) {
                arrayList.push(v)
            });
        });
        return arrayList;
    }})
})();
