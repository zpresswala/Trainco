/**
 * @ngdoc service
 * @name train.common.months
 * @description < description placeholder >
 */

(function(){

  'use strict';

	angular
		.module('train.common')
		.factory('months', months);

  /* @ngInject */
  function months(){
		return {
			getAbrvMonths: getAbrvMonths,
      getMonths: getMonths
		};

		////////////////////

    /**
     * @ngdoc
     * @name train.common.months#testFunction
     * @methodOf train.common.months
     *
     * @description < description placeholder >
     * @example
     * <pre>
     * months.testFunction(id);
     * </pre>
     * @param {int} entity id
     */

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

}());
