(function() {
  'use strict';

  angular
    .module('train')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: '/app/main/main.html'
      })
      .state('seminar', {
        url: '/seminar',
        templateUrl: '/app/seminar/seminar.html',
        controller: 'SeminarController',
        controllerAs: 'seminar'
      })
      .state('detail', {
        url: '/seminar/:id',
        templateUrl: '/app/seminar/detail/detail.html',
        controller: 'SeminarDetailController',
        controllerAs: 'detail',

        resolve: {
          courseSearch: 'courseSearch',
          seminarDetails: function(courseSearch, $stateParams) {
            var semId = $stateParams.id;
            return courseSearch.getSeminarDetails(semId);
          }
        }
      })
      .state('register', {
        url: '/register',
        controller: 'RegisterController',
        controllerAs: 'register',
        templateUrl: '/app/register/register.html'
      })
      .state('empty', {
        url: '/results',
        templateUrl: '/app/register/results/empty.html',
        parent: 'register'
      })
      .state('results', {
        url: '/results',
        templateUrl: '/app/register/results/results.html',
        parent: 'register'
      })

    $urlRouterProvider.otherwise('/');
  }

})();
