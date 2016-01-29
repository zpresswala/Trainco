export class ListingController {
  constructor ($log, $http, courseSearch) {
    'ngInject';
    this.$http = $http;
    this.awesomeThings = [];
    this.$log = $log;
    this.contributors = [];

    this.activate(courseSearch);

    this.demo1 = {
      min: 0,
      max: 500
    };
  }

  activate(courseSearch) {
    return this.getCourseResults(courseSearch).then(() => {
      this.$log.info('Activated Course Listing View');

      // this.getSeminarResults(courseSearch).then(() => {
      //   this.$log.info('Semniar searching');
      // })
    });
  }

  getCourseResults(courseSearch) {
    return courseSearch.getResults().then((data) => {
      this.courses = data;

      return this.courses;
    });
  }
  getSeminarResults(courseSearch) {
    return courseSearch.getSeminars().then((data) => {
      this.seminars = data;

      return this.seminars;
    });
  }
}
