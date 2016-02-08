import { calculateTotalPrice } from '../utils';
export class SeminarController {
  constructor($log, courseSearch, cartService, $rootScope) {
    'ngInject';

    this.$log = $log;
    this.cartService = cartService;
    this.$rootScope = $rootScope;
    this.courseId = {};
    this.activate();
    this.requestSeminarData(courseSearch);
    this.requestSeminarDetails(courseSearch);
    this.isCollapsed = true;

    this.dynamicPopover = {
      templateUrl: 'app/seminar/seminarPop.html',
    };


    // this.registerSem = function() {
    //   this.requestSeminarDetails();
    // }

    this.location = {};
    this.demo1 = {
      min: 0,
      max: 500
    };

        this.addItemToCart = (item, qty) => {
          cartService.addItem(item, qty);
          this.cartItemList = cartService.getCartItems() || [];
          this.cartTotalPrice = calculateTotalPrice(this.cartItemList);
          $rootScope.$broadcast('cartUpdated', this.cartItemList);
        };

  }
  activate() {
    const classId = localStorage.getItem('classId');
    this.$log.debug(classId);
  }
  requestSeminarData(courseSearch) {
    const classId = localStorage.getItem('classId');

    return courseSearch.getSeminars(classId).then((data) => {
      this.$log.debug(data.seminars[0])
      let seminarsData = data.seminars[0];
      this.receiveSeminarData(seminarsData);
      return seminarsData;
    });
  }

  receiveSeminarData(seminarsData) {
    let seminarLocations = [];
    this.seminarLocations = seminarsData.locationSchedules;
    for (let elem of this.seminarLocations) {
      const semId = elem.id;
      return semId;
    }
  }

  requestSeminarDetails(courseSearch, id) {
    //const semId = localStorage.getItem('classId');
    let semId = id;
    return courseSearch.getSeminarDetails(semId).then((data) => {
      this.$log.debug(data)
      let seminarDetail = data;
      // this.receiveSeminarData(seminarDetail);
      return seminarDetail;
    });
  }

  storeCourseId(seminarsData) {
    let courseIden = seminarsData;
    this.$log.debug(courseIden)
    localStorage.setItem('course', this.courseId);
  }
}
