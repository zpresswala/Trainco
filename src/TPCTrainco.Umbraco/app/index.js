/**
 * @ngdoc overview
 * @name train
 * @description
 * The main module for the trainco
 */

(function(app) {

  app.config(function($logProvider, $httpProvider, $localStorageProvider, $locationProvider) {
    /**
     * @ngdoc function
     * @name  config
     * @description
     * main configuration for trainco app.
     */
    //@exclude
    $logProvider.debugEnabled(true);
    //@endexclude
    $localStorageProvider.setKeyPrefix('tpc');
    // Expose XHR requests to server
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  });

  app.run(function(_) {});

}(angular.module('train', [
  'train.register',
  'train.seminar',
  'ngAnimate',
  'ui.bootstrap',
  'selector',
  'rzModule',
  'ngStorage',
  'angular.filter',
  'darthwade.loading'
])));
