/**
 * @ngdoc filter
 * @name startFrom
 * @kind function
 * @description
 * 
 */
(function() {
  'use strict';

  angular
    .module('train')
    .filter('startFrom', startFrom);

  function startFrom() {
    return function(input, start) {
      if (input === undefined) {
        return input;
      } else {
        return input.slice(+start);
      }
    };
  }
})();
