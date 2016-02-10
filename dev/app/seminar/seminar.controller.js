import { calculateTotalPrice } from '../utils';
export class SeminarController {
  constructor($log, courseSearch, cartService, $rootScope, $scope) {
    'ngInject';

    this.$log = $log;
    this.cartService = cartService;
    this.$rootScope = $rootScope;
    this.courseId = {};
    this.activate();
    this.requestSeminarData(courseSearch);
    //this.requestSeminarDetails(courseSearch);

    this.detailPop = {
      templateUrl: 'app/seminar/seminarPop.html',
    };

    this.location = {};

    this.addItemToCart = (item, qty) => {
      cartService.addItem(item, qty);
      this.cartItemList = cartService.getCartItems() || [];
      this.cartTotalPrice = calculateTotalPrice(this.cartItemList);
      $rootScope.$broadcast('cartUpdated', this.cartItemList);
    };

    this.monthsSlider = {
      minValue: 0, // initial position for left handle
      maxValue: 8, // initial position for right handle
      options: {
        floor: 0, // left most value
        ceil: 15, // right most value
        showTicks: true,
        showSelectionBarEnd: true,
        showTicksValues: true,
        stepsArray: ' ,JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEPT,OCT,NOV,DEC,JAN,'.split(',')
      }
    };

    let minMonthNumber = this.monthsSlider.minValue + 1;
    let maxMonthNumber = this.monthsSlider.maxValue + 1;
    //this.monthMin = minMonthNumber;
    let minDateRange = minMonthNumber;
    let minDateParam = minDateRange + '-2016';
    this.monthMin = this.monthsSlider.minValue + 1 + '-2016'; //minDateParam
  }
  activate() {
    const classId = localStorage.getItem('classId');
  }
  requestSeminarData(courseSearch) {
    const classId = localStorage.getItem('classId');

    return courseSearch.getSeminars(classId).then((data) => {
      let seminarsData = data.seminars[0];
      this.receiveSeminarData(seminarsData);
      return seminarsData;
    });
  }

  receiveSeminarData(seminarsData) {
    this.seminarLocations = seminarsData.locationSchedules;
    let seminarLocationsArray = this.seminarLocations;
    seminarLocationsArray.forEach((location, index) => {
      const dateF = location.dateFilter;
    //  this.$log.debug(dateF)
      return dateF;
    });
  }

  // requestSeminarDetails(courseSearch, id) {
  //   let semId = id;
  //   return courseSearch.getSeminarDetails(semId).then((data) => {
  //     this.$log.debug(data)
  //     let seminarDetail = data;
  //     return seminarDetail;
  //   });
  // }

  storeCourseId(seminarsData) {
    let courseIden = seminarsData;
    localStorage.setItem('course', this.courseId);
  }
}
