export class RegisterController {
  constructor ($log, searchService, $http) {
    'ngInject';

    this.$log = $log;
    this.$http = $http;
    // this.mainSearch(searchService);
    this.courseId = {};
    this.activate();

      /**
       * Handle key input
       * @param  {object} e the event
       * ng-keydown="searchInput.handleInput($event)"
       */
      this.handleLocInput = (e) => {
        if (e.keyCode === 13 && this.locSearchFilter.location) {

          this.doSearch();
        }
      }

      this.doLocSearch = () => {
        this.$http.get('http://trainco.axial-client.com/api/seminars2/search/?location=' + this.searchFilter.location).
        then(function(data) {

        });
      }

      this.doParamSearch = () => {
        // this.$http.get('http://trainco.axial-client.com/api/seminars2/search/?' + )
      }

  }

  activate() {

  }
  // mainSearch(searchService, searchFilter) {
  //   let params = {
  //       this.searchFilter.location
  //   }
  //   return searchService.performSearch(params)
  //   .then((data) => {
  //     this.$log.debug(data)
  //     let searchCollection = data;
  //
  //     return searchCollection;
  //   });
  // }
}
