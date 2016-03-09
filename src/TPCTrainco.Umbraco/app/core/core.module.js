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
    'API_URL': 'http://new.tpctrainco.com/api/seminars2/search/',
    'CART_API_URL': 'http://new.tpctrainco.com/api/carts/save'});

}());
