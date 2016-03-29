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
    'API_URL': 'http://trainco-phase1.axial-client.com/api/seminars2/search/',
    'API_LIST': 'http://trainco-phase1.axial-client.com/api/seminars2/list',
    'CART_API_URL': 'http://trainco-phase1.axial-client.com/api/carts/save'});

}());
