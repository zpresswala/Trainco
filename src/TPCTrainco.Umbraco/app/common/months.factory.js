/**
 * @ngdoc service
 * @name train.common.Months
 * @description Handles months for the slider and dropdowns.
 */

(function(){

  'use strict';

	angular
		.module('train.common')
		.factory('MonthSvc', MonthSvc);

  /* @ngInject */
  function MonthSvc(){
		return {
			getAbrvMonths: getAbrvMonths,
      getMonths: getMonths
		};

		////////////////////

    /**
     * @ngdoc
     * @name train.common.months#getAbrvMonths
     * @methodOf train.common.months
     *
     * @description Gets months in abbreviated form. Takes the array of abbreviated
     * month names and converts to the correct numerical value of each month.
     * @example
     * <pre>
     * months.getAbrvMonths();
     * </pre>
     * @returns {array}
     */

		function getAbrvMonths(data) {

      var monthNames = ['JAN ' + (new Date()).getFullYear(), 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC'];
      var months = [];

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
    /**
     * @ngdoc
     * @name train.common.months#getMonths
     * @methodOf train.common.months
     *
     * @description Gets months in non-abbreviated form. Takes the array of
     * month names and converts to the correct numerical value of each month.
     * @example
     * <pre>
     * months.getMonths();
     * </pre>
     * @returns {array}
     */
    function getMonths(data) {
      var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'Sept', 'October', 'November', 'December'];
      var months = [];
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
