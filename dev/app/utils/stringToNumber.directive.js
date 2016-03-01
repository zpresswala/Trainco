(function() {
  'use strict';

  angular
    .module('train')
    .directive('stringToNumber', stringToNumber);

  /** @ngInject */
  function stringToNumber() {
    var directive = {
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        ngModel.$parsers.push(function(value) {
          return '' + value;
        });
        ngModel.$formatters.push(function(value) {
          return parseFloat(value, 10);
        });
      }
    }
    return directive;

  }
})();
