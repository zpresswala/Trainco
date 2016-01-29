export class SeminarDetailController {
  constructor ($log, $stateParams, courseSearch, seminarDetails) {
    'ngInject';

    this.$log = $log;
    this.seminarDateDetails = {};

    this.semId = $stateParams.id;
    this.details = courseSearch.getSeminarDetails(this.semId);
    this.seminarDetails = seminarDetails;

    this.resolveDetails(seminarDetails);
  }

  resolveDetails(seminarDetails) {
    this.$log.debug(seminarDetails)
    this.seminarDateDetails = seminarDetails.scheduleDetail.scheduleList;
    return this.seminarDateDetails;
  }
}
