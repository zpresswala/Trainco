export function LocationInputDirective() {
  'ngInject';

  let directive = {
    restrict: 'E',
    link: {
      function ($scope, element) {
        element.bind("keyup", function (event) {
          var val = element.val();
          if(val.length > 2) {
            $scope.search(val);
          }
        });
    }
  },
    controller: LocationInputController,
    controllerAs: 'vm',
    bindToController: true
  }

  return directive;
}
class LocationInputController {
    function($http) {

    this.search= function(val) {
return $http.get('http://trainco.axial-client.com/api/seminars2/search', + '/' + val)
}

    }
}
