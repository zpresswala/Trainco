export function routerConfig ($stateProvider, $urlRouterProvider) {
  'ngInject';
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'app/main/main.html',
      controller: 'MainController',
      controllerAs: 'main'
    })
    .state('listing', {
      url: '/listing',
      templateUrl: 'app/listing/listing.html',
      controller: 'ListingController',
      controllerAs: 'listing'
    })
    .state('seminar', {
      url: '/seminar',
      templateUrl: 'app/seminar/seminar.html',
      controller: 'SeminarController',
      controllerAs: 'seminar'
    })
    .state('detail', {
      url: '/:id',
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


  $urlRouterProvider.otherwise('/');
}
