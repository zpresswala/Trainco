const privates = new WeakMap();

export class CourseSearchService {
  constructor ($log, $http) {
    'ngInject';

    this.$log = $log;
    this.$http = $http;
    this.apiHost = 'api/search';
    this.apiHost2 = 'http://trainco.axial-client.com/api/seminars2/search';
    this.apiSemDetails = 'http://trainco.axial-client.com/api/schedules2/details';

  }
  getResults() {
    return this.$http.get(this.apiHost)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        this.$log.error('XHR Failed for getResults.\n' + angular.toJson(error.data, true));
      });
  }
  getSeminars(classId) {
    return this.$http.get(this.apiHost2 + '/' + classId)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        this.$log.error('XHR Failed for getSeminars.\n' + angular.toJson(error.data, true));
      });
  }
  getSeminarDetails(semId) {
    return this.$http.get(this.apiSemDetails + '/' + semId)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        this.$log.error('XHR Failed for getSeminarDetails.\n' + angular.toJson(error.data, true));
      });
  }
}
