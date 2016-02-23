(function() {
  'use strict'

  angular.module('train')
  .directive('tpcBusyButton', tpcBusyButton)

  tpcBusyButton.$inject = ['$parse']

  function tpcBusyButton($parse) {
    return {
      restrict: 'A',
      scope: {
        tpcBusyMessage: '=',
        tpcBusyWhen: '='
      },
      link: function(scope, element, attrs) {
        scope.originalContent = element.html()
        scope.busyMessage = attrs.tpcBusyMessage || 'Saving...'
        scope.$watch('tpcBusyWhen', function(newValue, oldValue) {
          if (newValue !== oldValue && newValue === true) {

            var busyMessageHtml = String.supplant(
              '<i class="fa fa-spinner fa-spin"></i>&nbsp<span style="text-transform:none">{busyMessage}</span>',
              scope)
            element.attr('disabled', true).html('').append(busyMessageHtml)
          } else {
            // remove the disabled attribute only if either element does not have disabled set
            // or it evaluates to false
            if (!attrs.disabled) {
              element.removeAttr('disabled')
            }
            element.html(scope.originalContent)
          }
        })
      }
    }
  }
})()
