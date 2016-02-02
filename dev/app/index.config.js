import { LoadingInterceptor } from './services';
export function config ($logProvider, $httpProvider) {
  'ngInject';
  // Enable log
  $logProvider.debugEnabled(true);
  $httpProvider.interceptors.push('loadingInterceptor');
}
