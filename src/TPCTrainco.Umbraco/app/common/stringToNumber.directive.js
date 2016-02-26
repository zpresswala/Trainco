/**
 * @ngdoc directive
 * @name train.common.directive:stringToNumber
 * @scope true
 * @param {object} test test object
 * @restrict E
 *
 * @description < description placeholder >
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
