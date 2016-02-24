(function() {
  'use strict';

  angular
    .module('train')
    .factory('searchService', searchService);

  /** @ngInject */
  function searchService($log, $http) {
    var apiHost = 'http://trainco.axial-client.com/api/seminars2/search/';
    var today = new Date();
    var thisYear = today.getFullYear();


    var service = {
      apiHost: apiHost,
      performSearch: performSearch
    };

    return service;

    function performSearch(OGFilter) {
      var theTopics = [OGFilter.topicParam1, OGFilter.topicParam2, OGFilter.topicParam3, OGFilter.topicParam4];
      return $http.get(apiHost + '?' +
          'keyword=' + OGFilter.keywordParam +
          '&location=' + OGFilter.locParam +
          '&radius=' + OGFilter.radiusParam +
          '&topics=' + theTopics +
          '&date-start=' + OGFilter.defStart + '-01-' + thisYear +
          '&date-end=' + OGFilter.defEnd + '-01-' + OGFilter.endYear, {
            cache: true
          })
        .then(getSearchComplete)
        .catch(getSearchFailed);

      function getSearchComplete(collection) {
        return collection.data;
      }

      function getSearchFailed(error) {
        $log.error('XHR Failed for getContributors.\n' + angular.toJson(error.data, true));
      }
    }
  }
})();
