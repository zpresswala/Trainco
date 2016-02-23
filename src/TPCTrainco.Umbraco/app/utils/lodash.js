(function(module) {
  module.factory('_', function($window) {
    // Get a local handle on the global lodash reference.
    var _ = $window._;

    delete($window._);
    // Return the [formerly global] reference so that it can be injected
    // into other aspects of the AngularJS application.
    return(_);
  });
})(angular.module('train'));
