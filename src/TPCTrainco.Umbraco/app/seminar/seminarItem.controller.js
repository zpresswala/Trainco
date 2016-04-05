(function() {
  'use strict';

  angular
    .module('train.seminar')
    .controller('SeminarItemController', SeminarItemController);

  SeminarItemController.$inject = ['$log', '$http', 'CONSTANTS'];
  /** @ngInject */
  function SeminarItemController($log, $http, CONSTANTS) {
    var vm = this;
    var apiSave = CONSTANTS.API_SAVE;
    var classId = localStorage.getItem('classId');
    vm.buttonText = 'Save';
    vm.saveCourseToUser = function($event) {
      var data = {
        courseId: classId
      };
      $http.put(apiSave, data, {
        headers: {
          'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('tcJWT'))
        }
      }).then(function(response) {
        vm.buttonText = 'Saved!';
      }).catch(function(error) {
        $log.debug(error)
      });
    };
  }
})();
