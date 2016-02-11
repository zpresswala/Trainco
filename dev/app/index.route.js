export function routerConfig($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    })
    .state('seminar', {
      url: '/seminar',
      templateUrl: 'app/seminar/seminar.html',
      controller: 'SeminarController',
      controllerAs: 'seminar'
    })
    .state('detail', {
      url: '/seminar/:id',
      templateUrl: 'app/seminar/detail/detail.html',
      controller: 'SeminarDetailController',
      controllerAs: 'detail',

      resolve: {
        courseSearch: 'courseSearch',
        seminarDetails: function(courseSearch, $stateParams) {
          let semId = $stateParams.id;
          return courseSearch.getSeminarDetails(semId);
        }
      }
    })
    .state('register', {
      url: '/register',
      controller: 'RegisterController',
      controllerAs: 'register',
      templateUrl: 'app/register/register.html'
    })
    .state('empty', {
      url: '/results',
      templateUrl: 'app/register/results/empty.html',
      parent: 'register'
    })
    .state('results', {
      url: '/results',
      templateUrl: 'app/register/results/results.html',
      parent: 'register'
    })
    .state('checkout', {
      url: '/checkout',
      templateUrl: 'app/checkout/checkout.html',
      controller: 'CheckoutController'

    })
    .state('checkout.attendees', {
      url: '/attendees',
      templateUrl: 'app/checkout/attendees.html'
    })
    .state('checkout.information', {
      url: '/information',
      templateUrl: 'app/checkout/information.html'
    })

  $urlRouterProvider.otherwise('/');
}
