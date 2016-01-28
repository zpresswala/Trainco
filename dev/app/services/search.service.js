export class SearchService {
  constructor ($http, $log) {
    'ngInject';
    this.$log = $log;
    this.$http = $http;
    this.apiHost = 'http://trainco-dev.imulus-client.com/api/seminars/search';
  }

  performSearch(course) {
    return this.$http.post(this.apiHost, course);
  }
}
