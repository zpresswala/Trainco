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
  constructor (searchService, $http, $log) {
    'ngInject';
      this.$http = $http;
      this.$log = $log;
      this.topicSearchFilter = [];
      this.courseSearch = searchService;

      this.courseTopics = {};
  }
}
