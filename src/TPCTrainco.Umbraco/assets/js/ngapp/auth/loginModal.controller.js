(function() {
  'use strict';

  angular
    .module('train.auth')
    .controller('LoginModalController', LoginModalController);

  LoginModalController.$inject = ['$log', '$scope', '$uibModalInstance', '$http', '$window', 'CONSTANTS'];
  /** @ngInject */
  function LoginModalController($log, $scope, $uibModalInstance, $http, $window, CONSTANTS) {
    $scope.formData = {};


    $scope.login = function() {
      $scope.formData = {
          username: $scope.username,
          password: $scope.password
        };
      $http.post(CONSTANTS.API_ACCOUNT + '/login', $scope.formData)
      .then(function(response) {
        console.log(response)
        var token = response.data.result;
        localStorage.setItem('tcJWT', token)
        $window.location.href = '/dashboard/saved';
      })
    }
    $scope.ok = function () {
       $uibModalInstance.close();
     };

     $scope.cancel = function () {
       $uibModalInstance.dismiss('cancel');
     };

  }
})();
