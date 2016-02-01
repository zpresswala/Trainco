export class RegisterController {
  constructor($log, searchService, $http, $state, $scope) {
    'ngInject';
    this.$state = $state;
    this.$log = $log;
    this.$scope = $scope;
    this.$http = $http;

    const searchAPI = 'http://trainco.axial-client.com/api/seminars2/search/?';
    // this.mainSearch(searchService);
    this.courseId = {};

    /**
     * Handle key input
     * @param  {object} e the event
     * ng-keydown="searchInput.handleInput($event)"
     */
    this.handleLocInput = (e) => {
      if (e.keyCode === 13 && this.locSearchFilter.location) {

        this.doLocSearch();
      }
    }
    /**
     * Watches the locationAll checkbox and runs on checked.
     * @method function
     * @return {array} returns the array seminarsData containing all locations.
     */
    this.stateChanged = function() {
      if (this.locSearchFilter.locationAll) { //If it is checked
        this.$http.get(searchAPI + 'location=all').
        then((data) => {
          this.$state.go('results')
          let seminarsData = data.data.seminars;
          this.receiveSeminarData(seminarsData);
          return seminarsData;
        });
      }
    }
    this.doLocSearch = () => {
        this.$http.get(searchAPI + 'location=' + this.locSearchFilter.location).
        then((data) => {
          this.$state.go('results')
          let seminarsData = data.data.seminars;
          this.receiveSeminarData(seminarsData);
          return seminarsData;
        });
      }
      /**
       * Settings for the mileage slider.
       * @type {Object}
       * this.mileRange.value = ng-model.
       */
    this.mileRange = {
      options: {
        floor: 50,
        ceil: 1000,
        step: 50
      }
    }

    this.$log.debug(this.mileRange.value)
    this.doParamSearch = () => {
      let searchParams = {
          'keyword': keyword,
          'topic': topic,
          'location': location,
          'radius': this.mileRange.value,
          'date-start': dateStart,
          'date-end': dateEnd
        }
        // this.$http.get('http://trainco.axial-client.com/api/seminars2/search/?' + )
    }

  }
  receiveSeminarData(seminarsData) {
    let seminarLocations = [];
    this.seminarLocations = seminarsData;
  }
}
