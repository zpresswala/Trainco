export class RegisterController {
  constructor ($log, searchService, $http) {
    'ngInject';

    this.$log = $log;
    this.$http = $http;
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

      this.doLocSearch = () => {
        this.$http.get('http://trainco.axial-client.com/api/seminars2/search/?location=' + this.locSearchFilter.location).
        then((data) => {
          this.$log.debug(data);
          let seminarsData = data.data.seminars;
            this.receiveSeminarData(seminarsData);
            return seminarsData;
        });
      }

      this.doParamSearch = () => {
        let searchParams = {
          'keyword': keyword,
          'topic': topic,
          'location':location,
          'radius':radius,
          'date-start':dateStart,
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
