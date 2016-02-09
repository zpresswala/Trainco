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
    let seminarLocations = [];
    this.seminarLocations = seminarsData.locationSchedules;
    for (let elem of this.seminarLocations) {
      const semId = elem.id;
      return semId;
    }
  }

  requestSeminarDetails(courseSearch, id) {
    let semId = id;
    return courseSearch.getSeminarDetails(semId).then((data) => {
      this.$log.debug(data)
      let seminarDetail = data;
      return seminarDetail;
    });
  }

  storeCourseId(seminarsData) {
    let courseIden = seminarsData;
    localStorage.setItem('course', this.courseId);
  }
}
