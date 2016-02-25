(function() {
  'use strict';

  angular
    .module('train')
    .filter('createArray', createArray);

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
})();
