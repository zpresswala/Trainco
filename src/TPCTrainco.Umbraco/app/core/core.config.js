/**
 * @ngdoc overview
 * @name train.core
 * @description Configuration block for TrainCO
 */

(function() {

  'use strict';

  angular.module('train.core')
    .config(configuration)
    .run(runBlock);

  configure.$inject = ['$logProvider', '$compileProvider', '$httpProvider', '$localStorageProvider', '$locationProvider'];
  /* @ngInject */
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


  runBlock.$inject = ['_'];
  /* @ngInject */
  function runBlock(_) {};

}());
