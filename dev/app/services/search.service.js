export class SearchService {
  constructor ($http, $log) {
    'ngInject';
    this.$log = $log;
    this.$http = $http;
    this.apiHost = 'http://trainco.axial-client.com/api/seminars2/search';
  }

  performSearch(params) {
    return this.$http.get(this.apiHost, + '/' + params)
    .then((collection) => {
      return collection.data;
    })
    .catch((error) => {
      this.$log.error('XHR Failed for performSearch.\n' + angular.toJson(error.data, true));
    });
  }
}
