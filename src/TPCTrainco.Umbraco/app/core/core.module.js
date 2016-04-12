/**
 * @ngdoc overview
 * @name train.core
 * @description Core is where the additional libraries are loaded.
 */

(function(){

  'use strict';
  var BASEURL = 'http://trainco-phase1.axial-client.com/api';
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
    'API_BASE': BASEURL,
    'API_URL': BASEURL + '/seminars2/search/',
    'API_LIST': BASEURL + '/seminars2/list',
    'API_SAVE': BASEURL + '/account/UpdateSaveForLater',
    'CART_API_URL': BASEURL + '/carts/save'});
}());
