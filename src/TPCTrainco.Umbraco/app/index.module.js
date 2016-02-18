/**
 * @ngdoc overview
 * @name train
 * @description
 * The main module for the trainco
 */

(function() {
  'use strict';

  angular
    .module('train', [
      // 'train.seminar',
      'ngAnimate',
      'ngSanitize',
      'ui.router',
      'ui.bootstrap',
      'selector',
      'rzModule',
      'ngStorage',
      'angular.filter',
      'darthwade.loading'
    ])
    .config(configure)
    .run(runBlock)
    .animation('.slide-toggle', ['$animateCss', function($animateCss) {
      var lastId = 0;
      var _cache = {};

      function getId(el) {
        var id = el[0].getAttribute('data-slide-toggle');
        if (!id) {
          id = ++lastId;
          el[0].setAttribute('data-slide-toggle', id);
        }
        return id;
      }

      function getState(id) {
        var state = _cache[id];
        if (!state) {
          state = {};
          _cache[id] = state;
        }
        return state;
      }

      function generateRunner(closing, state, animator, element, doneFn) {
        return function() {
          state.animating = true;
          state.animator = animator;
          state.doneFn = doneFn;
          animator.start().finally(function() {
            if (closing && state.doneFn === doneFn) {
              element[0].style.height = '';
            }
            state.animating = false;
            state.animator = undefined;
            state.doneFn();
          });
        }
      }

      return {
        addClass: function(element, className, doneFn) {
          if (className == 'ng-hide') {
            var state = getState(getId(element));
            var height = (state.animating && state.height) ?
              state.height : element[0].offsetHeight;

            var animator = $animateCss(element, {
              from: {
                height: height + 'px',
                opacity: 1
              },
              to: {
                height: '0px',
                opacity: 0
              }
            });
            if (animator) {
              if (state.animating) {
                state.doneFn =
                  generateRunner(true,
                    state,
                    animator,
                    element,
                    doneFn);
                return state.animator.end();
              } else {
                state.height = height;
                return generateRunner(true,
                  state,
                  animator,
                  element,
                  doneFn)();
              }
            }
          }
          doneFn();
        },
        removeClass: function(element, className, doneFn) {
          if (className == 'ng-hide') {
            var state = getState(getId(element));
            var height = (state.animating && state.height) ?
              state.height : element[0].offsetHeight;

            var animator = $animateCss(element, {
              from: {
                height: '0px',
                opacity: 0
              },
              to: {
                height: height + 'px',
                opacity: 1
              }
            });

            if (animator) {
              if (state.animating) {
                state.doneFn = generateRunner(false,
                  state,
                  animator,
                  element,
                  doneFn);
                return state.animator.end();
              } else {
                state.height = height;
                return generateRunner(false,
                  state,
                  animator,
                  element,
                  doneFn)();
              }
            }
          }
          doneFn();
        }
      };
    }])


  /** @ngInject */
  function configure($logProvider, $httpProvider, $urlRouterProvider, $localStorageProvider, $locationProvider) {
    /**
     * @ngdoc function
     * @name  config
     * @description
     * main configuration for trainco app.
     */
          $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
          });
    $logProvider.debugEnabled(true);
    $localStorageProvider.setKeyPrefix('tpc');
      $urlRouterProvider.when('', '/');
      $urlRouterProvider.otherwise('/');
  }

    /** @ngInject */
    function runBlock($log, $rootScope, $state, $stateParams, $timeout) {
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) { //eslint-disable-line
        $state.previous = _.clone($state);
        $state.toState = toState;
        $state.toParams = toParams;
        $state.fromState = fromState;
        $state.fromParams = fromParams;
      });

      $rootScope.$on('$stateChangeSuccess', function(e, toState, toParams, fromState, fromParams) {//eslint-disable-line
        $timeout(function() {
          $rootScope.$emit('$stateChangeRender');
        });
      });

      $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {//eslint-disable-line
        /*eslint no-console:0 */
        console.log.bind(console)
      })
    }
})();
