(function() {
  'use strict';

  angular
    .module('train')
    .service('months', months);

  /** @ngInject */
  function months() {

    this.getAbrvMonths = getAbrvMonths;
    this.getMonths = getMonths;

    function getAbrvMonths(data) {

      var monthNames = ['JAN ' + (new Date()).getFullYear(), 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
      months = [];

      var i;
      for (i = 1; i <= 12; i++) {
        if (i <= 9) {
          var val = '0' + i;
        } else {
          var val = i;
        }

        months.push({
          name: monthNames[i - 1],
          value: val
        });
      }
      if (data) {
        var n = data.length;
        for (j = n - 1; j >= 0; j--) {
          months.splice(parseInt(data[j]), 1);
        }
      }
      return months;
    }

    function getMonths(data) {
      var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Sept', 'October', 'November', 'December'];
      months = [];
      var i;
      for (i = 1; i <= 12; i++) {
        if (i <= 9) {
          var val = '0' + i;
        } else {
          var val = i;
        }
        months.push({
          name: monthNames[i - 1],
          value: val
        });
      }
      if (data) {
        var n = data.length;
        for (j = n - 1; j >= 0; j--) {
          months.splice(parseInt(data[j]), 1);
        }
      }
      return months;
    }
  }

})();
