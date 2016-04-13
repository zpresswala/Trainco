/**
 * @ngdoc directive
 * @name train.common.directive:stringToNumber
 * @scope true
 *
 * @description converts a string to a number. Used for shopping
 * cart inputs.
 *
 */

(function(){

  'use strict';

  angular
    .module('train.common')
    .directive('stringToNumber', stringToNumber);

  /* @ngInject */
  function stringToNumber(){

    return {
      link: link,
      require: 'ngModel'
    };

    /////////////////////

    function link(scope, elem, attrs, ngModel){
      ngModel.$parsers.push(function(value) {
        return '' + value;
      });
      ngModel.$formatters.push(function(value) {
        return parseFloat(value, 10);
      });
    }
  }

}());
