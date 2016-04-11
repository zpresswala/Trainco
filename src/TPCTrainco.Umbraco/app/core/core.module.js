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
    'API_BASE': 'http://trainco-phase1.axial-client.com/api',
    'API_URL': API_BASE + '/seminars2/search/',
    'API_LIST': API_BASE + '/seminars2/list',
    'API_SAVE': API_BASE + '/account/UpdateSaveForLater',
    'CART_API_URL': API_BASE + '/carts/save'});
}());
