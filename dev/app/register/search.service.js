(function() {
  'use strict';

  angular
    .module('train')
    .factory('searchService', searchService);

  /** @ngInject */
  function searchService($log, $http) {
    var apiHost = 'http://trainco.axial-client.com/api/seminars2/search';

    var service = {
      apiHost: apiHost,
      performSearch: performSearch
    };

    return service;

    function performSearch(params) {
      if (!limit) {
        limit = 30;
      }

      return $http.get(apiHost + '/' + params)
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
