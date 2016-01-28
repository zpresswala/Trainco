export function FilterTopicDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/filterTopic/filterTopic.html',
    scope: {
    },
    controller: FilterTopicController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;
}

class FilterTopicController {
  constructor (courseSearch, $http, $log) {
    'ngInject';
      this.$http = $http;
      this.$log = $log;
      this.activate(courseSearch);
      this.courseSearch = courseSearch;
  }

    activate(courseSearch) {
      return this.getElectricalCourses(courseSearch).then(() => {
        this.$log.info('Activated Course Listing View');
      });
    }

    getElectricalCourses() {
      return this.courseSearch.getElectrical().then((data) => {
        this.courses = data;

        return this.courses;
      });
    }
}
