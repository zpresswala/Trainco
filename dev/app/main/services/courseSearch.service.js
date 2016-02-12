(function() {
  'use strict';

  angular
    .module('train')
    .factory('courseSearch', courseSearch);

  /** @ngInject */
  function courseSearch($log, $http) {
    var apiHost = 'api/search';
    var apiHost2 = 'http://trainco.axial-client.com/api/seminars2/search';
    var apiSemDetails = 'http://trainco.axial-client.com/api/schedules2/details';
    var searchAPI = 'http://trainco.axial-client.com/api/seminars2/search/?';

    var service = {
      getResults: getResults,
      getSeminars: getSeminars,
      getSeminarDetails: getSeminarDetails,
      getSeminarsBox: getSeminarsBox
    };

    return service;

    function getResults() {
      return $http.get(apiHost)
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          $log.error('XHR Failed for getResults.\n' + angular.toJson(error.data, true));
        });
    }

    function getSeminars(classId) {
      return $http.get(apiHost2 + '/' + classId)
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          $log.error('XHR Failed for getResults.\n' + angular.toJson(error.data, true));
        });
    }

    function getSeminarDetails(semId) {
      return $http.get(apiSemDetails + '/' + semId)
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          $log.error('XHR Failed for getResults.\n' + angular.toJson(error.data, true));
        });
    }

    function getSeminarsBox() {
      var searchAPI = 'http://trainco.axial-client.com/api/seminars2/search/?';
      var location = localStorage.getItem('location');
      var topicParam1 = localStorage.getItem('topicParam1');
      var topicParam2 = localStorage.getItem('topicParam2');
      var topicParam3 = localStorage.getItem('topicParam3');
      var topicParam4 = localStorage.getItem('topicParam4');
      var minDateRange = localStorage.getItem('minDateRange');
      var maxDateRange = localStorage.getItem('maxDateRange');
      return $http.get(searchAPI + 'location=' + location +
          '&topics=' + topicParam1 + ',' + topicParam2 + ',' + topicParam3 + ',' + topicParam4 +
          '&date-start=' + minDateRange + '-01-2016' +
          '&date-end=' + maxDateRange + '-01-2016')
        .then(function(response) {
          return response.data;
        })
        .catch(function(error) {
          $log.error('XHR Failed for getResults.\n' + angular.toJson(error.data, true));
        });
    }
  }
})();
