import { config } from './index.config';
import { routerConfig } from './index.route';
import { runBlock } from './index.run';
import { MainController } from './main/main.controller';
import { SeminarController } from './seminar/seminar.controller';
import { ListingController } from './listing/listing.controller';
import { SeminarDetailController } from './seminar/detail/detail';
import { services } from './services/index'; // eslint-disable-line
import { RegisterController } from './register/register.controller';
import { FooterDirective } from './components/footer/footer.directive';
import { MainSearchDirective } from './components/mainSearch/mainSearch.directive';
import { CartDirective } from './components/cart/cart.directive';
import { FilterTopicDirective } from './components/filterTopic/filterTopic.directive';
import { KeywordInputDirective } from './components/keywordInput/keywordInput.directive';

angular.module('train', ['ngAnimate','ngSanitize', 'ui.router', 'ui.bootstrap', 'services', 'rzModule', 'angular.filter', 'angularSpinner'])
  .config(config)
  .config(routerConfig)
  .run(runBlock)
  .controller('MainController', MainController)
  .controller('SeminarController', SeminarController)
  .controller('SeminarDetailController', SeminarDetailController)
  .controller('RegisterController', RegisterController)
  .controller('ListingController', ListingController)
  .directive('tpcFooter', FooterDirective)
  .directive('mainSearch', MainSearchDirective)
  .directive('filterTopic', FilterTopicDirective)
  .directive('keywordInput', KeywordInputDirective)
  .directive('shoppingCart', CartDirective)
  .animation('.slide-toggle', ['$animateCss', function($animateCss) {
      let lastId = 0;
      let _cache = {};

      function getId(el) {
        let id = el[0].getAttribute('data-slide-toggle');
        if (!id) {
          id = ++lastId;
          el[0].setAttribute('data-slide-toggle', id);
        }
        return id;
      }

      function getState(id) {
        let state = _cache[id];
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
            let state = getState(getId(element));
            let height = (state.animating && state.height) ?
              state.height : element[0].offsetHeight;

            let animator = $animateCss(element, {
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
            let state = getState(getId(element));
            let height = (state.animating && state.height) ?
              state.height : element[0].offsetHeight;

            let animator = $animateCss(element, {
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
    }]);
