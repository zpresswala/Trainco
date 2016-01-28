export class SeminarController {
  constructor ($log, courseSearch) {
    'ngInject';

    this.$log = $log;

    this.courseId = {};
    this.activate();
    this.requestSeminarData(courseSearch);
    this.isCollapsed = true;

    this.dynamicPopover = {
      templateUrl: 'app/seminar/seminarPop.html'
    };
    this.addToCart();
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
    let semD = seminarsData;
    this.$log.debug(semD);
    this.seminarLocations = semD.locationSchedules;
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
