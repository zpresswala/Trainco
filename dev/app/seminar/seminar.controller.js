export class SeminarController {
  constructor($log, courseSearch) {
    'ngInject';

    this.$log = $log;

    this.courseId = {};
    this.activate();
    this.requestSeminarData(courseSearch);
    this.requestSeminarDetails(courseSearch);
    this.isCollapsed = true;

    this.dynamicPopover = {
      templateUrl: 'app/seminar/detail/detail.html'
    };
    this.addToCart();

    this.registerSem = function() {
      this.requestSeminarDetails();
    }

    this.location = {};
    this.demo1 = {
      min: 0,
      max: 500
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
      this.$log.debug('kek', elem.id)
      return semId;
    }
  }

  requestSeminarDetails(courseSearch) {
    //const semId = localStorage.getItem('classId');
    let semId
    return courseSearch.getSeminarDetails(semId).then((data) => {
      this.$log.debug(data)
      let seminarDetail = data;
      // this.receiveSeminarData(seminarDetail);
      return seminarDetail;
    });
  }

  addToCart() {
    this.$log.debug(this.attendees)
    localStorage.setItem('attendees', this.attendees);
  }

  storeCourseId(seminarsData) {
    let courseIden = seminarsData;
    this.$log.debug(courseIden)
    localStorage.setItem('course', this.courseId);
  }
}
