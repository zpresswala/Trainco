/**
 * @ngdoc filter
 * @name train.common.filer:startFrom
 * @description < description placeholder >
 * @param {object} input object to be filtered
 * @returns {object} < returns placeholder >
 */

(function() {

  'use strict';

  angular
    .module('train.common')
    .filter('startFrom', startFrom);

  /* @ngInject */
  function startFrom() {
    return function(input, start) {
      if (input === undefined) {
        return input;
      } else {
        return input.slice(+start);
      }
    };
  }

}());
