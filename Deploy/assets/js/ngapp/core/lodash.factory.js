/**
 * @ngdoc service
 * @name train.core._
 * @description < description placeholder >
 */

(function() {

  'use strict';

  angular
    .module('train.core')
    .factory('_', _);

  /* @ngInject */
  function _($window) {
    // Get a local handle on the global lodash reference.
    var _ = $window._;

    delete($window._);
    // Return the [formerly global] reference so that it can be injected
    // into other aspects of the AngularJS application.
    return (_);
  }

}());
