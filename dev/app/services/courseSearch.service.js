const privates = new WeakMap();

export class CourseSearchService {
  constructor ($log, $http) {
    'ngInject';

    this.$log = $log;
    this.$http = $http;
    this.apiHost = 'api/search';
    this.apiHost2 = 'http://trainco.axial-client.com/api/seminars2/search';
    this.apiElectrical = 'api/electrical';
    const courseCategories = this.apiElectrical;
    privates.set(this, {
      courseCategories
    });
  }
  /**
   * Returns the "book categories" resource object
   */
  get courseCategories() {
    return privates.get(this).courseCategories;
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
  getElectrical() {
    return this.$http.get(this.apiElectrical)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        this.$log.error('XHR Failed for getElectrical.\n' + angular.toJson(error.data, true));
      });
  }
}
