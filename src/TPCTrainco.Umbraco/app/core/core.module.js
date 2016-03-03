/**
 * @ngdoc overview
 * @name train.core
 * @description Core is where the additional libraries are loaded.
 */

(function(){

  'use strict';

  angular.module('train.core', [
    'ngAnimate',
    'ngSanitize',
    'ui.bootstrap',
    'selector',
    'rzModule',
    'ngStorage',
    'angular.filter',
    'darthwade.loading'
  ]).constant('CONSTANTS', {
    'API_URL': 'https://api.flayk.com/v1'});

}());
