import { LoadingInterceptor } from './services';
export function config ($logProvider, $httpProvider, $urlRouterProvider) {
  'ngInject';
  $urlRouterProvider.when('', '/');
  $urlRouterProvider.otherwise('/');
  $logProvider.debugEnabled(true);
  $httpProvider.interceptors.push('loadingInterceptor');
}
