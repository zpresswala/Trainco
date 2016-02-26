/**
 * @ngdoc filter
 * @name train.common.filer:createArray
 * @description Runs a forEach making nested data easier to ng-repeat
 * @returns {array} arrayList
 */

(function() {

  'use strict';

  angular
    .module('train.common')
    .filter('createArray', createArray);

  /* @ngInject */
  function createArray() {
    return function(value, propertyName) {
      var arrayList = [];
      angular.forEach(value, function(val) {
        angular.forEach(val[propertyName], function(v) {
          arrayList.push(v)
        });
      });
      return arrayList;
    }
  }

}());
