/**
 * @ngdoc animation
 * @name train.common.animation:.drop-in
 * @description ng-Animate drop-in css animation.
 */

(function(){

  'use strict';

  angular
    .module('train.common') /* @ngInject */
    .animation('.drop-in', function($timeout) {
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
