(function() {
  'use strict';

  angular
    .module('train.common')
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

    function performSearch(searchObj) {
      var theTopics = [searchObj.topicParam1, searchObj.topicParam2, searchObj.topicParam3, searchObj.topicParam4];
      return $http.get(apiHost + '?' +
          'keyword=' + searchObj.keywordParam +
          '&location=' + searchObj.locParam +
          '&radius=' + searchObj.radiusParam +
          '&topics=' + theTopics +
          '&date-start=' + searchObj.defStart + '-01-' + thisYear +
          '&date-end=' + searchObj.defEnd + '-01-' + searchObj.endYear, {
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
