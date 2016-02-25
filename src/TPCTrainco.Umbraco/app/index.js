/**
 * @ngdoc overview
 * @name train
 * @description
 * The main module for TrainCO
 */

(function () {
    'use strict';

angular
  .module('train', [
    'ngAnimate',
    'ui.bootstrap',
    'selector',
    'rzModule',
    'ngStorage',
    'angular.filter',
    'darthwade.loading',
    'train.register',
    'train.seminar'
  ])
  .config(configure)
  .run(run);

  configure.$inject = ['$logProvider', '$compileProvider', '$httpProvider', '$localStorageProvider', '$locationProvider'];
  function configure($logProvider, $compileProvider, $httpProvider, $localStorageProvider, $locationProvider) {
    /**
     * @ngdoc function
     * @name  config
     * @description
     * main configuration for trainco app.
     */
    $logProvider.debugEnabled(true);
    $compileProvider.debugInfoEnabled(true);
    $localStorageProvider.setKeyPrefix('tpc');
    // Expose XHR requests to server
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  };
  run.$inject = ['_'];
  function run(_) {};

})();
