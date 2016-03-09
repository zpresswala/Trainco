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

  configure.$inject = ['$logProvider', '$compileProvider', '$httpProvider', '$localStorageProvider', '$locationProvider', '$sceProvider'];
  /* @ngInject */
  function configure($logProvider, $compileProvider, $httpProvider, $localStorageProvider, $locationProvider, $sceProvider) {
    /**
     * @ngdoc function
     * @name  config
     * @description
     * main configuration for trainco app.
     */
    $logProvider.debugEnabled(false);
    $compileProvider.debugInfoEnabled(false);
    $localStorageProvider.setKeyPrefix('tpc');
    // Expose XHR requests to server
    $httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $sceProvider.isEnabled(true);
  };


  runBlock.$inject = ['_'];
  /* @ngInject */
  function runBlock(_) {};

}());
