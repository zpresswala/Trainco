(function() {
  'use strict';

  angular
    .module('train.common')
    .factory('SeminarsSvc', SeminarsSvc);

  SeminarsSvc.$inject = ['$log', '$http', 'CONSTANTS'];
  /** @ngInject */
  function SeminarsSvc($log, $http, CONSTANTS) {
    var semAPI = CONSTANTS.API_LIST;

    var service = {
      getSeminarList: getSeminarList
    };

    return service;

    function getSeminarList() {
      return $http.get(semAPI)
        .success(getSemCompleted);

      function getSemCompleted(collection) {
        $log.debug(collection.seminars)
        var collectedSeminars = collection.seminars;
        return collectedSeminars;
      }

      function getSemFail(error) {
        $log.error('XHR Failed for getContributors.\n' + angular.toJson(error.data, true));
      }
    }
  }
})();
