import cities from './cities';
export function MainSearchDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/mainSearch/mainSearch.html',
    scope: {},
    controller: MainSearchController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;
}

class MainSearchController {
  constructor(searchService, courseSearch, $http, $log, $state, $rootScope) {
    'ngInject';
    this.$http = $http;
    this.$log = $log;
    this.$rootScope = $rootScope;
    this.courseSearch = courseSearch;
    this.$state = $state;
    this.apiHost = 'http://trainco-dev.imulus-client.com/api/seminars/search';
    this.searchService = searchService;
    this.cities = cities.cities;

    this.classTopics = {};
    const searchAPI = 'http://trainco.axial-client.com/api/seminars2/search/?';
    //Range slider with ticks and values
    this.sliderValues = {
      minValue: 1,
      maxValue: 8,
      options: {
        floor: 0,
        ceil: 15,
        showTicks: true,
        showSelectionBarEnd: true,
        showTicksValues: true,
        stepsArray: 'JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEPT,OCT,NOV,DEC,JAN,FEB,MAR'.split(',')
      }
    };

    this.doParamSearch = () => {
        if (this.classTopics.hvac === true) {
          this.topicParam1 = 'hvac'
        }
        if (this.classTopics.electrical === true) {
          this.topicParam2 = 'electrical'
        }
        if (this.classTopics.mechanical === true) {
          this.topicParam3 = 'mechanical'
        }
        if (this.classTopics.plant === true) {
          this.topicParam4 = 'management'
        }
        if (this.classTopics.all === true) {
          this.topicParam1 = 'all'
        }
        if (this.sliderValues.minValue <= 8) {
          let minDateRange = '0' + (this.sliderValues.minValue + 1);
        }
        let minDateRange = '0' + (this.sliderValues.minValue + 1);
        let maxDateRange = this.sliderValues.maxValue + 1 || '12';

        localStorage.setItem('location', this.courseSearch.location);
        localStorage.setItem('topicParam1', this.topicParam1);
        localStorage.setItem('topicParam2', this.topicParam2);
        localStorage.setItem('topicParam3', this.topicParam3);
        localStorage.setItem('topicParam4', this.topicParam4);
        localStorage.setItem('minDateRange', minDateRange);
        localStorage.setItem('maxDateRange', maxDateRange);
        this.$state.go('results');
        // return courseSearch.getSeminarsBox(location, topicParam1, topicParam2, topicParam3, topicParam4, minDateRange, maxDateRange)
        //   .then((data) => {
        //
        //     // this.$log.debug(data.seminars)
        //     let seminarsData = data.seminars;
        //     this.receiveSeminarData(seminarsData);
        //
        //   });
      }
      // "this.creation" is available by directive option "bindToController: true"
  }

  receiveSeminarData(seminarsData, $rootScope, $state) {
    // let seminarLocations = [];
    // this.seminarLocations = seminarsData;
    //
    // this.$state.go('results');
  }
}
//     this.doParamSearch = () => {
//       if (this.classTopics.hvac === true) {
//         this.topicParam1 = 'hvac'
//       }
//       if (this.classTopics.electrical === true) {
//         this.topicParam2 = 'electrical'
//       }
//       if (this.classTopics.mechanical === true) {
//         this.topicParam3 = 'mechanical'
//       }
//       if (this.classTopics.plant === true) {
//         this.topicParam4 = 'management'
//       }
//       if (this.classTopics.all === true) {
//         this.topicParam1 = 'all'
//       }
//       if (this.sliderValues.minValue <= 8) {
//         let minDateRange = '0'+ (this.sliderValues.minValue+1);
//       }
//
//       let maxDateRange = this.sliderValues.maxValue || '12';
//
//       //'keyword=' + keywordParam
//       this.$http.get(searchAPI +
//           'location=' + this.courseSearch.location +
//           '&topics=' + this.topicParam1 + ',' + this.topicParam2 + ',' + this.topicParam3 + ',' + this.topicParam4 +
//           '&date-start=' + minDateRange + '-01-2016' +
//           '&date-end=' + maxDateRange + '-01-2016')
//         .then((data) => {
//           this.$state.go('results')
//           let seminarsData = data.data.seminars;
//           this.receiveSeminarData(seminarsData);
//           return seminarsData;
//         });
//     }
