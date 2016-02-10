export class CourseSearchService {
  constructor($log, $http) {
    'ngInject';

    this.$log = $log;
    this.$http = $http;
    this.apiHost = 'api/search';
    this.apiHost2 = 'http://trainco.axial-client.com/api/seminars2/search';
    this.apiSemDetails = 'http://trainco.axial-client.com/api/schedules2/details';
    const searchAPI = 'http://trainco.axial-client.com/api/seminars2/search/?';
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

  getSeminarsBox() {
    const searchAPI = 'http://trainco.axial-client.com/api/seminars2/search/?';
    let location = localStorage.getItem('location');
    let topicParam1 = localStorage.getItem('topicParam1');
    let topicParam2 = localStorage.getItem('topicParam2');
    let topicParam3 = localStorage.getItem('topicParam3');
    let topicParam4 = localStorage.getItem('topicParam4');
    let minDateRange = localStorage.getItem('minDateRange');
    let maxDateRange = localStorage.getItem('maxDateRange');
    return this.$http.get(searchAPI + 'location=' + location +
        '&topics=' + topicParam1 + ',' + topicParam2 + ',' + topicParam3 + ',' + topicParam4 +
        '&date-start=' + minDateRange + '-01-2016' +
        '&date-end=' + maxDateRange + '-01-2016')
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        this.$log.error('XHR Failed for getSeminars.\n' + angular.toJson(error.data, true));
      });
  }
}
