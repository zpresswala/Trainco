export class MainController {
  constructor ($timeout) {
    'ngInject';

    this.classAnimation = '';
    this.creationDate = 1453481402040;

    this.activate($timeout);
  }

  activate($timeout) {
    $timeout(() => {
      this.classAnimation = 'rubberBand';
    }, 4000);
  }
}
