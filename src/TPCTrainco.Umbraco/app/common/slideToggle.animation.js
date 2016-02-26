/**
 * @ngdoc animation
 * @name train.common.filer:.slideToggle
 * @description < description placeholder >
 * @param {object} input object to be filtered
 * @returns {object} < returns placeholder >
 */

(function(){

  'use strict';

  angular
    .module('train.common')
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
                state.doneFn = generateRunner(true,
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
    }]).animation('.drop-in', function($timeout) {
      var heightAndTopMargin = function(element) {
        return parseInt(element.clientHeight) + parseInt(getComputedStyle(element).marginTop);
      }
      return {
        addClass: function(element, className) {
          element.css('display', 'block');
          element.css('top', -heightAndTopMargin(element[0]) + 'px');
          $timeout(function() {
            TweenLite.to(element, 0.5, {
              top: 0
            })
          }, 0);
        },
        removeClass: function(element, className) {
          element.css('top', -heightAndTopMargin(element[0]) + 'px');
          // TweenLite.to(element, 0.5, {top: -element.outerHeight()});
        }
      };
    });
}());
