(function() {
  'use strict';

  angular
    .module('train.seminar')
    .controller('SeminarItemController', SeminarItemController);

  SeminarItemController.$inject = ['$log', '$http', '$uibModal', 'CONSTANTS'];
  /** @ngInject */
  function SeminarItemController($log, $http, $uibModal, CONSTANTS) {
    var vm = this;
    var apiSave = CONSTANTS.API_SAVE;
    var classId = localStorage.getItem('classId');
    vm.buttonText = 'Save';
    vm.saveBtn = true;
    var LOGIN_TPL = '<div class="modal-header">'+
        '<i style="float:right;" class="fa fa-close" ng-click="cancel()"></i>'+
        '<h1 class="modal-title">Log in to save this seminar</h1>' +
        '</div>' +
        '<div class="modal-body">'+
        '<form ng-submit="login()"><div class="form-group"><label class="form-label">Email</label>'+
        '<input class="form-control" ng-model="username" type="text"></div><div class"form-group">'+
        '<label class="form-label">Password</label><input class="form-control" ng-model="password" type="password">'+
        '</div><div class="row"><button class="btn-blue-modal" type="submit">Log in</button>'+
        '<a href="/dashboard/forgot-password" class="forgotPW">Forgot Password?</a></div></div>'+
        '<div class="modal-footer"><div class="row"><p>Create an account to save courses, get recommendations, and more.'+
        '</p></div><div class="row"><button class="btn-blue-modal" type="button">'+
        '<a href="/dashboard/signup">Create an Account</a></button></div></div>';
    vm.open = function (size) {
    var modalInstance = $uibModal.open({
      animation: vm.animationsEnabled,
      template: LOGIN_TPL,
      controller: 'LoginModalController',
      size: 'lg'
    });

    modalInstance.result.then(function() {
      vm.selected = selectedItem;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

    vm.saveCourseToUser = function() {
      var data = {
        courseId: classId
      };
      $http.put(apiSave, data, {
        headers: {
          'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('tcJWT'))
        }
      }).then(function(response) {
        vm.saveBtn = false;
        vm.buttonText = 'Saved!';
      }).catch(function(error) {
        $uibModal.open({
          animation: vm.animationsEnabled,
          template: LOGIN_TPL,
          controller: 'LoginModalController',
          size: 'lg'
        });
      });
    };
  }
})();
