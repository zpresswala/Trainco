(function() {
  'use strict';

  angular
    .module('train.auth')
    .controller('AuthbarController', AuthbarController);

  AuthbarController.$inject = ['$log', '$uibModal'];
  /** @ngInject */
  function AuthbarController($log, $uibModal) {
    var vm = this;

    var authToken = JSON.parse(localStorage.getItem('tcJWT'));
    checkForLogin(authToken);

    function checkForLogin(authToken) {
      if (!authToken) {
        vm.isLoggedIn = false;
      } else {
        return vm.isLoggedIn = true;
      }
    }

    vm.logout = function() {
      localStorage.removeItem('tcJWT');
      vm.isLoggedIn = false;
    }
    vm.open = function (size) {

    var modalInstance = $uibModal.open({
      animation: vm.animationsEnabled,
      templateUrl: '/app/auth/loginModal.html',
      controller: 'LoginModalController',
      size: size
    });

    modalInstance.result.then(function (selectedItem) {
      vm.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

  }
})();
