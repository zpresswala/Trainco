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
  constructor($state) {
    'ngInject';
    this.$state = $state;
    this.cities = cities.cities;

    this.classTopics = {};
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
      }
  }
}
