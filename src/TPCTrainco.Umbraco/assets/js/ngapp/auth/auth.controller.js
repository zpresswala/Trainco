(function() {
  'use strict';

  angular
    .module('train.auth')
    .controller('AuthbarController', AuthbarController);

  AuthbarController.$inject = ['$log'];
  /** @ngInject */
  function AuthbarController($log) {
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
  }
})();
