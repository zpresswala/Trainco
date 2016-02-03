import cities from './cities';
export function MainSearchDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    templateUrl: 'app/components/mainSearch/mainSearch.html',
    scope: {
    },
    controller: MainSearchController,
    controllerAs: 'vm',
    bindToController: true
  };

  return directive;
}

class MainSearchController {
  constructor (searchService, $http, $log) {
    'ngInject';
      this.$http = $http;
      this.$log = $log;
      this.apiHost = 'http://trainco-dev.imulus-client.com/api/seminars/search';
      this.searchService = searchService;
      this.cities = cities.cities;
    //Range slider with ticks and values
    this.sliderValues = {
        minValue: 1,
        maxValue: 8,
        options: {
          showTicksValues: true,
          stepsArray: 'JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEPT,OCT,NOV,DEC,JAN,FEB,MAR'.split(',')
        }
        // options: {
        //     ceil: 11,
        //     floor: 0,
        //     showTicksValues: true
        // }

    };
    this.dateStuff();
    this.$log.debug(this.sliderValues.options.stepsArray.length);
    // "this.creation" is available by directive option "bindToController: true"
  }
    postCourseSearch() {
      this.$http.get(this.apiHost, this.course).then((response) => {
        return response.data;
      })
      .catch((error) => {
        this.$log.error('XHR Failed for Course Data.\n' + angular.toJson(error.data, true));
      });
    }

    dateStuff() {
      let minDate = new Date();
      minDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
      this.minMonth = minDate.getMonth();
      this.$log.debug('asdfasf ' + this.minMonth);
      const months = ['JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEPT,OCT,NOV,DEC'];
    }
}
