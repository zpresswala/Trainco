(function() {
  'use strict';

  angular
    .module('train.auth')
    .controller('LoginModalController', LoginModalController);

  LoginModalController.$inject = ['$log', '$scope', '$uibModalInstance', '$http', '$window'];
  /** @ngInject */
  function LoginModalController($log, $scope, $uibModalInstance, $http, $window) {
    $scope.formData = {};


    $scope.login = function() {
      $scope.formData = {
          username: $scope.username,
          password: $scope.password
        };
      $http.post('http://trainco-phase1.axial-client.com/api/account/login', $scope.formData)
      .then(function(response) {
        console.log(response)
        var token = JSON.stringify(response.data.result)
        localStorage.setItem('tcJWT', token)
        $window.location.href = '/dashboard';
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
