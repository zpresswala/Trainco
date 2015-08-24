/* ========================================================================
 * Bootstrap: carousel.js v3.0.0
 * http://twbs.github.com/bootstrap/javascript.html#carousel
 * ========================================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */


+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(window.jQuery);
/* ========================================================================
 * Bootstrap: collapse.js v3.3.5
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.5'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: dropdown.js v3.3.5
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.5'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);
/* ========================================================================
 * Bootstrap: popover.js v3.3.5
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.5'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.5
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.5'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.5
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);
/*! jQRangeSlider 5.7.1 - 2015-01-23 - Copyright (C) Guillaume Gautreau 2012 - MIT and GPLv3 licenses.*/!function(a){"use strict";a.widget("ui.rangeSliderMouseTouch",a.ui.mouse,{enabled:!0,_mouseInit:function(){var b=this;a.ui.mouse.prototype._mouseInit.apply(this),this._mouseDownEvent=!1,this.element.bind("touchstart."+this.widgetName,function(a){return b._touchStart(a)})},_mouseDestroy:function(){a(document).unbind("touchmove."+this.widgetName,this._touchMoveDelegate).unbind("touchend."+this.widgetName,this._touchEndDelegate),a.ui.mouse.prototype._mouseDestroy.apply(this)},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},destroy:function(){this._mouseDestroy(),a.ui.mouse.prototype.destroy.apply(this),this._mouseInit=null},_touchStart:function(b){if(!this.enabled)return!1;b.which=1,b.preventDefault(),this._fillTouchEvent(b);var c=this,d=this._mouseDownEvent;this._mouseDown(b),d!==this._mouseDownEvent&&(this._touchEndDelegate=function(a){c._touchEnd(a)},this._touchMoveDelegate=function(a){c._touchMove(a)},a(document).bind("touchmove."+this.widgetName,this._touchMoveDelegate).bind("touchend."+this.widgetName,this._touchEndDelegate))},_mouseDown:function(b){return this.enabled?a.ui.mouse.prototype._mouseDown.apply(this,[b]):!1},_touchEnd:function(b){this._fillTouchEvent(b),this._mouseUp(b),a(document).unbind("touchmove."+this.widgetName,this._touchMoveDelegate).unbind("touchend."+this.widgetName,this._touchEndDelegate),this._mouseDownEvent=!1,a(document).trigger("mouseup")},_touchMove:function(a){return a.preventDefault(),this._fillTouchEvent(a),this._mouseMove(a)},_fillTouchEvent:function(a){var b;b="undefined"==typeof a.targetTouches&&"undefined"==typeof a.changedTouches?a.originalEvent.targetTouches[0]||a.originalEvent.changedTouches[0]:a.targetTouches[0]||a.changedTouches[0],a.pageX=b.pageX,a.pageY=b.pageY,a.which=1}})}(jQuery),function(a){"use strict";a.widget("ui.rangeSliderDraggable",a.ui.rangeSliderMouseTouch,{cache:null,options:{containment:null},_create:function(){a.ui.rangeSliderMouseTouch.prototype._create.apply(this),setTimeout(a.proxy(this._initElementIfNotDestroyed,this),10)},destroy:function(){this.cache=null,a.ui.rangeSliderMouseTouch.prototype.destroy.apply(this)},_initElementIfNotDestroyed:function(){this._mouseInit&&this._initElement()},_initElement:function(){this._mouseInit(),this._cache()},_setOption:function(b,c){"containment"===b&&(this.options.containment=null===c||0===a(c).length?null:a(c))},_mouseStart:function(a){return this._cache(),this.cache.click={left:a.pageX,top:a.pageY},this.cache.initialOffset=this.element.offset(),this._triggerMouseEvent("mousestart"),!0},_mouseDrag:function(a){var b=a.pageX-this.cache.click.left;return b=this._constraintPosition(b+this.cache.initialOffset.left),this._applyPosition(b),this._triggerMouseEvent("sliderDrag"),!1},_mouseStop:function(){this._triggerMouseEvent("stop")},_constraintPosition:function(a){return 0!==this.element.parent().length&&null!==this.cache.parent.offset&&(a=Math.min(a,this.cache.parent.offset.left+this.cache.parent.width-this.cache.width.outer),a=Math.max(a,this.cache.parent.offset.left)),a},_applyPosition:function(a){var b={top:this.cache.offset.top,left:a};this.element.offset({left:a}),this.cache.offset=b},_cacheIfNecessary:function(){null===this.cache&&this._cache()},_cache:function(){this.cache={},this._cacheMargins(),this._cacheParent(),this._cacheDimensions(),this.cache.offset=this.element.offset()},_cacheMargins:function(){this.cache.margin={left:this._parsePixels(this.element,"marginLeft"),right:this._parsePixels(this.element,"marginRight"),top:this._parsePixels(this.element,"marginTop"),bottom:this._parsePixels(this.element,"marginBottom")}},_cacheParent:function(){if(null!==this.options.parent){var a=this.element.parent();this.cache.parent={offset:a.offset(),width:a.width()}}else this.cache.parent=null},_cacheDimensions:function(){this.cache.width={outer:this.element.outerWidth(),inner:this.element.width()}},_parsePixels:function(a,b){return parseInt(a.css(b),10)||0},_triggerMouseEvent:function(a){var b=this._prepareEventData();this.element.trigger(a,b)},_prepareEventData:function(){return{element:this.element,offset:this.cache.offset||null}}})}(jQuery),function(a,b){"use strict";a.widget("ui.rangeSlider",{options:{bounds:{min:0,max:100},defaultValues:{min:20,max:50},wheelMode:null,wheelSpeed:4,arrows:!0,valueLabels:"show",formatter:null,durationIn:0,durationOut:400,delayOut:200,range:{min:!1,max:!1},step:!1,scales:!1,enabled:!0,symmetricPositionning:!1},_values:null,_valuesChanged:!1,_initialized:!1,bar:null,leftHandle:null,rightHandle:null,innerBar:null,container:null,arrows:null,labels:null,changing:{min:!1,max:!1},changed:{min:!1,max:!1},ruler:null,_create:function(){this._setDefaultValues(),this.labels={left:null,right:null,leftDisplayed:!0,rightDisplayed:!0},this.arrows={left:null,right:null},this.changing={min:!1,max:!1},this.changed={min:!1,max:!1},this._createElements(),this._bindResize(),setTimeout(a.proxy(this.resize,this),1),setTimeout(a.proxy(this._initValues,this),1)},_setDefaultValues:function(){this._values={min:this.options.defaultValues.min,max:this.options.defaultValues.max}},_bindResize:function(){var b=this;this._resizeProxy=function(a){b.resize(a)},a(window).resize(this._resizeProxy)},_initWidth:function(){this.container.css("width",this.element.width()-this.container.outerWidth(!0)+this.container.width()),this.innerBar.css("width",this.container.width()-this.innerBar.outerWidth(!0)+this.innerBar.width())},_initValues:function(){this._initialized=!0,this.values(this._values.min,this._values.max)},_setOption:function(a,b){this._setWheelOption(a,b),this._setArrowsOption(a,b),this._setLabelsOption(a,b),this._setLabelsDurations(a,b),this._setFormatterOption(a,b),this._setBoundsOption(a,b),this._setRangeOption(a,b),this._setStepOption(a,b),this._setScalesOption(a,b),this._setEnabledOption(a,b),this._setPositionningOption(a,b)},_validProperty:function(a,b,c){return null===a||"undefined"==typeof a[b]?c:a[b]},_setStepOption:function(a,b){"step"===a&&(this.options.step=b,this._leftHandle("option","step",b),this._rightHandle("option","step",b),this._changed(!0))},_setScalesOption:function(a,b){"scales"===a&&(b===!1||null===b?(this.options.scales=!1,this._destroyRuler()):b instanceof Array&&(this.options.scales=b,this._updateRuler()))},_setRangeOption:function(a,b){"range"===a&&(this._bar("option","range",b),this.options.range=this._bar("option","range"),this._changed(!0))},_setBoundsOption:function(a,b){"bounds"===a&&"undefined"!=typeof b.min&&"undefined"!=typeof b.max&&this.bounds(b.min,b.max)},_setWheelOption:function(a,b){("wheelMode"===a||"wheelSpeed"===a)&&(this._bar("option",a,b),this.options[a]=this._bar("option",a))},_setLabelsOption:function(a,b){if("valueLabels"===a){if("hide"!==b&&"show"!==b&&"change"!==b)return;this.options.valueLabels=b,"hide"!==b?(this._createLabels(),this._leftLabel("update"),this._rightLabel("update")):this._destroyLabels()}},_setFormatterOption:function(a,b){"formatter"===a&&null!==b&&"function"==typeof b&&"hide"!==this.options.valueLabels&&(this._leftLabel("option","formatter",b),this.options.formatter=this._rightLabel("option","formatter",b))},_setArrowsOption:function(a,b){"arrows"!==a||b!==!0&&b!==!1||b===this.options.arrows||(b===!0?(this.element.removeClass("ui-rangeSlider-noArrow").addClass("ui-rangeSlider-withArrows"),this.arrows.left.css("display","block"),this.arrows.right.css("display","block"),this.options.arrows=!0):b===!1&&(this.element.addClass("ui-rangeSlider-noArrow").removeClass("ui-rangeSlider-withArrows"),this.arrows.left.css("display","none"),this.arrows.right.css("display","none"),this.options.arrows=!1),this._initWidth())},_setLabelsDurations:function(a,b){if("durationIn"===a||"durationOut"===a||"delayOut"===a){if(parseInt(b,10)!==b)return;null!==this.labels.left&&this._leftLabel("option",a,b),null!==this.labels.right&&this._rightLabel("option",a,b),this.options[a]=b}},_setEnabledOption:function(a,b){"enabled"===a&&this.toggle(b)},_setPositionningOption:function(a,b){"symmetricPositionning"===a&&(this._rightHandle("option",a,b),this.options[a]=this._leftHandle("option",a,b))},_createElements:function(){"absolute"!==this.element.css("position")&&this.element.css("position","relative"),this.element.addClass("ui-rangeSlider"),this.container=a("<div class='ui-rangeSlider-container' />").css("position","absolute").appendTo(this.element),this.innerBar=a("<div class='ui-rangeSlider-innerBar' />").css("position","absolute").css("top",0).css("left",0),this._createHandles(),this._createBar(),this.container.prepend(this.innerBar),this._createArrows(),"hide"!==this.options.valueLabels?this._createLabels():this._destroyLabels(),this._updateRuler(),this.options.enabled||this._toggle(this.options.enabled)},_createHandle:function(b){return a("<div />")[this._handleType()](b).bind("sliderDrag",a.proxy(this._changing,this)).bind("stop",a.proxy(this._changed,this))},_createHandles:function(){this.leftHandle=this._createHandle({isLeft:!0,bounds:this.options.bounds,value:this._values.min,step:this.options.step,symmetricPositionning:this.options.symmetricPositionning}).appendTo(this.container),this.rightHandle=this._createHandle({isLeft:!1,bounds:this.options.bounds,value:this._values.max,step:this.options.step,symmetricPositionning:this.options.symmetricPositionning}).appendTo(this.container)},_createBar:function(){this.bar=a("<div />").prependTo(this.container).bind("sliderDrag scroll zoom",a.proxy(this._changing,this)).bind("stop",a.proxy(this._changed,this)),this._bar({leftHandle:this.leftHandle,rightHandle:this.rightHandle,values:{min:this._values.min,max:this._values.max},type:this._handleType(),range:this.options.range,wheelMode:this.options.wheelMode,wheelSpeed:this.options.wheelSpeed}),this.options.range=this._bar("option","range"),this.options.wheelMode=this._bar("option","wheelMode"),this.options.wheelSpeed=this._bar("option","wheelSpeed")},_createArrows:function(){this.arrows.left=this._createArrow("left"),this.arrows.right=this._createArrow("right"),this.options.arrows?this.element.addClass("ui-rangeSlider-withArrows"):(this.arrows.left.css("display","none"),this.arrows.right.css("display","none"),this.element.addClass("ui-rangeSlider-noArrow"))},_createArrow:function(b){var c,d=a("<div class='ui-rangeSlider-arrow' />").append("<div class='ui-rangeSlider-arrow-inner' />").addClass("ui-rangeSlider-"+b+"Arrow").css("position","absolute").css(b,0).appendTo(this.element);return c="right"===b?a.proxy(this._scrollRightClick,this):a.proxy(this._scrollLeftClick,this),d.bind("mousedown touchstart",c),d},_proxy:function(a,b,c){var d=Array.prototype.slice.call(c);return a&&a[b]?a[b].apply(a,d):null},_handleType:function(){return"rangeSliderHandle"},_barType:function(){return"rangeSliderBar"},_bar:function(){return this._proxy(this.bar,this._barType(),arguments)},_labelType:function(){return"rangeSliderLabel"},_leftLabel:function(){return this._proxy(this.labels.left,this._labelType(),arguments)},_rightLabel:function(){return this._proxy(this.labels.right,this._labelType(),arguments)},_leftHandle:function(){return this._proxy(this.leftHandle,this._handleType(),arguments)},_rightHandle:function(){return this._proxy(this.rightHandle,this._handleType(),arguments)},_getValue:function(a,b){return b===this.rightHandle&&(a-=b.outerWidth()),a*(this.options.bounds.max-this.options.bounds.min)/(this.container.innerWidth()-b.outerWidth(!0))+this.options.bounds.min},_trigger:function(a){var b=this;setTimeout(function(){b.element.trigger(a,{label:b.element,values:b.values()})},1)},_changing:function(){this._updateValues()&&(this._trigger("valuesChanging"),this._valuesChanged=!0)},_deactivateLabels:function(){"change"===this.options.valueLabels&&(this._leftLabel("option","show","hide"),this._rightLabel("option","show","hide"))},_reactivateLabels:function(){"change"===this.options.valueLabels&&(this._leftLabel("option","show","change"),this._rightLabel("option","show","change"))},_changed:function(a){a===!0&&this._deactivateLabels(),(this._updateValues()||this._valuesChanged)&&(this._trigger("valuesChanged"),a!==!0&&this._trigger("userValuesChanged"),this._valuesChanged=!1),a===!0&&this._reactivateLabels()},_updateValues:function(){var a=this._leftHandle("value"),b=this._rightHandle("value"),c=this._min(a,b),d=this._max(a,b),e=c!==this._values.min||d!==this._values.max;return this._values.min=this._min(a,b),this._values.max=this._max(a,b),e},_min:function(a,b){return Math.min(a,b)},_max:function(a,b){return Math.max(a,b)},_createLabel:function(b,c){var d;return null===b?(d=this._getLabelConstructorParameters(b,c),b=a("<div />").appendTo(this.element)[this._labelType()](d)):(d=this._getLabelRefreshParameters(b,c),b[this._labelType()](d)),b},_getLabelConstructorParameters:function(a,b){return{handle:b,handleType:this._handleType(),formatter:this._getFormatter(),show:this.options.valueLabels,durationIn:this.options.durationIn,durationOut:this.options.durationOut,delayOut:this.options.delayOut}},_getLabelRefreshParameters:function(){return{formatter:this._getFormatter(),show:this.options.valueLabels,durationIn:this.options.durationIn,durationOut:this.options.durationOut,delayOut:this.options.delayOut}},_getFormatter:function(){return this.options.formatter===!1||null===this.options.formatter?this._defaultFormatter:this.options.formatter},_defaultFormatter:function(a){return Math.round(a)},_destroyLabel:function(a){return null!==a&&(a[this._labelType()]("destroy"),a.remove(),a=null),a},_createLabels:function(){this.labels.left=this._createLabel(this.labels.left,this.leftHandle),this.labels.right=this._createLabel(this.labels.right,this.rightHandle),this._leftLabel("pair",this.labels.right)},_destroyLabels:function(){this.labels.left=this._destroyLabel(this.labels.left),this.labels.right=this._destroyLabel(this.labels.right)},_stepRatio:function(){return this._leftHandle("stepRatio")},_scrollRightClick:function(a){return this.options.enabled?(a.preventDefault(),this._bar("startScroll"),this._bindStopScroll(),void this._continueScrolling("scrollRight",4*this._stepRatio(),1)):!1},_continueScrolling:function(a,b,c,d){if(!this.options.enabled)return!1;this._bar(a,c),d=d||5,d--;var e=this,f=16,g=Math.max(1,4/this._stepRatio());this._scrollTimeout=setTimeout(function(){0===d&&(b>f?b=Math.max(f,b/1.5):c=Math.min(g,2*c),d=5),e._continueScrolling(a,b,c,d)},b)},_scrollLeftClick:function(a){return this.options.enabled?(a.preventDefault(),this._bar("startScroll"),this._bindStopScroll(),void this._continueScrolling("scrollLeft",4*this._stepRatio(),1)):!1},_bindStopScroll:function(){var b=this;this._stopScrollHandle=function(a){a.preventDefault(),b._stopScroll()},a(document).bind("mouseup touchend",this._stopScrollHandle)},_stopScroll:function(){a(document).unbind("mouseup touchend",this._stopScrollHandle),this._stopScrollHandle=null,this._bar("stopScroll"),clearTimeout(this._scrollTimeout)},_createRuler:function(){this.ruler=a("<div class='ui-rangeSlider-ruler' />").appendTo(this.innerBar)},_setRulerParameters:function(){this.ruler.ruler({min:this.options.bounds.min,max:this.options.bounds.max,scales:this.options.scales})},_destroyRuler:function(){null!==this.ruler&&a.fn.ruler&&(this.ruler.ruler("destroy"),this.ruler.remove(),this.ruler=null)},_updateRuler:function(){this._destroyRuler(),this.options.scales!==!1&&a.fn.ruler&&(this._createRuler(),this._setRulerParameters())},values:function(a,b){var c;if("undefined"!=typeof a&&"undefined"!=typeof b){if(!this._initialized)return this._values.min=a,this._values.max=b,this._values;this._deactivateLabels(),c=this._bar("values",a,b),this._changed(!0),this._reactivateLabels()}else c=this._bar("values",a,b);return c},min:function(a){return this._values.min=this.values(a,this._values.max).min,this._values.min},max:function(a){return this._values.max=this.values(this._values.min,a).max,this._values.max},bounds:function(a,b){return this._isValidValue(a)&&this._isValidValue(b)&&b>a&&(this._setBounds(a,b),this._updateRuler(),this._changed(!0)),this.options.bounds},_isValidValue:function(a){return"undefined"!=typeof a&&parseFloat(a)===a},_setBounds:function(a,b){this.options.bounds={min:a,max:b},this._leftHandle("option","bounds",this.options.bounds),this._rightHandle("option","bounds",this.options.bounds),this._bar("option","bounds",this.options.bounds)},zoomIn:function(a){this._bar("zoomIn",a)},zoomOut:function(a){this._bar("zoomOut",a)},scrollLeft:function(a){this._bar("startScroll"),this._bar("scrollLeft",a),this._bar("stopScroll")},scrollRight:function(a){this._bar("startScroll"),this._bar("scrollRight",a),this._bar("stopScroll")},resize:function(){this._initWidth(),this._leftHandle("update"),this._rightHandle("update"),this._bar("update")},enable:function(){this.toggle(!0)},disable:function(){this.toggle(!1)},toggle:function(a){a===b&&(a=!this.options.enabled),this.options.enabled!==a&&this._toggle(a)},_toggle:function(a){this.options.enabled=a,this.element.toggleClass("ui-rangeSlider-disabled",!a);var b=a?"enable":"disable";this._bar(b),this._leftHandle(b),this._rightHandle(b),this._leftLabel(b),this._rightLabel(b)},destroy:function(){this.element.removeClass("ui-rangeSlider-withArrows ui-rangeSlider-noArrow ui-rangeSlider-disabled"),this._destroyWidgets(),this._destroyElements(),this.element.removeClass("ui-rangeSlider"),this.options=null,a(window).unbind("resize",this._resizeProxy),this._resizeProxy=null,this._bindResize=null,a.Widget.prototype.destroy.apply(this,arguments)},_destroyWidget:function(a){this["_"+a]("destroy"),this[a].remove(),this[a]=null},_destroyWidgets:function(){this._destroyWidget("bar"),this._destroyWidget("leftHandle"),this._destroyWidget("rightHandle"),this._destroyRuler(),this._destroyLabels()},_destroyElements:function(){this.container.remove(),this.container=null,this.innerBar.remove(),this.innerBar=null,this.arrows.left.remove(),this.arrows.right.remove(),this.arrows=null}})}(jQuery),function(a){"use strict";a.widget("ui.rangeSliderHandle",a.ui.rangeSliderDraggable,{currentMove:null,margin:0,parentElement:null,options:{isLeft:!0,bounds:{min:0,max:100},range:!1,value:0,step:!1},_value:0,_left:0,_create:function(){a.ui.rangeSliderDraggable.prototype._create.apply(this),this.element.css("position","absolute").css("top",0).addClass("ui-rangeSlider-handle").toggleClass("ui-rangeSlider-leftHandle",this.options.isLeft).toggleClass("ui-rangeSlider-rightHandle",!this.options.isLeft),this.element.append("<div class='ui-rangeSlider-handle-inner' />"),this._value=this._constraintValue(this.options.value)},destroy:function(){this.element.empty(),a.ui.rangeSliderDraggable.prototype.destroy.apply(this)},_setOption:function(b,c){"isLeft"!==b||c!==!0&&c!==!1||c===this.options.isLeft?"step"===b&&this._checkStep(c)?(this.options.step=c,this.update()):"bounds"===b?(this.options.bounds=c,this.update()):"range"===b&&this._checkRange(c)?(this.options.range=c,this.update()):"symmetricPositionning"===b&&(this.options.symmetricPositionning=c===!0,this.update()):(this.options.isLeft=c,this.element.toggleClass("ui-rangeSlider-leftHandle",this.options.isLeft).toggleClass("ui-rangeSlider-rightHandle",!this.options.isLeft),this._position(this._value),this.element.trigger("switch",this.options.isLeft)),a.ui.rangeSliderDraggable.prototype._setOption.apply(this,[b,c])},_checkRange:function(a){return a===!1||!this._isValidValue(a.min)&&!this._isValidValue(a.max)},_isValidValue:function(a){return"undefined"!=typeof a&&a!==!1&&parseFloat(a)!==a},_checkStep:function(a){return a===!1||parseFloat(a)===a},_initElement:function(){a.ui.rangeSliderDraggable.prototype._initElement.apply(this),0===this.cache.parent.width||null===this.cache.parent.width?setTimeout(a.proxy(this._initElementIfNotDestroyed,this),500):(this._position(this._value),this._triggerMouseEvent("initialize"))},_bounds:function(){return this.options.bounds},_cache:function(){a.ui.rangeSliderDraggable.prototype._cache.apply(this),this._cacheParent()},_cacheParent:function(){var a=this.element.parent();this.cache.parent={element:a,offset:a.offset(),padding:{left:this._parsePixels(a,"paddingLeft")},width:a.width()}},_position:function(a){var b=this._getPositionForValue(a);this._applyPosition(b)},_constraintPosition:function(a){var b=this._getValueForPosition(a);return this._getPositionForValue(b)},_applyPosition:function(b){a.ui.rangeSliderDraggable.prototype._applyPosition.apply(this,[b]),this._left=b,this._setValue(this._getValueForPosition(b)),this._triggerMouseEvent("moving")},_prepareEventData:function(){var b=a.ui.rangeSliderDraggable.prototype._prepareEventData.apply(this);return b.value=this._value,b},_setValue:function(a){a!==this._value&&(this._value=a)},_constraintValue:function(a){if(a=Math.min(a,this._bounds().max),a=Math.max(a,this._bounds().min),a=this._round(a),this.options.range!==!1){var b=this.options.range.min||!1,c=this.options.range.max||!1;b!==!1&&(a=Math.max(a,this._round(b))),c!==!1&&(a=Math.min(a,this._round(c))),a=Math.min(a,this._bounds().max),a=Math.max(a,this._bounds().min)}return a},_round:function(a){return this.options.step!==!1&&this.options.step>0?Math.round(a/this.options.step)*this.options.step:a},_getPositionForValue:function(a){if(!this.cache||!this.cache.parent||null===this.cache.parent.offset)return 0;a=this._constraintValue(a);var b=(a-this.options.bounds.min)/(this.options.bounds.max-this.options.bounds.min),c=this.cache.parent.width,d=this.cache.parent.offset.left,e=this.options.isLeft?0:this.cache.width.outer;return this.options.symmetricPositionning?b*(c-2*this.cache.width.outer)+d+e:b*c+d-e},_getValueForPosition:function(a){var b=this._getRawValueForPositionAndBounds(a,this.options.bounds.min,this.options.bounds.max);return this._constraintValue(b)},_getRawValueForPositionAndBounds:function(a,b,c){var d,e,f=null===this.cache.parent.offset?0:this.cache.parent.offset.left;return this.options.symmetricPositionning?(a-=this.options.isLeft?0:this.cache.width.outer,d=this.cache.parent.width-2*this.cache.width.outer):(a+=this.options.isLeft?0:this.cache.width.outer,d=this.cache.parent.width),0===d?this._value:(e=(a-f)/d,e*(c-b)+b)},value:function(a){return"undefined"!=typeof a&&(this._cache(),a=this._constraintValue(a),this._position(a)),this._value},update:function(){this._cache();var a=this._constraintValue(this._value),b=this._getPositionForValue(a);a!==this._value?(this._triggerMouseEvent("updating"),this._position(a),this._triggerMouseEvent("update")):b!==this.cache.offset.left&&(this._triggerMouseEvent("updating"),this._position(a),this._triggerMouseEvent("update"))},position:function(a){return"undefined"!=typeof a&&(this._cache(),a=this._constraintPosition(a),this._applyPosition(a)),this._left},add:function(a,b){return a+b},substract:function(a,b){return a-b},stepsBetween:function(a,b){return this.options.step===!1?b-a:(b-a)/this.options.step},multiplyStep:function(a,b){return a*b},moveRight:function(a){var b;return this.options.step===!1?(b=this._left,this.position(this._left+a),this._left-b):(b=this._value,this.value(this.add(b,this.multiplyStep(this.options.step,a))),this.stepsBetween(b,this._value))},moveLeft:function(a){return-this.moveRight(-a)},stepRatio:function(){if(this.options.step===!1)return 1;var a=(this.options.bounds.max-this.options.bounds.min)/this.options.step;return this.cache.parent.width/a}})}(jQuery),function(a){"use strict";function b(a,b){return"undefined"==typeof a?b||!1:a}a.widget("ui.rangeSliderBar",a.ui.rangeSliderDraggable,{options:{leftHandle:null,rightHandle:null,bounds:{min:0,max:100},type:"rangeSliderHandle",range:!1,drag:function(){},stop:function(){},values:{min:0,max:20},wheelSpeed:4,wheelMode:null},_values:{min:0,max:20},_waitingToInit:2,_wheelTimeout:!1,_create:function(){a.ui.rangeSliderDraggable.prototype._create.apply(this),this.element.css("position","absolute").css("top",0).addClass("ui-rangeSlider-bar"),this.options.leftHandle.bind("initialize",a.proxy(this._onInitialized,this)).bind("mousestart",a.proxy(this._cache,this)).bind("stop",a.proxy(this._onHandleStop,this)),this.options.rightHandle.bind("initialize",a.proxy(this._onInitialized,this)).bind("mousestart",a.proxy(this._cache,this)).bind("stop",a.proxy(this._onHandleStop,this)),this._bindHandles(),this._values=this.options.values,this._setWheelModeOption(this.options.wheelMode)},destroy:function(){this.options.leftHandle.unbind(".bar"),this.options.rightHandle.unbind(".bar"),this.options=null,a.ui.rangeSliderDraggable.prototype.destroy.apply(this)},_setOption:function(a,b){"range"===a?this._setRangeOption(b):"wheelSpeed"===a?this._setWheelSpeedOption(b):"wheelMode"===a&&this._setWheelModeOption(b)},_setRangeOption:function(a){if(("object"!=typeof a||null===a)&&(a=!1),a!==!1||this.options.range!==!1){if(a!==!1){var c=b(a.min,this.options.range.min),d=b(a.max,this.options.range.max);this.options.range={min:c,max:d}}else this.options.range=!1;this._setLeftRange(),this._setRightRange()}},_setWheelSpeedOption:function(a){"number"==typeof a&&a>0&&(this.options.wheelSpeed=a)},_setWheelModeOption:function(a){(null===a||a===!1||"zoom"===a||"scroll"===a)&&(this.options.wheelMode!==a&&this.element.parent().unbind("mousewheel.bar"),this._bindMouseWheel(a),this.options.wheelMode=a)},_bindMouseWheel:function(b){"zoom"===b?this.element.parent().bind("mousewheel.bar",a.proxy(this._mouseWheelZoom,this)):"scroll"===b&&this.element.parent().bind("mousewheel.bar",a.proxy(this._mouseWheelScroll,this))},_setLeftRange:function(){if(this.options.range===!1)return!1;var a=this._values.max,b={min:!1,max:!1};b.max="undefined"!=typeof this.options.range.min&&this.options.range.min!==!1?this._leftHandle("substract",a,this.options.range.min):!1,b.min="undefined"!=typeof this.options.range.max&&this.options.range.max!==!1?this._leftHandle("substract",a,this.options.range.max):!1,this._leftHandle("option","range",b)},_setRightRange:function(){var a=this._values.min,b={min:!1,max:!1};b.min="undefined"!=typeof this.options.range.min&&this.options.range.min!==!1?this._rightHandle("add",a,this.options.range.min):!1,b.max="undefined"!=typeof this.options.range.max&&this.options.range.max!==!1?this._rightHandle("add",a,this.options.range.max):!1,this._rightHandle("option","range",b)},_deactivateRange:function(){this._leftHandle("option","range",!1),this._rightHandle("option","range",!1)},_reactivateRange:function(){this._setRangeOption(this.options.range)},_onInitialized:function(){this._waitingToInit--,0===this._waitingToInit&&this._initMe()},_initMe:function(){this._cache(),this.min(this._values.min),this.max(this._values.max);var a=this._leftHandle("position"),b=this._rightHandle("position")+this.options.rightHandle.width();this.element.offset({left:a}),this.element.css("width",b-a)},_leftHandle:function(){return this._handleProxy(this.options.leftHandle,arguments)},_rightHandle:function(){return this._handleProxy(this.options.rightHandle,arguments)},_handleProxy:function(a,b){var c=Array.prototype.slice.call(b);return a[this.options.type].apply(a,c)},_cache:function(){a.ui.rangeSliderDraggable.prototype._cache.apply(this),this._cacheHandles()},_cacheHandles:function(){this.cache.rightHandle={},this.cache.rightHandle.width=this.options.rightHandle.width(),this.cache.rightHandle.offset=this.options.rightHandle.offset(),this.cache.leftHandle={},this.cache.leftHandle.offset=this.options.leftHandle.offset()},_mouseStart:function(b){a.ui.rangeSliderDraggable.prototype._mouseStart.apply(this,[b]),this._deactivateRange()},_mouseStop:function(b){a.ui.rangeSliderDraggable.prototype._mouseStop.apply(this,[b]),this._cacheHandles(),this._values.min=this._leftHandle("value"),this._values.max=this._rightHandle("value"),this._reactivateRange(),this._leftHandle().trigger("stop"),this._rightHandle().trigger("stop")},_onDragLeftHandle:function(a,b){if(this._cacheIfNecessary(),b.element[0]===this.options.leftHandle[0]){if(this._switchedValues())return this._switchHandles(),void this._onDragRightHandle(a,b);this._values.min=b.value,this.cache.offset.left=b.offset.left,this.cache.leftHandle.offset=b.offset,this._positionBar()}},_onDragRightHandle:function(a,b){if(this._cacheIfNecessary(),b.element[0]===this.options.rightHandle[0]){if(this._switchedValues())return this._switchHandles(),void this._onDragLeftHandle(a,b);this._values.max=b.value,this.cache.rightHandle.offset=b.offset,this._positionBar()}},_positionBar:function(){var a=this.cache.rightHandle.offset.left+this.cache.rightHandle.width-this.cache.leftHandle.offset.left;this.cache.width.inner=a,this.element.css("width",a).offset({left:this.cache.leftHandle.offset.left})},_onHandleStop:function(){this._setLeftRange(),this._setRightRange()},_switchedValues:function(){if(this.min()>this.max()){var a=this._values.min;return this._values.min=this._values.max,this._values.max=a,!0}return!1},_switchHandles:function(){var a=this.options.leftHandle;this.options.leftHandle=this.options.rightHandle,this.options.rightHandle=a,this._leftHandle("option","isLeft",!0),this._rightHandle("option","isLeft",!1),this._bindHandles(),this._cacheHandles()},_bindHandles:function(){this.options.leftHandle.unbind(".bar").bind("sliderDrag.bar update.bar moving.bar",a.proxy(this._onDragLeftHandle,this)),this.options.rightHandle.unbind(".bar").bind("sliderDrag.bar update.bar moving.bar",a.proxy(this._onDragRightHandle,this))},_constraintPosition:function(b){var c,d={};return d.left=a.ui.rangeSliderDraggable.prototype._constraintPosition.apply(this,[b]),d.left=this._leftHandle("position",d.left),c=this._rightHandle("position",d.left+this.cache.width.outer-this.cache.rightHandle.width),d.width=c-d.left+this.cache.rightHandle.width,d},_applyPosition:function(b){a.ui.rangeSliderDraggable.prototype._applyPosition.apply(this,[b.left]),this.element.width(b.width)},_mouseWheelZoom:function(b,c,d,e){if(!this.enabled)return!1;var f=this._values.min+(this._values.max-this._values.min)/2,g={},h={};return this.options.range===!1||this.options.range.min===!1?(g.max=f,h.min=f):(g.max=f-this.options.range.min/2,h.min=f+this.options.range.min/2),this.options.range!==!1&&this.options.range.max!==!1&&(g.min=f-this.options.range.max/2,h.max=f+this.options.range.max/2),this._leftHandle("option","range",g),this._rightHandle("option","range",h),clearTimeout(this._wheelTimeout),this._wheelTimeout=setTimeout(a.proxy(this._wheelStop,this),200),this.zoomIn(e*this.options.wheelSpeed),!1},_mouseWheelScroll:function(b,c,d,e){return this.enabled?(this._wheelTimeout===!1?this.startScroll():clearTimeout(this._wheelTimeout),this._wheelTimeout=setTimeout(a.proxy(this._wheelStop,this),200),this.scrollLeft(e*this.options.wheelSpeed),!1):!1},_wheelStop:function(){this.stopScroll(),this._wheelTimeout=!1},min:function(a){return this._leftHandle("value",a)},max:function(a){return this._rightHandle("value",a)},startScroll:function(){this._deactivateRange()},stopScroll:function(){this._reactivateRange(),this._triggerMouseEvent("stop"),this._leftHandle().trigger("stop"),this._rightHandle().trigger("stop")},scrollLeft:function(a){return a=a||1,0>a?this.scrollRight(-a):(a=this._leftHandle("moveLeft",a),this._rightHandle("moveLeft",a),this.update(),void this._triggerMouseEvent("scroll"))},scrollRight:function(a){return a=a||1,0>a?this.scrollLeft(-a):(a=this._rightHandle("moveRight",a),this._leftHandle("moveRight",a),this.update(),void this._triggerMouseEvent("scroll"))},zoomIn:function(a){if(a=a||1,0>a)return this.zoomOut(-a);var b=this._rightHandle("moveLeft",a);a>b&&(b/=2,this._rightHandle("moveRight",b)),this._leftHandle("moveRight",b),this.update(),this._triggerMouseEvent("zoom")},zoomOut:function(a){if(a=a||1,0>a)return this.zoomIn(-a);var b=this._rightHandle("moveRight",a);a>b&&(b/=2,this._rightHandle("moveLeft",b)),this._leftHandle("moveLeft",b),this.update(),this._triggerMouseEvent("zoom")},values:function(a,b){if("undefined"!=typeof a&&"undefined"!=typeof b){var c=Math.min(a,b),d=Math.max(a,b);this._deactivateRange(),this.options.leftHandle.unbind(".bar"),this.options.rightHandle.unbind(".bar"),this._values.min=this._leftHandle("value",c),this._values.max=this._rightHandle("value",d),this._bindHandles(),this._reactivateRange(),this.update()
}return{min:this._values.min,max:this._values.max}},update:function(){this._values.min=this.min(),this._values.max=this.max(),this._cache(),this._positionBar()}})}(jQuery),function(a){"use strict";function b(b,c,d,e){this.label1=b,this.label2=c,this.type=d,this.options=e,this.handle1=this.label1[this.type]("option","handle"),this.handle2=this.label2[this.type]("option","handle"),this.cache=null,this.left=b,this.right=c,this.moving=!1,this.initialized=!1,this.updating=!1,this.Init=function(){this.BindHandle(this.handle1),this.BindHandle(this.handle2),"show"===this.options.show?(setTimeout(a.proxy(this.PositionLabels,this),1),this.initialized=!0):setTimeout(a.proxy(this.AfterInit,this),1e3),this._resizeProxy=a.proxy(this.onWindowResize,this),a(window).resize(this._resizeProxy)},this.Destroy=function(){this._resizeProxy&&(a(window).unbind("resize",this._resizeProxy),this._resizeProxy=null,this.handle1.unbind(".positionner"),this.handle1=null,this.handle2.unbind(".positionner"),this.handle2=null,this.label1=null,this.label2=null,this.left=null,this.right=null),this.cache=null},this.AfterInit=function(){this.initialized=!0},this.Cache=function(){"none"!==this.label1.css("display")&&(this.cache={},this.cache.label1={},this.cache.label2={},this.cache.handle1={},this.cache.handle2={},this.cache.offsetParent={},this.CacheElement(this.label1,this.cache.label1),this.CacheElement(this.label2,this.cache.label2),this.CacheElement(this.handle1,this.cache.handle1),this.CacheElement(this.handle2,this.cache.handle2),this.CacheElement(this.label1.offsetParent(),this.cache.offsetParent))},this.CacheIfNecessary=function(){null===this.cache?this.Cache():(this.CacheWidth(this.label1,this.cache.label1),this.CacheWidth(this.label2,this.cache.label2),this.CacheHeight(this.label1,this.cache.label1),this.CacheHeight(this.label2,this.cache.label2),this.CacheWidth(this.label1.offsetParent(),this.cache.offsetParent))},this.CacheElement=function(a,b){this.CacheWidth(a,b),this.CacheHeight(a,b),b.offset=a.offset(),b.margin={left:this.ParsePixels("marginLeft",a),right:this.ParsePixels("marginRight",a)},b.border={left:this.ParsePixels("borderLeftWidth",a),right:this.ParsePixels("borderRightWidth",a)}},this.CacheWidth=function(a,b){b.width=a.width(),b.outerWidth=a.outerWidth()},this.CacheHeight=function(a,b){b.outerHeightMargin=a.outerHeight(!0)},this.ParsePixels=function(a,b){return parseInt(b.css(a),10)||0},this.BindHandle=function(b){b.bind("updating.positionner",a.proxy(this.onHandleUpdating,this)),b.bind("update.positionner",a.proxy(this.onHandleUpdated,this)),b.bind("moving.positionner",a.proxy(this.onHandleMoving,this)),b.bind("stop.positionner",a.proxy(this.onHandleStop,this))},this.PositionLabels=function(){if(this.CacheIfNecessary(),null!==this.cache){var a=this.GetRawPosition(this.cache.label1,this.cache.handle1),b=this.GetRawPosition(this.cache.label2,this.cache.handle2);this.label1[d]("option","isLeft")?this.ConstraintPositions(a,b):this.ConstraintPositions(b,a),this.PositionLabel(this.label1,a.left,this.cache.label1),this.PositionLabel(this.label2,b.left,this.cache.label2)}},this.PositionLabel=function(a,b,c){var d,e,f,g=this.cache.offsetParent.offset.left+this.cache.offsetParent.border.left;g-b>=0?(a.css("right",""),a.offset({left:b})):(d=g+this.cache.offsetParent.width,e=b+c.margin.left+c.outerWidth+c.margin.right,f=d-e,a.css("left",""),a.css("right",f))},this.ConstraintPositions=function(a,b){(a.center<b.center&&a.outerRight>b.outerLeft||a.center>b.center&&b.outerRight>a.outerLeft)&&(a=this.getLeftPosition(a,b),b=this.getRightPosition(a,b))},this.getLeftPosition=function(a,b){var c=(b.center+a.center)/2,d=c-a.cache.outerWidth-a.cache.margin.right+a.cache.border.left;return a.left=d,a},this.getRightPosition=function(a,b){var c=(b.center+a.center)/2;return b.left=c+b.cache.margin.left+b.cache.border.left,b},this.ShowIfNecessary=function(){"show"===this.options.show||this.moving||!this.initialized||this.updating||(this.label1.stop(!0,!0).fadeIn(this.options.durationIn||0),this.label2.stop(!0,!0).fadeIn(this.options.durationIn||0),this.moving=!0)},this.HideIfNeeded=function(){this.moving===!0&&(this.label1.stop(!0,!0).delay(this.options.delayOut||0).fadeOut(this.options.durationOut||0),this.label2.stop(!0,!0).delay(this.options.delayOut||0).fadeOut(this.options.durationOut||0),this.moving=!1)},this.onHandleMoving=function(a,b){this.ShowIfNecessary(),this.CacheIfNecessary(),this.UpdateHandlePosition(b),this.PositionLabels()},this.onHandleUpdating=function(){this.updating=!0},this.onHandleUpdated=function(){this.updating=!1,this.cache=null},this.onHandleStop=function(){this.HideIfNeeded()},this.onWindowResize=function(){this.cache=null},this.UpdateHandlePosition=function(a){null!==this.cache&&(a.element[0]===this.handle1[0]?this.UpdatePosition(a,this.cache.handle1):this.UpdatePosition(a,this.cache.handle2))},this.UpdatePosition=function(a,b){b.offset=a.offset,b.value=a.value},this.GetRawPosition=function(a,b){var c=b.offset.left+b.outerWidth/2,d=c-a.outerWidth/2,e=d+a.outerWidth-a.border.left-a.border.right,f=d-a.margin.left-a.border.left,g=b.offset.top-a.outerHeightMargin;return{left:d,outerLeft:f,top:g,right:e,outerRight:f+a.outerWidth+a.margin.left+a.margin.right,cache:a,center:c}},this.Init()}a.widget("ui.rangeSliderLabel",a.ui.rangeSliderMouseTouch,{options:{handle:null,formatter:!1,handleType:"rangeSliderHandle",show:"show",durationIn:0,durationOut:500,delayOut:500,isLeft:!1},cache:null,_positionner:null,_valueContainer:null,_innerElement:null,_value:null,_create:function(){this.options.isLeft=this._handle("option","isLeft"),this.element.addClass("ui-rangeSlider-label").css("position","absolute").css("display","block"),this._createElements(),this._toggleClass(),this.options.handle.bind("moving.label",a.proxy(this._onMoving,this)).bind("update.label",a.proxy(this._onUpdate,this)).bind("switch.label",a.proxy(this._onSwitch,this)),"show"!==this.options.show&&this.element.hide(),this._mouseInit()},destroy:function(){this.options.handle.unbind(".label"),this.options.handle=null,this._valueContainer=null,this._innerElement=null,this.element.empty(),this._positionner&&(this._positionner.Destroy(),this._positionner=null),a.ui.rangeSliderMouseTouch.prototype.destroy.apply(this)},_createElements:function(){this._valueContainer=a("<div class='ui-rangeSlider-label-value' />").appendTo(this.element),this._innerElement=a("<div class='ui-rangeSlider-label-inner' />").appendTo(this.element)},_handle:function(){var a=Array.prototype.slice.apply(arguments);return this.options.handle[this.options.handleType].apply(this.options.handle,a)},_setOption:function(a,b){"show"===a?this._updateShowOption(b):("durationIn"===a||"durationOut"===a||"delayOut"===a)&&this._updateDurations(a,b),this._setFormatterOption(a,b)},_setFormatterOption:function(a,b){"formatter"===a&&("function"==typeof b||b===!1)&&(this.options.formatter=b,this._display(this._value))},_updateShowOption:function(a){this.options.show=a,"show"!==this.options.show?(this.element.hide(),this._positionner.moving=!1):(this.element.show(),this._display(this.options.handle[this.options.handleType]("value")),this._positionner.PositionLabels()),this._positionner.options.show=this.options.show},_updateDurations:function(a,b){parseInt(b,10)===b&&(this._positionner.options[a]=b,this.options[a]=b)},_display:function(a){this._displayText(this.options.formatter===!1?Math.round(a):this.options.formatter(a)),this._value=a},_displayText:function(a){this._valueContainer.text(a)},_toggleClass:function(){this.element.toggleClass("ui-rangeSlider-leftLabel",this.options.isLeft).toggleClass("ui-rangeSlider-rightLabel",!this.options.isLeft)},_positionLabels:function(){this._positionner.PositionLabels()},_mouseDown:function(a){this.options.handle.trigger(a)},_mouseUp:function(a){this.options.handle.trigger(a)},_mouseMove:function(a){this.options.handle.trigger(a)},_onMoving:function(a,b){this._display(b.value)},_onUpdate:function(){"show"===this.options.show&&this.update()},_onSwitch:function(a,b){this.options.isLeft=b,this._toggleClass(),this._positionLabels()},pair:function(a){null===this._positionner&&(this._positionner=new b(this.element,a,this.widgetName,{show:this.options.show,durationIn:this.options.durationIn,durationOut:this.options.durationOut,delayOut:this.options.delayOut}),a[this.widgetName]("positionner",this._positionner))},positionner:function(a){return"undefined"!=typeof a&&(this._positionner=a),this._positionner},update:function(){this._positionner.cache=null,this._display(this._handle("value")),"show"===this.options.show&&this._positionLabels()}})}(jQuery),function(a){"use strict";a.widget("ui.dateRangeSlider",a.ui.rangeSlider,{options:{bounds:{min:new Date(2010,0,1).valueOf(),max:new Date(2012,0,1).valueOf()},defaultValues:{min:new Date(2010,1,11).valueOf(),max:new Date(2011,1,11).valueOf()}},_create:function(){a.ui.rangeSlider.prototype._create.apply(this),this.element.addClass("ui-dateRangeSlider")},destroy:function(){this.element.removeClass("ui-dateRangeSlider"),a.ui.rangeSlider.prototype.destroy.apply(this)},_setDefaultValues:function(){this._values={min:this.options.defaultValues.min.valueOf(),max:this.options.defaultValues.max.valueOf()}},_setRulerParameters:function(){this.ruler.ruler({min:new Date(this.options.bounds.min.valueOf()),max:new Date(this.options.bounds.max.valueOf()),scales:this.options.scales})},_setOption:function(b,c){("defaultValues"===b||"bounds"===b)&&"undefined"!=typeof c&&null!==c&&this._isValidDate(c.min)&&this._isValidDate(c.max)?a.ui.rangeSlider.prototype._setOption.apply(this,[b,{min:c.min.valueOf(),max:c.max.valueOf()}]):a.ui.rangeSlider.prototype._setOption.apply(this,this._toArray(arguments))},_handleType:function(){return"dateRangeSliderHandle"},option:function(b){if("bounds"===b||"defaultValues"===b){var c=a.ui.rangeSlider.prototype.option.apply(this,arguments);return{min:new Date(c.min),max:new Date(c.max)}}return a.ui.rangeSlider.prototype.option.apply(this,this._toArray(arguments))},_defaultFormatter:function(a){var b=a.getMonth()+1,c=a.getDate();return""+a.getFullYear()+"-"+(10>b?"0"+b:b)+"-"+(10>c?"0"+c:c)},_getFormatter:function(){var a=this.options.formatter;return(this.options.formatter===!1||null===this.options.formatter)&&(a=this._defaultFormatter),function(a){return function(b){return a(new Date(b))}}(a)},values:function(b,c){var d=null;return d=this._isValidDate(b)&&this._isValidDate(c)?a.ui.rangeSlider.prototype.values.apply(this,[b.valueOf(),c.valueOf()]):a.ui.rangeSlider.prototype.values.apply(this,this._toArray(arguments)),{min:new Date(d.min),max:new Date(d.max)}},min:function(b){return new Date(this._isValidDate(b)?a.ui.rangeSlider.prototype.min.apply(this,[b.valueOf()]):a.ui.rangeSlider.prototype.min.apply(this))},max:function(b){return new Date(this._isValidDate(b)?a.ui.rangeSlider.prototype.max.apply(this,[b.valueOf()]):a.ui.rangeSlider.prototype.max.apply(this))},bounds:function(b,c){var d;return d=this._isValidDate(b)&&this._isValidDate(c)?a.ui.rangeSlider.prototype.bounds.apply(this,[b.valueOf(),c.valueOf()]):a.ui.rangeSlider.prototype.bounds.apply(this,this._toArray(arguments)),{min:new Date(d.min),max:new Date(d.max)}},_isValidDate:function(a){return"undefined"!=typeof a&&a instanceof Date},_toArray:function(a){return Array.prototype.slice.call(a)}})}(jQuery),function(a){"use strict";a.widget("ui.dateRangeSliderHandle",a.ui.rangeSliderHandle,{_steps:!1,_boundsValues:{},_create:function(){this._createBoundsValues(),a.ui.rangeSliderHandle.prototype._create.apply(this)},_getValueForPosition:function(a){var b=this._getRawValueForPositionAndBounds(a,this.options.bounds.min.valueOf(),this.options.bounds.max.valueOf());return this._constraintValue(new Date(b))},_setOption:function(b,c){return"step"===b?(this.options.step=c,this._createSteps(),void this.update()):(a.ui.rangeSliderHandle.prototype._setOption.apply(this,[b,c]),void("bounds"===b&&this._createBoundsValues()))},_createBoundsValues:function(){this._boundsValues={min:this.options.bounds.min.valueOf(),max:this.options.bounds.max.valueOf()}},_bounds:function(){return this._boundsValues},_createSteps:function(){if(this.options.step===!1||!this._isValidStep())return void(this._steps=!1);var a=new Date(this.options.bounds.min.valueOf()),b=new Date(this.options.bounds.max.valueOf()),c=a,d=0,e=new Date;for(this._steps=[];b>=c&&(1===d||e.valueOf()!==c.valueOf());)e=c,this._steps.push(c.valueOf()),c=this._addStep(a,d,this.options.step),d++;e.valueOf()===c.valueOf()&&(this._steps=!1)},_isValidStep:function(){return"object"==typeof this.options.step},_addStep:function(a,b,c){var d=new Date(a.valueOf());return d=this._addThing(d,"FullYear",b,c.years),d=this._addThing(d,"Month",b,c.months),d=this._addThing(d,"Date",b,7*c.weeks),d=this._addThing(d,"Date",b,c.days),d=this._addThing(d,"Hours",b,c.hours),d=this._addThing(d,"Minutes",b,c.minutes),d=this._addThing(d,"Seconds",b,c.seconds)},_addThing:function(a,b,c,d){return 0===c||0===(d||0)?a:(a["set"+b](a["get"+b]()+c*(d||0)),a)},_round:function(a){if(this._steps===!1)return a;for(var b,c,d=this.options.bounds.max.valueOf(),e=this.options.bounds.min.valueOf(),f=Math.max(0,(a-e)/(d-e)),g=Math.floor(this._steps.length*f);this._steps[g]>a;)g--;for(;g+1<this._steps.length&&this._steps[g+1]<=a;)g++;return g>=this._steps.length-1?this._steps[this._steps.length-1]:0===g?this._steps[0]:(b=this._steps[g],c=this._steps[g+1],c-a>a-b?b:c)},update:function(){this._createBoundsValues(),this._createSteps(),a.ui.rangeSliderHandle.prototype.update.apply(this)},add:function(a,b){return this._addStep(new Date(a),1,b).valueOf()},substract:function(a,b){return this._addStep(new Date(a),-1,b).valueOf()},stepsBetween:function(a,b){if(this.options.step===!1)return b-a;var c=Math.min(a,b),d=Math.max(a,b),e=0,f=!1,g=a>b;for(this.add(c,this.options.step)-c<0&&(f=!0);d>c;)f?d=this.add(d,this.options.step):c=this.add(c,this.options.step),e++;return g?-e:e},multiplyStep:function(a,b){var c={};for(var d in a)a.hasOwnProperty(d)&&(c[d]=a[d]*b);return c},stepRatio:function(){if(this.options.step===!1)return 1;var a=this._steps.length;return this.cache.parent.width/a}})}(jQuery),function(a){"use strict";var b={first:function(a){return a},next:function(a){return a+1},format:function(){},label:function(a){return Math.round(a)},stop:function(){return!1}};a.widget("ui.ruler",{options:{min:0,max:100,scales:[]},_create:function(){this.element.addClass("ui-ruler"),this._createScales()},destroy:function(){this.element.removeClass("ui-ruler"),this.element.empty()},_regenerate:function(){this.element.empty(),this._createScales()},_setOption:function(a,b){return"min"===a||"max"===a&&b!==this.options[a]?(this.options[a]=b,void this._regenerate()):"scales"===a&&b instanceof Array?(this.options.scales=b,void this._regenerate()):void 0},_createScales:function(){if(this.options.max!==this.options.min)for(var a=0;a<this.options.scales.length;a++)this._createScale(this.options.scales[a],a)},_createScale:function(c,d){var e=a.extend({},b,c),f=a("<div class='ui-ruler-scale' />").appendTo(this.element);f.addClass("ui-ruler-scale"+d),this._createTicks(f,e)},_createTicks:function(a,b){var c,d,e,f=b.first(this.options.min,this.options.max),g=this.options.max-this.options.min,h=!0;do c=f,f=b.next(c),d=(Math.min(f,this.options.max)-Math.max(c,this.options.min))/g,e=this._createTick(c,f,b),a.append(e),e.css("width",100*d+"%"),h&&c>this.options.min&&e.css("margin-left",100*(c-this.options.min)/g+"%"),h=!1;while(!this._stop(b,f))},_stop:function(a,b){return a.stop(b)||b>=this.options.max},_createTick:function(b,c,d){var e=a("<div class='ui-ruler-tick' style='display:inline-block' />"),f=a("<div class='ui-ruler-tick-inner' />").appendTo(e),g=a("<span class='ui-ruler-tick-label' />").appendTo(f);return g.text(d.label(b,c)),d.format(e,b,c),e}})}(jQuery);
/*! jQuery UI - v1.11.4 - 2015-07-20
* http://jqueryui.com
* Includes: core.js, widget.js, mouse.js, position.js, slider.js
* Copyright 2015 jQuery Foundation and other contributors; Licensed MIT */

(function(e){"function"==typeof define&&define.amd?define(["jquery"],e):e(jQuery)})(function(e){function t(t,s){var n,a,o,r=t.nodeName.toLowerCase();return"area"===r?(n=t.parentNode,a=n.name,t.href&&a&&"map"===n.nodeName.toLowerCase()?(o=e("img[usemap='#"+a+"']")[0],!!o&&i(o)):!1):(/^(input|select|textarea|button|object)$/.test(r)?!t.disabled:"a"===r?t.href||s:s)&&i(t)}function i(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}e.ui=e.ui||{},e.extend(e.ui,{version:"1.11.4",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({scrollParent:function(t){var i=this.css("position"),s="absolute"===i,n=t?/(auto|scroll|hidden)/:/(auto|scroll)/,a=this.parents().filter(function(){var t=e(this);return s&&"static"===t.css("position")?!1:n.test(t.css("overflow")+t.css("overflow-y")+t.css("overflow-x"))}).eq(0);return"fixed"!==i&&a.length?a:e(this[0].ownerDocument||document)},uniqueId:function(){var e=0;return function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++e)})}}(),removeUniqueId:function(){return this.each(function(){/^ui-id-\d+$/.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,s){return!!e.data(t,s[3])},focusable:function(i){return t(i,!isNaN(e.attr(i,"tabindex")))},tabbable:function(i){var s=e.attr(i,"tabindex"),n=isNaN(s);return(n||s>=0)&&t(i,!n)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(t,i){function s(t,i,s,a){return e.each(n,function(){i-=parseFloat(e.css(t,"padding"+this))||0,s&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),a&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var n="Width"===i?["Left","Right"]:["Top","Bottom"],a=i.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+i]=function(t){return void 0===t?o["inner"+i].call(this):this.each(function(){e(this).css(a,s(this,t)+"px")})},e.fn["outer"+i]=function(t,n){return"number"!=typeof t?o["outer"+i].call(this,t):this.each(function(){e(this).css(a,s(this,t,!0,n)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.fn.extend({focus:function(t){return function(i,s){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),s&&s.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),disableSelection:function(){var e="onselectstart"in document.createElement("div")?"selectstart":"mousedown";return function(){return this.bind(e+".ui-disableSelection",function(e){e.preventDefault()})}}(),enableSelection:function(){return this.unbind(".ui-disableSelection")},zIndex:function(t){if(void 0!==t)return this.css("zIndex",t);if(this.length)for(var i,s,n=e(this[0]);n.length&&n[0]!==document;){if(i=n.css("position"),("absolute"===i||"relative"===i||"fixed"===i)&&(s=parseInt(n.css("zIndex"),10),!isNaN(s)&&0!==s))return s;n=n.parent()}return 0}}),e.ui.plugin={add:function(t,i,s){var n,a=e.ui[t].prototype;for(n in s)a.plugins[n]=a.plugins[n]||[],a.plugins[n].push([i,s[n]])},call:function(e,t,i,s){var n,a=e.plugins[t];if(a&&(s||e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType))for(n=0;a.length>n;n++)e.options[a[n][0]]&&a[n][1].apply(e.element,i)}};var s=0,n=Array.prototype.slice;e.cleanData=function(t){return function(i){var s,n,a;for(a=0;null!=(n=i[a]);a++)try{s=e._data(n,"events"),s&&s.remove&&e(n).triggerHandler("remove")}catch(o){}t(i)}}(e.cleanData),e.widget=function(t,i,s){var n,a,o,r,h={},l=t.split(".")[0];return t=t.split(".")[1],n=l+"-"+t,s||(s=i,i=e.Widget),e.expr[":"][n.toLowerCase()]=function(t){return!!e.data(t,n)},e[l]=e[l]||{},a=e[l][t],o=e[l][t]=function(e,t){return this._createWidget?(arguments.length&&this._createWidget(e,t),void 0):new o(e,t)},e.extend(o,a,{version:s.version,_proto:e.extend({},s),_childConstructors:[]}),r=new i,r.options=e.widget.extend({},r.options),e.each(s,function(t,s){return e.isFunction(s)?(h[t]=function(){var e=function(){return i.prototype[t].apply(this,arguments)},n=function(e){return i.prototype[t].apply(this,e)};return function(){var t,i=this._super,a=this._superApply;return this._super=e,this._superApply=n,t=s.apply(this,arguments),this._super=i,this._superApply=a,t}}(),void 0):(h[t]=s,void 0)}),o.prototype=e.widget.extend(r,{widgetEventPrefix:a?r.widgetEventPrefix||t:t},h,{constructor:o,namespace:l,widgetName:t,widgetFullName:n}),a?(e.each(a._childConstructors,function(t,i){var s=i.prototype;e.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete a._childConstructors):i._childConstructors.push(o),e.widget.bridge(t,o),o},e.widget.extend=function(t){for(var i,s,a=n.call(arguments,1),o=0,r=a.length;r>o;o++)for(i in a[o])s=a[o][i],a[o].hasOwnProperty(i)&&void 0!==s&&(t[i]=e.isPlainObject(s)?e.isPlainObject(t[i])?e.widget.extend({},t[i],s):e.widget.extend({},s):s);return t},e.widget.bridge=function(t,i){var s=i.prototype.widgetFullName||t;e.fn[t]=function(a){var o="string"==typeof a,r=n.call(arguments,1),h=this;return o?this.each(function(){var i,n=e.data(this,s);return"instance"===a?(h=n,!1):n?e.isFunction(n[a])&&"_"!==a.charAt(0)?(i=n[a].apply(n,r),i!==n&&void 0!==i?(h=i&&i.jquery?h.pushStack(i.get()):i,!1):void 0):e.error("no such method '"+a+"' for "+t+" widget instance"):e.error("cannot call methods on "+t+" prior to initialization; "+"attempted to call method '"+a+"'")}):(r.length&&(a=e.widget.extend.apply(null,[a].concat(r))),this.each(function(){var t=e.data(this,s);t?(t.option(a||{}),t._init&&t._init()):e.data(this,s,new i(a,this))})),h}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,i){i=e(i||this.defaultElement||this)[0],this.element=e(i),this.uuid=s++,this.eventNamespace="."+this.widgetName+this.uuid,this.bindings=e(),this.hoverable=e(),this.focusable=e(),i!==this&&(e.data(i,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===i&&this.destroy()}}),this.document=e(i.style?i.ownerDocument:i.document||i),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(t,i){var s,n,a,o=t;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof t)if(o={},s=t.split("."),t=s.shift(),s.length){for(n=o[t]=e.widget.extend({},this.options[t]),a=0;s.length-1>a;a++)n[s[a]]=n[s[a]]||{},n=n[s[a]];if(t=s.pop(),1===arguments.length)return void 0===n[t]?null:n[t];n[t]=i}else{if(1===arguments.length)return void 0===this.options[t]?null:this.options[t];o[t]=i}return this._setOptions(o),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&(this.widget().toggleClass(this.widgetFullName+"-disabled",!!t),t&&(this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus"))),this},enable:function(){return this._setOptions({disabled:!1})},disable:function(){return this._setOptions({disabled:!0})},_on:function(t,i,s){var n,a=this;"boolean"!=typeof t&&(s=i,i=t,t=!1),s?(i=n=e(i),this.bindings=this.bindings.add(i)):(s=i,i=this.element,n=this.widget()),e.each(s,function(s,o){function r(){return t||a.options.disabled!==!0&&!e(this).hasClass("ui-state-disabled")?("string"==typeof o?a[o]:o).apply(a,arguments):void 0}"string"!=typeof o&&(r.guid=o.guid=o.guid||r.guid||e.guid++);var h=s.match(/^([\w:-]*)\s*(.*)$/),l=h[1]+a.eventNamespace,u=h[2];u?n.delegate(u,l,r):i.bind(l,r)})},_off:function(t,i){i=(i||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,t.unbind(i).undelegate(i),this.bindings=e(this.bindings.not(t).get()),this.focusable=e(this.focusable.not(t).get()),this.hoverable=e(this.hoverable.not(t).get())},_delay:function(e,t){function i(){return("string"==typeof e?s[e]:e).apply(s,arguments)}var s=this;return setTimeout(i,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,s){var n,a,o=this.options[t];if(s=s||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],a=i.originalEvent)for(n in a)n in i||(i[n]=a[n]);return this.element.trigger(i,s),!(e.isFunction(o)&&o.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,i){e.Widget.prototype["_"+t]=function(s,n,a){"string"==typeof n&&(n={effect:n});var o,r=n?n===!0||"number"==typeof n?i:n.effect||i:t;n=n||{},"number"==typeof n&&(n={duration:n}),o=!e.isEmptyObject(n),n.complete=a,n.delay&&s.delay(n.delay),o&&e.effects&&e.effects.effect[r]?s[t](n):r!==t&&s[r]?s[r](n.duration,n.easing,a):s.queue(function(i){e(this)[t](),a&&a.call(s[0]),i()})}}),e.widget;var a=!1;e(document).mouseup(function(){a=!1}),e.widget("ui.mouse",{version:"1.11.4",options:{cancel:"input,textarea,button,select,option",distance:1,delay:0},_mouseInit:function(){var t=this;this.element.bind("mousedown."+this.widgetName,function(e){return t._mouseDown(e)}).bind("click."+this.widgetName,function(i){return!0===e.data(i.target,t.widgetName+".preventClickEvent")?(e.removeData(i.target,t.widgetName+".preventClickEvent"),i.stopImmediatePropagation(),!1):void 0}),this.started=!1},_mouseDestroy:function(){this.element.unbind("."+this.widgetName),this._mouseMoveDelegate&&this.document.unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate)},_mouseDown:function(t){if(!a){this._mouseMoved=!1,this._mouseStarted&&this._mouseUp(t),this._mouseDownEvent=t;var i=this,s=1===t.which,n="string"==typeof this.options.cancel&&t.target.nodeName?e(t.target).closest(this.options.cancel).length:!1;return s&&!n&&this._mouseCapture(t)?(this.mouseDelayMet=!this.options.delay,this.mouseDelayMet||(this._mouseDelayTimer=setTimeout(function(){i.mouseDelayMet=!0},this.options.delay)),this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(t)!==!1,!this._mouseStarted)?(t.preventDefault(),!0):(!0===e.data(t.target,this.widgetName+".preventClickEvent")&&e.removeData(t.target,this.widgetName+".preventClickEvent"),this._mouseMoveDelegate=function(e){return i._mouseMove(e)},this._mouseUpDelegate=function(e){return i._mouseUp(e)},this.document.bind("mousemove."+this.widgetName,this._mouseMoveDelegate).bind("mouseup."+this.widgetName,this._mouseUpDelegate),t.preventDefault(),a=!0,!0)):!0}},_mouseMove:function(t){if(this._mouseMoved){if(e.ui.ie&&(!document.documentMode||9>document.documentMode)&&!t.button)return this._mouseUp(t);if(!t.which)return this._mouseUp(t)}return(t.which||t.button)&&(this._mouseMoved=!0),this._mouseStarted?(this._mouseDrag(t),t.preventDefault()):(this._mouseDistanceMet(t)&&this._mouseDelayMet(t)&&(this._mouseStarted=this._mouseStart(this._mouseDownEvent,t)!==!1,this._mouseStarted?this._mouseDrag(t):this._mouseUp(t)),!this._mouseStarted)},_mouseUp:function(t){return this.document.unbind("mousemove."+this.widgetName,this._mouseMoveDelegate).unbind("mouseup."+this.widgetName,this._mouseUpDelegate),this._mouseStarted&&(this._mouseStarted=!1,t.target===this._mouseDownEvent.target&&e.data(t.target,this.widgetName+".preventClickEvent",!0),this._mouseStop(t)),a=!1,!1},_mouseDistanceMet:function(e){return Math.max(Math.abs(this._mouseDownEvent.pageX-e.pageX),Math.abs(this._mouseDownEvent.pageY-e.pageY))>=this.options.distance},_mouseDelayMet:function(){return this.mouseDelayMet},_mouseStart:function(){},_mouseDrag:function(){},_mouseStop:function(){},_mouseCapture:function(){return!0}}),function(){function t(e,t,i){return[parseFloat(e[0])*(p.test(e[0])?t/100:1),parseFloat(e[1])*(p.test(e[1])?i/100:1)]}function i(t,i){return parseInt(e.css(t,i),10)||0}function s(t){var i=t[0];return 9===i.nodeType?{width:t.width(),height:t.height(),offset:{top:0,left:0}}:e.isWindow(i)?{width:t.width(),height:t.height(),offset:{top:t.scrollTop(),left:t.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:t.outerWidth(),height:t.outerHeight(),offset:t.offset()}}e.ui=e.ui||{};var n,a,o=Math.max,r=Math.abs,h=Math.round,l=/left|center|right/,u=/top|center|bottom/,d=/[\+\-]\d+(\.[\d]+)?%?/,c=/^\w+/,p=/%$/,f=e.fn.position;e.position={scrollbarWidth:function(){if(void 0!==n)return n;var t,i,s=e("<div style='display:block;position:absolute;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),a=s.children()[0];return e("body").append(s),t=a.offsetWidth,s.css("overflow","scroll"),i=a.offsetWidth,t===i&&(i=s[0].clientWidth),s.remove(),n=t-i},getScrollInfo:function(t){var i=t.isWindow||t.isDocument?"":t.element.css("overflow-x"),s=t.isWindow||t.isDocument?"":t.element.css("overflow-y"),n="scroll"===i||"auto"===i&&t.width<t.element[0].scrollWidth,a="scroll"===s||"auto"===s&&t.height<t.element[0].scrollHeight;return{width:a?e.position.scrollbarWidth():0,height:n?e.position.scrollbarWidth():0}},getWithinInfo:function(t){var i=e(t||window),s=e.isWindow(i[0]),n=!!i[0]&&9===i[0].nodeType;return{element:i,isWindow:s,isDocument:n,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:s||n?i.width():i.outerWidth(),height:s||n?i.height():i.outerHeight()}}},e.fn.position=function(n){if(!n||!n.of)return f.apply(this,arguments);n=e.extend({},n);var p,m,g,v,y,b,_=e(n.of),x=e.position.getWithinInfo(n.within),w=e.position.getScrollInfo(x),k=(n.collision||"flip").split(" "),T={};return b=s(_),_[0].preventDefault&&(n.at="left top"),m=b.width,g=b.height,v=b.offset,y=e.extend({},v),e.each(["my","at"],function(){var e,t,i=(n[this]||"").split(" ");1===i.length&&(i=l.test(i[0])?i.concat(["center"]):u.test(i[0])?["center"].concat(i):["center","center"]),i[0]=l.test(i[0])?i[0]:"center",i[1]=u.test(i[1])?i[1]:"center",e=d.exec(i[0]),t=d.exec(i[1]),T[this]=[e?e[0]:0,t?t[0]:0],n[this]=[c.exec(i[0])[0],c.exec(i[1])[0]]}),1===k.length&&(k[1]=k[0]),"right"===n.at[0]?y.left+=m:"center"===n.at[0]&&(y.left+=m/2),"bottom"===n.at[1]?y.top+=g:"center"===n.at[1]&&(y.top+=g/2),p=t(T.at,m,g),y.left+=p[0],y.top+=p[1],this.each(function(){var s,l,u=e(this),d=u.outerWidth(),c=u.outerHeight(),f=i(this,"marginLeft"),b=i(this,"marginTop"),D=d+f+i(this,"marginRight")+w.width,S=c+b+i(this,"marginBottom")+w.height,N=e.extend({},y),M=t(T.my,u.outerWidth(),u.outerHeight());"right"===n.my[0]?N.left-=d:"center"===n.my[0]&&(N.left-=d/2),"bottom"===n.my[1]?N.top-=c:"center"===n.my[1]&&(N.top-=c/2),N.left+=M[0],N.top+=M[1],a||(N.left=h(N.left),N.top=h(N.top)),s={marginLeft:f,marginTop:b},e.each(["left","top"],function(t,i){e.ui.position[k[t]]&&e.ui.position[k[t]][i](N,{targetWidth:m,targetHeight:g,elemWidth:d,elemHeight:c,collisionPosition:s,collisionWidth:D,collisionHeight:S,offset:[p[0]+M[0],p[1]+M[1]],my:n.my,at:n.at,within:x,elem:u})}),n.using&&(l=function(e){var t=v.left-N.left,i=t+m-d,s=v.top-N.top,a=s+g-c,h={target:{element:_,left:v.left,top:v.top,width:m,height:g},element:{element:u,left:N.left,top:N.top,width:d,height:c},horizontal:0>i?"left":t>0?"right":"center",vertical:0>a?"top":s>0?"bottom":"middle"};d>m&&m>r(t+i)&&(h.horizontal="center"),c>g&&g>r(s+a)&&(h.vertical="middle"),h.important=o(r(t),r(i))>o(r(s),r(a))?"horizontal":"vertical",n.using.call(this,e,h)}),u.offset(e.extend(N,{using:l}))})},e.ui.position={fit:{left:function(e,t){var i,s=t.within,n=s.isWindow?s.scrollLeft:s.offset.left,a=s.width,r=e.left-t.collisionPosition.marginLeft,h=n-r,l=r+t.collisionWidth-a-n;t.collisionWidth>a?h>0&&0>=l?(i=e.left+h+t.collisionWidth-a-n,e.left+=h-i):e.left=l>0&&0>=h?n:h>l?n+a-t.collisionWidth:n:h>0?e.left+=h:l>0?e.left-=l:e.left=o(e.left-r,e.left)},top:function(e,t){var i,s=t.within,n=s.isWindow?s.scrollTop:s.offset.top,a=t.within.height,r=e.top-t.collisionPosition.marginTop,h=n-r,l=r+t.collisionHeight-a-n;t.collisionHeight>a?h>0&&0>=l?(i=e.top+h+t.collisionHeight-a-n,e.top+=h-i):e.top=l>0&&0>=h?n:h>l?n+a-t.collisionHeight:n:h>0?e.top+=h:l>0?e.top-=l:e.top=o(e.top-r,e.top)}},flip:{left:function(e,t){var i,s,n=t.within,a=n.offset.left+n.scrollLeft,o=n.width,h=n.isWindow?n.scrollLeft:n.offset.left,l=e.left-t.collisionPosition.marginLeft,u=l-h,d=l+t.collisionWidth-o-h,c="left"===t.my[0]?-t.elemWidth:"right"===t.my[0]?t.elemWidth:0,p="left"===t.at[0]?t.targetWidth:"right"===t.at[0]?-t.targetWidth:0,f=-2*t.offset[0];0>u?(i=e.left+c+p+f+t.collisionWidth-o-a,(0>i||r(u)>i)&&(e.left+=c+p+f)):d>0&&(s=e.left-t.collisionPosition.marginLeft+c+p+f-h,(s>0||d>r(s))&&(e.left+=c+p+f))},top:function(e,t){var i,s,n=t.within,a=n.offset.top+n.scrollTop,o=n.height,h=n.isWindow?n.scrollTop:n.offset.top,l=e.top-t.collisionPosition.marginTop,u=l-h,d=l+t.collisionHeight-o-h,c="top"===t.my[1],p=c?-t.elemHeight:"bottom"===t.my[1]?t.elemHeight:0,f="top"===t.at[1]?t.targetHeight:"bottom"===t.at[1]?-t.targetHeight:0,m=-2*t.offset[1];0>u?(s=e.top+p+f+m+t.collisionHeight-o-a,(0>s||r(u)>s)&&(e.top+=p+f+m)):d>0&&(i=e.top-t.collisionPosition.marginTop+p+f+m-h,(i>0||d>r(i))&&(e.top+=p+f+m))}},flipfit:{left:function(){e.ui.position.flip.left.apply(this,arguments),e.ui.position.fit.left.apply(this,arguments)},top:function(){e.ui.position.flip.top.apply(this,arguments),e.ui.position.fit.top.apply(this,arguments)}}},function(){var t,i,s,n,o,r=document.getElementsByTagName("body")[0],h=document.createElement("div");t=document.createElement(r?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},r&&e.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(o in s)t.style[o]=s[o];t.appendChild(h),i=r||document.documentElement,i.insertBefore(t,i.firstChild),h.style.cssText="position: absolute; left: 10.7432222px;",n=e(h).offset().left,a=n>10&&11>n,t.innerHTML="",i.removeChild(t)}()}(),e.ui.position,e.widget("ui.slider",e.ui.mouse,{version:"1.11.4",widgetEventPrefix:"slide",options:{animate:!1,distance:0,max:100,min:0,orientation:"horizontal",range:!1,step:1,value:0,values:null,change:null,slide:null,start:null,stop:null},numPages:5,_create:function(){this._keySliding=!1,this._mouseSliding=!1,this._animateOff=!0,this._handleIndex=null,this._detectOrientation(),this._mouseInit(),this._calculateNewMax(),this.element.addClass("ui-slider ui-slider-"+this.orientation+" ui-widget"+" ui-widget-content"+" ui-corner-all"),this._refresh(),this._setOption("disabled",this.options.disabled),this._animateOff=!1},_refresh:function(){this._createRange(),this._createHandles(),this._setupEvents(),this._refreshValue()},_createHandles:function(){var t,i,s=this.options,n=this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),a="<span class='ui-slider-handle ui-state-default ui-corner-all' tabindex='0'></span>",o=[];for(i=s.values&&s.values.length||1,n.length>i&&(n.slice(i).remove(),n=n.slice(0,i)),t=n.length;i>t;t++)o.push(a);this.handles=n.add(e(o.join("")).appendTo(this.element)),this.handle=this.handles.eq(0),this.handles.each(function(t){e(this).data("ui-slider-handle-index",t)})},_createRange:function(){var t=this.options,i="";t.range?(t.range===!0&&(t.values?t.values.length&&2!==t.values.length?t.values=[t.values[0],t.values[0]]:e.isArray(t.values)&&(t.values=t.values.slice(0)):t.values=[this._valueMin(),this._valueMin()]),this.range&&this.range.length?this.range.removeClass("ui-slider-range-min ui-slider-range-max").css({left:"",bottom:""}):(this.range=e("<div></div>").appendTo(this.element),i="ui-slider-range ui-widget-header ui-corner-all"),this.range.addClass(i+("min"===t.range||"max"===t.range?" ui-slider-range-"+t.range:""))):(this.range&&this.range.remove(),this.range=null)},_setupEvents:function(){this._off(this.handles),this._on(this.handles,this._handleEvents),this._hoverable(this.handles),this._focusable(this.handles)},_destroy:function(){this.handles.remove(),this.range&&this.range.remove(),this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-widget ui-widget-content ui-corner-all"),this._mouseDestroy()},_mouseCapture:function(t){var i,s,n,a,o,r,h,l,u=this,d=this.options;return d.disabled?!1:(this.elementSize={width:this.element.outerWidth(),height:this.element.outerHeight()},this.elementOffset=this.element.offset(),i={x:t.pageX,y:t.pageY},s=this._normValueFromMouse(i),n=this._valueMax()-this._valueMin()+1,this.handles.each(function(t){var i=Math.abs(s-u.values(t));(n>i||n===i&&(t===u._lastChangedValue||u.values(t)===d.min))&&(n=i,a=e(this),o=t)}),r=this._start(t,o),r===!1?!1:(this._mouseSliding=!0,this._handleIndex=o,a.addClass("ui-state-active").focus(),h=a.offset(),l=!e(t.target).parents().addBack().is(".ui-slider-handle"),this._clickOffset=l?{left:0,top:0}:{left:t.pageX-h.left-a.width()/2,top:t.pageY-h.top-a.height()/2-(parseInt(a.css("borderTopWidth"),10)||0)-(parseInt(a.css("borderBottomWidth"),10)||0)+(parseInt(a.css("marginTop"),10)||0)},this.handles.hasClass("ui-state-hover")||this._slide(t,o,s),this._animateOff=!0,!0))},_mouseStart:function(){return!0},_mouseDrag:function(e){var t={x:e.pageX,y:e.pageY},i=this._normValueFromMouse(t);return this._slide(e,this._handleIndex,i),!1},_mouseStop:function(e){return this.handles.removeClass("ui-state-active"),this._mouseSliding=!1,this._stop(e,this._handleIndex),this._change(e,this._handleIndex),this._handleIndex=null,this._clickOffset=null,this._animateOff=!1,!1},_detectOrientation:function(){this.orientation="vertical"===this.options.orientation?"vertical":"horizontal"},_normValueFromMouse:function(e){var t,i,s,n,a;return"horizontal"===this.orientation?(t=this.elementSize.width,i=e.x-this.elementOffset.left-(this._clickOffset?this._clickOffset.left:0)):(t=this.elementSize.height,i=e.y-this.elementOffset.top-(this._clickOffset?this._clickOffset.top:0)),s=i/t,s>1&&(s=1),0>s&&(s=0),"vertical"===this.orientation&&(s=1-s),n=this._valueMax()-this._valueMin(),a=this._valueMin()+s*n,this._trimAlignValue(a)},_start:function(e,t){var i={handle:this.handles[t],value:this.value()};return this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._trigger("start",e,i)},_slide:function(e,t,i){var s,n,a;this.options.values&&this.options.values.length?(s=this.values(t?0:1),2===this.options.values.length&&this.options.range===!0&&(0===t&&i>s||1===t&&s>i)&&(i=s),i!==this.values(t)&&(n=this.values(),n[t]=i,a=this._trigger("slide",e,{handle:this.handles[t],value:i,values:n}),s=this.values(t?0:1),a!==!1&&this.values(t,i))):i!==this.value()&&(a=this._trigger("slide",e,{handle:this.handles[t],value:i}),a!==!1&&this.value(i))},_stop:function(e,t){var i={handle:this.handles[t],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._trigger("stop",e,i)},_change:function(e,t){if(!this._keySliding&&!this._mouseSliding){var i={handle:this.handles[t],value:this.value()};this.options.values&&this.options.values.length&&(i.value=this.values(t),i.values=this.values()),this._lastChangedValue=t,this._trigger("change",e,i)}},value:function(e){return arguments.length?(this.options.value=this._trimAlignValue(e),this._refreshValue(),this._change(null,0),void 0):this._value()},values:function(t,i){var s,n,a;if(arguments.length>1)return this.options.values[t]=this._trimAlignValue(i),this._refreshValue(),this._change(null,t),void 0;if(!arguments.length)return this._values();if(!e.isArray(arguments[0]))return this.options.values&&this.options.values.length?this._values(t):this.value();for(s=this.options.values,n=arguments[0],a=0;s.length>a;a+=1)s[a]=this._trimAlignValue(n[a]),this._change(null,a);this._refreshValue()},_setOption:function(t,i){var s,n=0;switch("range"===t&&this.options.range===!0&&("min"===i?(this.options.value=this._values(0),this.options.values=null):"max"===i&&(this.options.value=this._values(this.options.values.length-1),this.options.values=null)),e.isArray(this.options.values)&&(n=this.options.values.length),"disabled"===t&&this.element.toggleClass("ui-state-disabled",!!i),this._super(t,i),t){case"orientation":this._detectOrientation(),this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-"+this.orientation),this._refreshValue(),this.handles.css("horizontal"===i?"bottom":"left","");break;case"value":this._animateOff=!0,this._refreshValue(),this._change(null,0),this._animateOff=!1;break;case"values":for(this._animateOff=!0,this._refreshValue(),s=0;n>s;s+=1)this._change(null,s);this._animateOff=!1;break;case"step":case"min":case"max":this._animateOff=!0,this._calculateNewMax(),this._refreshValue(),this._animateOff=!1;break;case"range":this._animateOff=!0,this._refresh(),this._animateOff=!1}},_value:function(){var e=this.options.value;return e=this._trimAlignValue(e)},_values:function(e){var t,i,s;if(arguments.length)return t=this.options.values[e],t=this._trimAlignValue(t);if(this.options.values&&this.options.values.length){for(i=this.options.values.slice(),s=0;i.length>s;s+=1)i[s]=this._trimAlignValue(i[s]);return i}return[]},_trimAlignValue:function(e){if(this._valueMin()>=e)return this._valueMin();if(e>=this._valueMax())return this._valueMax();var t=this.options.step>0?this.options.step:1,i=(e-this._valueMin())%t,s=e-i;return 2*Math.abs(i)>=t&&(s+=i>0?t:-t),parseFloat(s.toFixed(5))},_calculateNewMax:function(){var e=this.options.max,t=this._valueMin(),i=this.options.step,s=Math.floor(+(e-t).toFixed(this._precision())/i)*i;e=s+t,this.max=parseFloat(e.toFixed(this._precision()))},_precision:function(){var e=this._precisionOf(this.options.step);return null!==this.options.min&&(e=Math.max(e,this._precisionOf(this.options.min))),e},_precisionOf:function(e){var t=""+e,i=t.indexOf(".");return-1===i?0:t.length-i-1},_valueMin:function(){return this.options.min},_valueMax:function(){return this.max},_refreshValue:function(){var t,i,s,n,a,o=this.options.range,r=this.options,h=this,l=this._animateOff?!1:r.animate,u={};this.options.values&&this.options.values.length?this.handles.each(function(s){i=100*((h.values(s)-h._valueMin())/(h._valueMax()-h._valueMin())),u["horizontal"===h.orientation?"left":"bottom"]=i+"%",e(this).stop(1,1)[l?"animate":"css"](u,r.animate),h.options.range===!0&&("horizontal"===h.orientation?(0===s&&h.range.stop(1,1)[l?"animate":"css"]({left:i+"%"},r.animate),1===s&&h.range[l?"animate":"css"]({width:i-t+"%"},{queue:!1,duration:r.animate})):(0===s&&h.range.stop(1,1)[l?"animate":"css"]({bottom:i+"%"},r.animate),1===s&&h.range[l?"animate":"css"]({height:i-t+"%"},{queue:!1,duration:r.animate}))),t=i}):(s=this.value(),n=this._valueMin(),a=this._valueMax(),i=a!==n?100*((s-n)/(a-n)):0,u["horizontal"===this.orientation?"left":"bottom"]=i+"%",this.handle.stop(1,1)[l?"animate":"css"](u,r.animate),"min"===o&&"horizontal"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({width:i+"%"},r.animate),"max"===o&&"horizontal"===this.orientation&&this.range[l?"animate":"css"]({width:100-i+"%"},{queue:!1,duration:r.animate}),"min"===o&&"vertical"===this.orientation&&this.range.stop(1,1)[l?"animate":"css"]({height:i+"%"},r.animate),"max"===o&&"vertical"===this.orientation&&this.range[l?"animate":"css"]({height:100-i+"%"},{queue:!1,duration:r.animate}))},_handleEvents:{keydown:function(t){var i,s,n,a,o=e(t.target).data("ui-slider-handle-index");switch(t.keyCode){case e.ui.keyCode.HOME:case e.ui.keyCode.END:case e.ui.keyCode.PAGE_UP:case e.ui.keyCode.PAGE_DOWN:case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:if(t.preventDefault(),!this._keySliding&&(this._keySliding=!0,e(t.target).addClass("ui-state-active"),i=this._start(t,o),i===!1))return}switch(a=this.options.step,s=n=this.options.values&&this.options.values.length?this.values(o):this.value(),t.keyCode){case e.ui.keyCode.HOME:n=this._valueMin();break;case e.ui.keyCode.END:n=this._valueMax();break;case e.ui.keyCode.PAGE_UP:n=this._trimAlignValue(s+(this._valueMax()-this._valueMin())/this.numPages);break;case e.ui.keyCode.PAGE_DOWN:n=this._trimAlignValue(s-(this._valueMax()-this._valueMin())/this.numPages);break;case e.ui.keyCode.UP:case e.ui.keyCode.RIGHT:if(s===this._valueMax())return;n=this._trimAlignValue(s+a);break;case e.ui.keyCode.DOWN:case e.ui.keyCode.LEFT:if(s===this._valueMin())return;n=this._trimAlignValue(s-a)}this._slide(t,o,n)},keyup:function(t){var i=e(t.target).data("ui-slider-handle-index");this._keySliding&&(this._keySliding=!1,this._stop(t,i),this._change(t,i),e(t.target).removeClass("ui-state-active"))}}})});
/*!
 * Modernizr v2.8.3
 * www.modernizr.com
 *
 * Copyright (c) Faruk Ates, Paul Irish, Alex Sexton
 * Available under the BSD and MIT licenses: www.modernizr.com/license/
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in
 * the current UA and makes the results available to you in two ways:
 * as properties on a global Modernizr object, and as classes on the
 * <html> element. This information allows you to progressively enhance
 * your pages with a granular level of control over the experience.
 *
 * Modernizr has an optional (not included) conditional resource loader
 * called Modernizr.load(), based on Yepnope.js (yepnopejs.com).
 * To get a build that includes Modernizr.load(), as well as choosing
 * which tests to include, go to www.modernizr.com/download/
 *
 * Authors        Faruk Ates, Paul Irish, Alex Sexton
 * Contributors   Ryan Seddon, Ben Alman
 */

window.Modernizr = (function( window, document, undefined ) {

    var version = '2.8.3',

    Modernizr = {},

    /*>>cssclasses*/
    // option for enabling the HTML classes to be added
    enableClasses = true,
    /*>>cssclasses*/

    docElement = document.documentElement,

    /**
     * Create our "modernizr" element that we do most feature tests on.
     */
    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    /**
     * Create the input element for various Web Forms feature tests.
     */
    inputElem /*>>inputelem*/ = document.createElement('input') /*>>inputelem*/ ,

    /*>>smile*/
    smile = ':)',
    /*>>smile*/

    toString = {}.toString,

    // TODO :: make the prefixes more granular
    /*>>prefixes*/
    // List of property values to set for css tests. See ticket #21
    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),
    /*>>prefixes*/

    /*>>domprefixes*/
    // Following spec is to expose vendor-specific style properties as:
    //   elem.style.WebkitBorderRadius
    // and the following would be incorrect:
    //   elem.style.webkitBorderRadius

    // Webkit ghosts their properties in lowercase but Opera & Moz do not.
    // Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
    //   erik.eae.net/archives/2008/03/10/21.48.10/

    // More here: github.com/Modernizr/Modernizr/issues/issue/21
    omPrefixes = 'Webkit Moz O ms',

    cssomPrefixes = omPrefixes.split(' '),

    domPrefixes = omPrefixes.toLowerCase().split(' '),
    /*>>domprefixes*/

    /*>>ns*/
    ns = {'svg': 'http://www.w3.org/2000/svg'},
    /*>>ns*/

    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, // used in testing loop


    /*>>teststyles*/
    // Inject element with style element and some CSS rules
    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node, docOverflow,
          div = document.createElement('div'),
          // After page load injecting a fake body doesn't work so check if body exists
          body = document.body,
          // IE6 and 7 won't return offsetWidth or offsetHeight unless it's in the body element, so we fake it.
          fakeBody = body || document.createElement('body');

      if ( parseInt(nodes, 10) ) {
          // In order not to give false positives we create a node for each test
          // This also allows the method to scale for unspecified uses
          while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

      // <style> elements in IE6-9 are considered 'NoScope' elements and therefore will be removed
      // when injected with innerHTML. To get around this you need to prepend the 'NoScope' element
      // with a 'scoped' element, in our case the soft-hyphen entity as it won't mess with our measurements.
      // msdn.microsoft.com/en-us/library/ms533897%28VS.85%29.aspx
      // Documents served as xml will throw if using &shy; so use xml friendly encoded version. See issue #277
      style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
      // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
      // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
      (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if ( !body ) {
          //avoid crashing IE8, if background image is used
          fakeBody.style.background = '';
          //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
          fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
      // If this is done after page load we don't want to remove the body so check if body exists
      if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
      } else {
          div.parentNode.removeChild(div);
      }

      return !!ret;

    },
    /*>>teststyles*/

    /*>>mq*/
    // adapted from matchMedia polyfill
    // by Scott Jehl and Paul Irish
    // gist.github.com/786768
    testMediaQuery = function( mq ) {

      var matchMedia = window.matchMedia || window.msMatchMedia;
      if ( matchMedia ) {
        return matchMedia(mq) && matchMedia(mq).matches || false;
      }

      var bool;

      injectElementWithStyles('@media ' + mq + ' { #' + mod + ' { position: absolute; } }', function( node ) {
        bool = (window.getComputedStyle ?
                  getComputedStyle(node, null) :
                  node.currentStyle)['position'] == 'absolute';
      });

      return bool;

     },
     /*>>mq*/


    /*>>hasevent*/
    //
    // isEventSupported determines if a given element supports the given event
    // kangax.github.com/iseventsupported/
    //
    // The following results are known incorrects:
    //   Modernizr.hasEvent("webkitTransitionEnd", elem) // false negative
    //   Modernizr.hasEvent("textInput") // in Webkit. github.com/Modernizr/Modernizr/issues/333
    //   ...
    isEventSupported = (function() {

      var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
      };

      function isEventSupported( eventName, element ) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

        // When using `setAttribute`, IE skips "unload", WebKit skips "unload" and "resize", whereas `in` "catches" those
        var isSupported = eventName in element;

        if ( !isSupported ) {
          // If it has no `setAttribute` (i.e. doesn't implement Node interface), try generic element
          if ( !element.setAttribute ) {
            element = document.createElement('div');
          }
          if ( element.setAttribute && element.removeAttribute ) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');

            // If property was created, "remove it" (by setting value to `undefined`)
            if ( !is(element[eventName], 'undefined') ) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })(),
    /*>>hasevent*/

    // TODO :: Add flag for hasownprop ? didn't last time

    // hasOwnProperty shim by kangax needed for Safari 2.0 support
    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }

    // Adapted from ES5-shim https://github.com/kriskowal/es5-shim/blob/master/es5-shim.js
    // es5.github.com/#x15.3.4.5

    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    /**
     * setCss applies given styles to the Modernizr DOM node.
     */
    function setCss( str ) {
        mStyle.cssText = str;
    }

    /**
     * setCssAll extrapolates all vendor-specific css strings.
     */
    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    /**
     * is returns a boolean for if typeof obj is exactly type.
     */
    function is( obj, type ) {
        return typeof obj === type;
    }

    /**
     * contains returns a boolean for if substr is found within str.
     */
    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    /*>>testprop*/

    // testProps is a generic CSS / DOM property test.

    // In testing support for a given CSS property, it's legit to test:
    //    `elem.style[styleName] !== undefined`
    // If the property is supported it will return an empty string,
    // if unsupported it will return undefined.

    // We'll take advantage of this quick test and skip setting a style
    // on our modernizr element, but instead just testing undefined vs
    // empty string.

    // Because the testing of the CSS property names (with "-", as
    // opposed to the camelCase DOM properties) is non-portable and
    // non-standard but works in WebKit and IE (but not Gecko or Opera),
    // we explicitly reject properties with dashes so that authors
    // developing in WebKit or IE first don't end up with
    // browser-specific content by accident.

    function testProps( props, prefixed ) {
        for ( var i in props ) {
            var prop = props[i];
            if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }
    /*>>testprop*/

    // TODO :: add testDOMProps
    /**
     * testDOMProps is a generic DOM property test; if a browser supports
     *   a certain property, it won't return undefined for it.
     */
    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                // return the property name as a string
                if (elem === false) return props[i];

                // let's bind a function
                if (is(item, 'function')){
                  // default to autobind unless override
                  return item.bind(elem || obj);
                }

                // return the unbound function or obj or value
                return item;
            }
        }
        return false;
    }

    /*>>testallprops*/
    /**
     * testPropsAll tests a list of DOM properties we want to check against.
     *   We specify literally ALL possible (known and/or likely) properties on
     *   the element including the non-vendor prefixed one, for forward-
     *   compatibility.
     */
    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

        // did they call .prefixed('boxSizing') or are we just testing a prop?
        if(is(prefixed, "string") || is(prefixed, "undefined")) {
          return testProps(props, prefixed);

        // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
        } else {
          props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
          return testDOMProps(props, prefixed, elem);
        }
    }
    /*>>testallprops*/


    /**
     * Tests
     * -----
     */

    // The *new* flexbox
    // dev.w3.org/csswg/css3-flexbox

    tests['flexbox'] = function() {
      return testPropsAll('flexWrap');
    };

    // The *old* flexbox
    // www.w3.org/TR/2009/WD-css3-flexbox-20090723/

    tests['flexboxlegacy'] = function() {
        return testPropsAll('boxDirection');
    };

    // On the S60 and BB Storm, getContext exists, but always returns undefined
    // so we actually have to call getContext() to verify
    // github.com/Modernizr/Modernizr/issues/issue/97/

    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };

    // webk.it/70117 is tracking a legit WebGL feature detect proposal

    // We do a soft detect which may false positive in order to avoid
    // an expensive context creation: bugzil.la/732441

    tests['webgl'] = function() {
        return !!window.WebGLRenderingContext;
    };

    /*
     * The Modernizr.touch test only indicates if the browser supports
     *    touch events, which does not necessarily reflect a touchscreen
     *    device, as evidenced by tablets running Windows 7 or, alas,
     *    the Palm Pre / WebOS (touch) phones.
     *
     * Additionally, Chrome (desktop) used to lie about its support on this,
     *    but that has since been rectified: crbug.com/36415
     *
     * We also test for Firefox 4 Multitouch Support.
     *
     * For more info, see: modernizr.github.com/Modernizr/touch.html
     */

    tests['touch'] = function() {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
          bool = true;
        } else {
          injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
            bool = node.offsetTop === 9;
          });
        }

        return bool;
    };


    // geolocation is often considered a trivial feature detect...
    // Turns out, it's quite tricky to get right:
    //
    // Using !!navigator.geolocation does two things we don't want. It:
    //   1. Leaks memory in IE9: github.com/Modernizr/Modernizr/issues/513
    //   2. Disables page caching in WebKit: webk.it/43956
    //
    // Meanwhile, in Firefox < 8, an about:config setting could expose
    // a false positive that would throw an exception: bugzil.la/688158

    tests['geolocation'] = function() {
        return 'geolocation' in navigator;
    };


    tests['postmessage'] = function() {
      return !!window.postMessage;
    };


    // Chrome incognito mode used to throw an exception when using openDatabase
    // It doesn't anymore.
    tests['websqldatabase'] = function() {
      return !!window.openDatabase;
    };

    // Vendors had inconsistent prefixing with the experimental Indexed DB:
    // - Webkit's implementation is accessible through webkitIndexedDB
    // - Firefox shipped moz_indexedDB before FF4b9, but since then has been mozIndexedDB
    // For speed, we don't test the legacy (and beta-only) indexedDB
    tests['indexedDB'] = function() {
      return !!testPropsAll("indexedDB", window);
    };

    // documentMode logic from YUI to filter out IE8 Compat Mode
    //   which false positives.
    tests['hashchange'] = function() {
      return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
    };

    // Per 1.6:
    // This used to be Modernizr.historymanagement but the longer
    // name has been deprecated in favor of a shorter and property-matching one.
    // The old API is still available in 1.6, but as of 2.0 will throw a warning,
    // and in the first release thereafter disappear entirely.
    tests['history'] = function() {
      return !!(window.history && history.pushState);
    };

    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };

    // FF3.6 was EOL'ed on 4/24/12, but the ESR version of FF10
    // will be supported until FF19 (2/12/13), at which time, ESR becomes FF17.
    // FF10 still uses prefixes, so check for it until then.
    // for more ESR info, see: mozilla.org/en-US/firefox/organizations/faq/
    tests['websockets'] = function() {
        return 'WebSocket' in window || 'MozWebSocket' in window;
    };


    // css-tricks.com/rgba-browser-support/
    tests['rgba'] = function() {
        // Set an rgba() color and check the returned value

        setCss('background-color:rgba(150,255,150,.5)');

        return contains(mStyle.backgroundColor, 'rgba');
    };

    tests['hsla'] = function() {
        // Same as rgba(), in fact, browsers re-map hsla() to rgba() internally,
        //   except IE9 who retains it as hsla

        setCss('background-color:hsla(120,40%,100%,.5)');

        return contains(mStyle.backgroundColor, 'rgba') || contains(mStyle.backgroundColor, 'hsla');
    };

    tests['multiplebgs'] = function() {
        // Setting multiple images AND a color on the background shorthand property
        //  and then querying the style.background property value for the number of
        //  occurrences of "url(" is a reliable method for detecting ACTUAL support for this!

        setCss('background:url(https://),url(https://),red url(https://)');

        // If the UA supports multiple backgrounds, there should be three occurrences
        //   of the string "url(" in the return value for elemStyle.background

        return (/(url\s*\(.*?){3}/).test(mStyle.background);
    };



    // this will false positive in Opera Mini
    //   github.com/Modernizr/Modernizr/issues/396

    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize');
    };

    tests['borderimage'] = function() {
        return testPropsAll('borderImage');
    };


    // Super comprehensive table about all the unique implementations of
    // border-radius: muddledramblings.com/table-of-css3-border-radius-compliance

    tests['borderradius'] = function() {
        return testPropsAll('borderRadius');
    };

    // WebOS unfortunately false positives on this test.
    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow');
    };

    // FF3.0 will false positive on this test
    tests['textshadow'] = function() {
        return document.createElement('div').style.textShadow === '';
    };


    tests['opacity'] = function() {
        // Browsers that actually have CSS Opacity implemented have done so
        //  according to spec, which means their return values are within the
        //  range of [0.0,1.0] - including the leading zero.

        setCssAll('opacity:.55');

        // The non-literal . in this regex is intentional:
        //   German Chrome returns this value as 0,55
        // github.com/Modernizr/Modernizr/issues/#issue/59/comment/516632
        return (/^0.55$/).test(mStyle.opacity);
    };


    // Note, Android < 4 will pass this test, but can only animate
    //   a single property at a time
    //   goo.gl/v3V4Gp
    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };


    tests['csscolumns'] = function() {
        return testPropsAll('columnCount');
    };


    tests['cssgradients'] = function() {
        /**
         * For CSS Gradients syntax, please see:
         * webkit.org/blog/175/introducing-css-gradients/
         * developer.mozilla.org/en/CSS/-moz-linear-gradient
         * developer.mozilla.org/en/CSS/-moz-radial-gradient
         * dev.w3.org/csswg/css3-images/#gradients-
         */

        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';

        setCss(
             // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
              (str1 + '-webkit- '.split(' ').join(str2 + str1) +
             // standard syntax             // trailing 'background-image:'
              prefixes.join(str3 + str1)).slice(0, -str1.length)
        );

        return contains(mStyle.backgroundImage, 'gradient');
    };


    tests['cssreflections'] = function() {
        return testPropsAll('boxReflect');
    };


    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };


    tests['csstransforms3d'] = function() {

        var ret = !!testPropsAll('perspective');

        // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
        //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
        //   some conditions. As a result, Webkit typically recognizes the syntax but
        //   will sometimes throw a false positive, thus we must do a more thorough check:
        if ( ret && 'webkitPerspective' in docElement.style ) {

          // Webkit allows this media query to succeed only if the feature is enabled.
          // `@media (transform-3d),(-webkit-transform-3d){ ... }`
          injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
            ret = node.offsetLeft === 9 && node.offsetHeight === 3;
          });
        }
        return ret;
    };


    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };


    /*>>fontface*/
    // @font-face detection routine by Diego Perini
    // javascript.nwbox.com/CSSSupport/

    // false positives:
    //   WebOS github.com/Modernizr/Modernizr/issues/342
    //   WP7   github.com/Modernizr/Modernizr/issues/538
    tests['fontface'] = function() {
        var bool;

        injectElementWithStyles('@font-face {font-family:"font";src:url("https://")}', function( node, rule ) {
          var style = document.getElementById('smodernizr'),
              sheet = style.sheet || style.styleSheet,
              cssText = sheet ? (sheet.cssRules && sheet.cssRules[0] ? sheet.cssRules[0].cssText : sheet.cssText || '') : '';

          bool = /src/i.test(cssText) && cssText.indexOf(rule.split(' ')[0]) === 0;
        });

        return bool;
    };
    /*>>fontface*/

    // CSS generated content detection
    tests['generatedcontent'] = function() {
        var bool;

        injectElementWithStyles(['#',mod,'{font:0/0 a}#',mod,':after{content:"',smile,'";visibility:hidden;font:3px/1 a}'].join(''), function( node ) {
          bool = node.offsetHeight >= 3;
        });

        return bool;
    };



    // These tests evaluate support of the video/audio elements, as well as
    // testing what types of content they support.
    //
    // We're using the Boolean constructor here, so that we can extend the value
    // e.g.  Modernizr.video     // true
    //       Modernizr.video.ogg // 'probably'
    //
    // Codec values from : github.com/NielsLeenheer/html5test/blob/9106a8/index.html#L845
    //                     thx to NielsLeenheer and zcorpan

    // Note: in some older browsers, "no" was a return value instead of empty string.
    //   It was live in FF3.5.0 and 3.5.1, but fixed in 3.5.2
    //   It was also live in Safari 4.0.0 - 4.0.4, but fixed in 4.0.5

    tests['video'] = function() {
        var elem = document.createElement('video'),
            bool = false;

        // IE9 Running on Windows Server SKU can cause an exception to be thrown, bug #224
        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('video/ogg; codecs="theora"')      .replace(/^no$/,'');

                // Without QuickTime, this value will be `undefined`. github.com/Modernizr/Modernizr/issues/546
                bool.h264 = elem.canPlayType('video/mp4; codecs="avc1.42E01E"') .replace(/^no$/,'');

                bool.webm = elem.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,'');
            }

        } catch(e) { }

        return bool;
    };

    tests['audio'] = function() {
        var elem = document.createElement('audio'),
            bool = false;

        try {
            if ( bool = !!elem.canPlayType ) {
                bool      = new Boolean(bool);
                bool.ogg  = elem.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,'');
                bool.mp3  = elem.canPlayType('audio/mpeg;')               .replace(/^no$/,'');

                // Mimetypes accepted:
                //   developer.mozilla.org/En/Media_formats_supported_by_the_audio_and_video_elements
                //   bit.ly/iphoneoscodecs
                bool.wav  = elem.canPlayType('audio/wav; codecs="1"')     .replace(/^no$/,'');
                bool.m4a  = ( elem.canPlayType('audio/x-m4a;')            ||
                              elem.canPlayType('audio/aac;'))             .replace(/^no$/,'');
            }
        } catch(e) { }

        return bool;
    };


    // In FF4, if disabled, window.localStorage should === null.

    // Normally, we could not test that directly and need to do a
    //   `('localStorage' in window) && ` test first because otherwise Firefox will
    //   throw bugzil.la/365772 if cookies are disabled

    // Also in iOS5 Private Browsing mode, attempting to use localStorage.setItem
    // will throw the exception:
    //   QUOTA_EXCEEDED_ERRROR DOM Exception 22.
    // Peculiarly, getItem and removeItem calls do not throw.

    // Because we are forced to try/catch this, we'll go aggressive.

    // Just FWIW: IE8 Compat mode supports these features completely:
    //   www.quirksmode.org/dom/html5.html
    // But IE8 doesn't support either with local files

    tests['localstorage'] = function() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };

    tests['sessionstorage'] = function() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };


    tests['webworkers'] = function() {
        return !!window.Worker;
    };


    tests['applicationcache'] = function() {
        return !!window.applicationCache;
    };


    // Thanks to Erik Dahlstrom
    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    // specifically for SVG inline in HTML, not within XHTML
    // test page: paulirish.com/demo/inline-svg
    tests['inlinesvg'] = function() {
      var div = document.createElement('div');
      div.innerHTML = '<svg/>';
      return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };

    // SVG SMIL animation
    tests['smil'] = function() {
        return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')));
    };

    // This test is only for clip paths in SVG proper, not clip paths on HTML content
    // demo: srufaculty.sru.edu/david.dailey/svg/newstuff/clipPath4.svg

    // However read the comments to dig into applying SVG clippaths to HTML content here:
    //   github.com/Modernizr/Modernizr/issues/213#issuecomment-1149491
    tests['svgclippaths'] = function() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
    };

    /*>>webforms*/
    // input features and input types go directly onto the ret object, bypassing the tests loop.
    // Hold this guy to execute in a moment.
    function webforms() {
        /*>>input*/
        // Run through HTML5's new input attributes to see if the UA understands any.
        // We're using f which is the <input> element created early on
        // Mike Taylr has created a comprehensive resource for testing these attributes
        //   when applied to all input types:
        //   miketaylr.com/code/input-type-attr.html
        // spec: www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary

        // Only input placeholder is tested while textarea's placeholder is not.
        // Currently Safari 4 and Opera 11 have support only for the input placeholder
        // Both tests are available in feature-detects/forms-placeholder.js
        Modernizr['input'] = (function( props ) {
            for ( var i = 0, len = props.length; i < len; i++ ) {
                attrs[ props[i] ] = !!(props[i] in inputElem);
            }
            if (attrs.list){
              // safari false positive's on datalist: webk.it/74252
              // see also github.com/Modernizr/Modernizr/issues/146
              attrs.list = !!(document.createElement('datalist') && window.HTMLDataListElement);
            }
            return attrs;
        })('autocomplete autofocus list placeholder max min multiple pattern required step'.split(' '));
        /*>>input*/

        /*>>inputtypes*/
        // Run through HTML5's new input types to see if the UA understands any.
        //   This is put behind the tests runloop because it doesn't return a
        //   true/false like all the other tests; instead, it returns an object
        //   containing each input type with its corresponding true/false value

        // Big thanks to @miketaylr for the html5 forms expertise. miketaylr.com/
        Modernizr['inputtypes'] = (function(props) {

            for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {

                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';

                // We first check to see if the type we give it sticks..
                // If the type does, we feed it a textual value, which shouldn't be valid.
                // If the value doesn't stick, we know there's input sanitization which infers a custom UI
                if ( bool ) {

                    inputElem.value         = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                    if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

                      docElement.appendChild(inputElem);
                      defaultView = document.defaultView;

                      // Safari 2-4 allows the smiley as a value, despite making a slider
                      bool =  defaultView.getComputedStyle &&
                              defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                              // Mobile android web browser has false positive, so must
                              // check the height to see if the widget is actually there.
                              (inputElem.offsetHeight !== 0);

                      docElement.removeChild(inputElem);

                    } else if ( /^(search|tel)$/.test(inputElemType) ){
                      // Spec doesn't define any special parsing or detectable UI
                      //   behaviors so we pass these through as true

                      // Interestingly, opera fails the earlier test, so it doesn't
                      //  even make it here.

                    } else if ( /^(url|email)$/.test(inputElemType) ) {
                      // Real url and email support comes with prebaked validation.
                      bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                    } else {
                      // If the upgraded input compontent rejects the :) text, we got a winner
                      bool = inputElem.value != smile;
                    }
                }

                inputs[ props[i] ] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
        /*>>inputtypes*/
    }
    /*>>webforms*/


    // End of test definitions
    // -----------------------



    // Run through all tests and detect their support in the current UA.
    // todo: hypothetically we could be doing an array of tests and use a basic loop here.
    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
            // run the test, throw the return value into the Modernizr,
            //   then based on that boolean, define an appropriate className
            //   and push it into an array of classes we'll join later.
            featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }

    /*>>webforms*/
    // input tests need to run.
    Modernizr.input || webforms();
    /*>>webforms*/


    /**
     * addTest allows the user to define their own feature tests
     * the result will be added onto the Modernizr object,
     * as well as an appropriate className set on the html element
     *
     * @param feature - String naming the feature
     * @param test - Function returning true if feature is supported, false if not
     */
     Modernizr.addTest = function ( feature, test ) {
       if ( typeof feature == 'object' ) {
         for ( var key in feature ) {
           if ( hasOwnProp( feature, key ) ) {
             Modernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( Modernizr[feature] !== undefined ) {
           // we're going to quit if you're trying to overwrite an existing test
           // if we were to allow it, we'd do this:
           //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
           //   docElement.className = docElement.className.replace( re, '' );
           // but, no rly, stuff 'em.
           return Modernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (typeof enableClasses !== "undefined" && enableClasses) {
           docElement.className += ' ' + (test ? '' : 'no-') + feature;
         }
         Modernizr[feature] = test;

       }

       return Modernizr; // allow chaining.
     };


    // Reset modElem.cssText to nothing to reduce memory footprint.
    setCss('');
    modElem = inputElem = null;

    /*>>shiv*/
    /**
     * @preserve HTML5 Shiv prev3.7.1 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
     */
    ;(function(window, document) {
        /*jshint evil:true */
        /** version */
        var version = '3.7.0';

        /** Preset options */
        var options = window.html5 || {};

        /** Used to skip problem elements */
        var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

        /** Not all elements can be cloned in IE **/
        var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

        /** Detect whether the browser supports default html5 styles */
        var supportsHtml5Styles;

        /** Name of the expando, to work with multiple documents or to re-shiv one document */
        var expando = '_html5shiv';

        /** The id for the the documents expando */
        var expanID = 0;

        /** Cached data for each document */
        var expandoData = {};

        /** Detect whether the browser supports unknown elements */
        var supportsUnknownElements;

        (function() {
          try {
            var a = document.createElement('a');
            a.innerHTML = '<xyz></xyz>';
            //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
            supportsHtml5Styles = ('hidden' in a);

            supportsUnknownElements = a.childNodes.length == 1 || (function() {
              // assign a false positive if unable to shiv
              (document.createElement)('a');
              var frag = document.createDocumentFragment();
              return (
                typeof frag.cloneNode == 'undefined' ||
                typeof frag.createDocumentFragment == 'undefined' ||
                typeof frag.createElement == 'undefined'
              );
            }());
          } catch(e) {
            // assign a false positive if detection fails => unable to shiv
            supportsHtml5Styles = true;
            supportsUnknownElements = true;
          }

        }());

        /*--------------------------------------------------------------------------*/

        /**
         * Creates a style sheet with the given CSS text and adds it to the document.
         * @private
         * @param {Document} ownerDocument The document.
         * @param {String} cssText The CSS text.
         * @returns {StyleSheet} The style element.
         */
        function addStyleSheet(ownerDocument, cssText) {
          var p = ownerDocument.createElement('p'),
          parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

          p.innerHTML = 'x<style>' + cssText + '</style>';
          return parent.insertBefore(p.lastChild, parent.firstChild);
        }

        /**
         * Returns the value of `html5.elements` as an array.
         * @private
         * @returns {Array} An array of shived element node names.
         */
        function getElements() {
          var elements = html5.elements;
          return typeof elements == 'string' ? elements.split(' ') : elements;
        }

        /**
         * Returns the data associated to the given document
         * @private
         * @param {Document} ownerDocument The document.
         * @returns {Object} An object of data.
         */
        function getExpandoData(ownerDocument) {
          var data = expandoData[ownerDocument[expando]];
          if (!data) {
            data = {};
            expanID++;
            ownerDocument[expando] = expanID;
            expandoData[expanID] = data;
          }
          return data;
        }

        /**
         * returns a shived element for the given nodeName and document
         * @memberOf html5
         * @param {String} nodeName name of the element
         * @param {Document} ownerDocument The context document.
         * @returns {Object} The shived element.
         */
        function createElement(nodeName, ownerDocument, data){
          if (!ownerDocument) {
            ownerDocument = document;
          }
          if(supportsUnknownElements){
            return ownerDocument.createElement(nodeName);
          }
          if (!data) {
            data = getExpandoData(ownerDocument);
          }
          var node;

          if (data.cache[nodeName]) {
            node = data.cache[nodeName].cloneNode();
          } else if (saveClones.test(nodeName)) {
            node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
          } else {
            node = data.createElem(nodeName);
          }

          // Avoid adding some elements to fragments in IE < 9 because
          // * Attributes like `name` or `type` cannot be set/changed once an element
          //   is inserted into a document/fragment
          // * Link elements with `src` attributes that are inaccessible, as with
          //   a 403 response, will cause the tab/window to crash
          // * Script elements appended to fragments will execute when their `src`
          //   or `text` property is set
          return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
        }

        /**
         * returns a shived DocumentFragment for the given document
         * @memberOf html5
         * @param {Document} ownerDocument The context document.
         * @returns {Object} The shived DocumentFragment.
         */
        function createDocumentFragment(ownerDocument, data){
          if (!ownerDocument) {
            ownerDocument = document;
          }
          if(supportsUnknownElements){
            return ownerDocument.createDocumentFragment();
          }
          data = data || getExpandoData(ownerDocument);
          var clone = data.frag.cloneNode(),
          i = 0,
          elems = getElements(),
          l = elems.length;
          for(;i<l;i++){
            clone.createElement(elems[i]);
          }
          return clone;
        }

        /**
         * Shivs the `createElement` and `createDocumentFragment` methods of the document.
         * @private
         * @param {Document|DocumentFragment} ownerDocument The document.
         * @param {Object} data of the document.
         */
        function shivMethods(ownerDocument, data) {
          if (!data.cache) {
            data.cache = {};
            data.createElem = ownerDocument.createElement;
            data.createFrag = ownerDocument.createDocumentFragment;
            data.frag = data.createFrag();
          }


          ownerDocument.createElement = function(nodeName) {
            //abort shiv
            if (!html5.shivMethods) {
              return data.createElem(nodeName);
            }
            return createElement(nodeName, ownerDocument, data);
          };

          ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
                                                          'var n=f.cloneNode(),c=n.createElement;' +
                                                          'h.shivMethods&&(' +
                                                          // unroll the `createElement` calls
                                                          getElements().join().replace(/[\w\-]+/g, function(nodeName) {
            data.createElem(nodeName);
            data.frag.createElement(nodeName);
            return 'c("' + nodeName + '")';
          }) +
            ');return n}'
                                                         )(html5, data.frag);
        }

        /*--------------------------------------------------------------------------*/

        /**
         * Shivs the given document.
         * @memberOf html5
         * @param {Document} ownerDocument The document to shiv.
         * @returns {Document} The shived document.
         */
        function shivDocument(ownerDocument) {
          if (!ownerDocument) {
            ownerDocument = document;
          }
          var data = getExpandoData(ownerDocument);

          if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
            data.hasCSS = !!addStyleSheet(ownerDocument,
                                          // corrects block display not defined in IE6/7/8/9
                                          'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
                                            // adds styling not present in IE6/7/8/9
                                            'mark{background:#FF0;color:#000}' +
                                            // hides non-rendered elements
                                            'template{display:none}'
                                         );
          }
          if (!supportsUnknownElements) {
            shivMethods(ownerDocument, data);
          }
          return ownerDocument;
        }

        /*--------------------------------------------------------------------------*/

        /**
         * The `html5` object is exposed so that more elements can be shived and
         * existing shiving can be detected on iframes.
         * @type Object
         * @example
         *
         * // options can be changed before the script is included
         * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
         */
        var html5 = {

          /**
           * An array or space separated string of node names of the elements to shiv.
           * @memberOf html5
           * @type Array|String
           */
          'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',

          /**
           * current version of html5shiv
           */
          'version': version,

          /**
           * A flag to indicate that the HTML5 style sheet should be inserted.
           * @memberOf html5
           * @type Boolean
           */
          'shivCSS': (options.shivCSS !== false),

          /**
           * Is equal to true if a browser supports creating unknown/HTML5 elements
           * @memberOf html5
           * @type boolean
           */
          'supportsUnknownElements': supportsUnknownElements,

          /**
           * A flag to indicate that the document's `createElement` and `createDocumentFragment`
           * methods should be overwritten.
           * @memberOf html5
           * @type Boolean
           */
          'shivMethods': (options.shivMethods !== false),

          /**
           * A string to describe the type of `html5` object ("default" or "default print").
           * @memberOf html5
           * @type String
           */
          'type': 'default',

          // shivs the document according to the specified `html5` object options
          'shivDocument': shivDocument,

          //creates a shived element
          createElement: createElement,

          //creates a shived documentFragment
          createDocumentFragment: createDocumentFragment
        };

        /*--------------------------------------------------------------------------*/

        // expose html5
        window.html5 = html5;

        // shiv the document
        shivDocument(document);

    }(this, document));
    /*>>shiv*/

    // Assign private properties to the return object with prefix
    Modernizr._version      = version;

    // expose these for the plugin API. Look in the source for how to join() them against your input
    /*>>prefixes*/
    Modernizr._prefixes     = prefixes;
    /*>>prefixes*/
    /*>>domprefixes*/
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;
    /*>>domprefixes*/

    /*>>mq*/
    // Modernizr.mq tests a given media query, live against the current state of the window
    // A few important notes:
    //   * If a browser does not support media queries at all (eg. oldIE) the mq() will always return false
    //   * A max-width or orientation query will be evaluated against the current state, which may change later.
    //   * You must specify values. Eg. If you are testing support for the min-width media query use:
    //       Modernizr.mq('(min-width:0)')
    // usage:
    // Modernizr.mq('only screen and (max-width:768)')
    Modernizr.mq            = testMediaQuery;
    /*>>mq*/

    /*>>hasevent*/
    // Modernizr.hasEvent() detects support for a given event, with an optional element to test on
    // Modernizr.hasEvent('gesturestart', elem)
    Modernizr.hasEvent      = isEventSupported;
    /*>>hasevent*/

    /*>>testprop*/
    // Modernizr.testProp() investigates whether a given style property is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testProp('pointerEvents')
    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };
    /*>>testprop*/

    /*>>testallprops*/
    // Modernizr.testAllProps() investigates whether a given style property,
    //   or any of its vendor-prefixed variants, is recognized
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testAllProps('boxSizing')
    Modernizr.testAllProps  = testPropsAll;
    /*>>testallprops*/


    /*>>teststyles*/
    // Modernizr.testStyles() allows you to add custom styles to the document and test an element afterwards
    // Modernizr.testStyles('#modernizr { position:absolute }', function(elem, rule){ ... })
    Modernizr.testStyles    = injectElementWithStyles;
    /*>>teststyles*/


    /*>>prefixed*/
    // Modernizr.prefixed() returns the prefixed or nonprefixed property name variant of your input
    // Modernizr.prefixed('boxSizing') // 'MozBoxSizing'

    // Properties must be passed as dom-style camelcase, rather than `box-sizing` hypentated style.
    // Return values will also be the camelCase variant, if you need to translate that to hypenated style use:
    //
    //     str.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');

    // If you're trying to ascertain which transition end event to bind to, you might do something like...
    //
    //     var transEndEventNames = {
    //       'WebkitTransition' : 'webkitTransitionEnd',
    //       'MozTransition'    : 'transitionend',
    //       'OTransition'      : 'oTransitionEnd',
    //       'msTransition'     : 'MSTransitionEnd',
    //       'transition'       : 'transitionend'
    //     },
    //     transEndEventName = transEndEventNames[ Modernizr.prefixed('transition') ];

    Modernizr.prefixed      = function(prop, obj, elem){
      if(!obj) {
        return testPropsAll(prop, 'pfx');
      } else {
        // Testing DOM property e.g. Modernizr.prefixed('requestAnimationFrame', window) // 'mozRequestAnimationFrame'
        return testPropsAll(prop, obj, elem);
      }
    };
    /*>>prefixed*/


    /*>>cssclasses*/
    // Remove "no-js" class from <html> element, if it exists:
    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

                            // Add the new classes to the <html> element.
                            (enableClasses ? ' js ' + classes.join(' ') : '');
    /*>>cssclasses*/

    return Modernizr;

})(this, this.document);
'use strict';

window.app = window.app || {};

app.CartCollection = Backbone.Collection.extend({
    
    // don't define the model here so we can add to it

    localStorage: new Backbone.LocalStorage('CartCollection'),


    url: '/',


    initialize: function() {
        console.log('cart collection init');
    }


});
app.cartCollection = new app.CartCollection();
'use strict';

window.app = window.app || {};

app.ClassCollection = Backbone.Collection.extend({
    model: app.ClassModel,

    url: 'http://trainco-dev.imulus-client.com/api/seminars/search'
});

app.globalCollection = new app.ClassCollection;

$('#search-btn').on('click', function() {
    $('.class-loader').css('display', 'block');
    var searchParams = app.mainSearchSelect.getSearchParams(),
        $emptyMsg = $('.empty-message'),
        $classLoader = $('.class-loader');

    console.log(searchParams)

    app.globalCollection.fetch({
        data: searchParams,
        type: "POST",
        contentType: "application/json",

        success: function(data) {
            console.log(data)
            if(data.length === 0) {
                $emptyMsg.fadeIn(100).text('We were unable to find classes that fit your preferences. Please change your search terms and try again.');
                $classLoader.fadeOut(350);
            } else {
                $emptyMsg.fadeOut(300);
                $classLoader.fadeOut(350);
                app.classView = new app.ClassView({
                    collection: app.globalCollection,
                    el: '.results'
                });
            }
        }
    });
});
'use strict';

window.app = window.app || {};

app.LocationCollection = Backbone.Collection.extend({
	model: app.LocationModel,

	url:'http://trainco-dev.imulus-client.com/api/locations/searchbyseminar'

});

app.locationCollection = new app.LocationCollection;
'use strict';

window.app = window.app || {};

app.ScheduleCollection = Backbone.Collection.extend({
    model: app.ScheduleModel,

    url:'http://trainco-dev.imulus-client.com/api/schedules/searchbylocation',

    initialize: function() {
        // this.listenTo(this.collection, 'add', this.render);
    }
});

app.scheduleCollection = new app.ScheduleCollection;
'use strict';

window.app = window.app || {};

app.CartItemModel = Backbone.Model.extend({

});

app.cartItemModel = new app.CartItemModel();
'use strict';

window.app = window.app || {};

app.ClassModel = Backbone.Model.extend({

});


'use strict';

window.app = window.app || {};

app.LocationModel = Backbone.Model.extend({

});
'use strict';

window.app = window.app || {};

app.ScheduleModel = Backbone.Model.extend({
	initialize: function() {
		console.log('sched model init')
	}
});
'use strict';

window.app = window.app || {};

// "view the cart" view
app.CartItemView = Backbone.View.extend({
    template: _.template($('#cartItemTemplate').html()),

    events: {
        'click .remove': 'removeItemFromCart',
        'blur .class-qty': function(e) {
            this.updateItemTotal(e);
            this.updateCartTotalPrice(e);
            this.updateCartTotalQuantity();
        }
    },

    initialize: function(options) {
        var _this = this;
        this.options = options || {};
        // this.listenTo(app.cartCollection, 'remove', this.updateCartTotalPrice, this.updateCartTotalQuantity);
        Backbone.on('calculateSubtotal', this.calculateSubtotal, this);
        Backbone.on('updateCartTotalPrice', this.updateCartTotalPrice, this);
    },

    render: function() {
        var $tpl = $(this.template(this.model.toJSON()));
        this.setElement($tpl);
        $('#cart-item-list').append($tpl);
        var quantity = this.model.get('quantity');
        this.$el.find('.class-qty').val(quantity);
        return this;
    },

    // this is only called when pulling from localStorage
    renderFromLocalStore: function() {
        var $tpl = $(this.template(this.model.toJSON()));
        this.setElement($tpl);
        $('#cart-item-list').append($tpl);
        this.model.set({
            fromLS: true,
            inCart: true
        });

        // fill in the cart data
        this.showDataFromLocalStore();

        // fill in the cart's total quantity and price
        this.updateCartTotalQuantity();
        this.updateCartTotalPrice();
        
        return this;
    },

    // fills view data in from local store model data
    showDataFromLocalStore: function() {
        var lsModelQuantity = this.model.get('quantity');
        this.model.set('quantity', lsModelQuantity);
        var lsModelSubTotal = this.model.get('price') * lsModelQuantity;
        this.$el.find('.sub-total').text('$' + lsModelSubTotal);
        this.$el.find('.class-qty').val(lsModelQuantity);
    },


    // quantity of each item in cart, changes on update or blur when item is in cart
    insertQuantity: function(model, quantity) {
        this.model.set('quantity', quantity);
        this.$el.find('.class-qty').last().val(quantity);        
    },

    // calculates subtotal for individual item
    calculateSubtotal: function() {
        // var quant = parseInt(quantity);
        // var isModelFromLocalStore = this.model.get('fromLS');
        // if(isModelFromLocalStore) {
        //     return false;
        // }
        var quantity = this.model.get('quantity');
        // setting quantity on new model
        // this.model.set('quantity', quant);
        this.currentSubTotal = this.model.get('price') * quantity;
        this.$el.find('.sub-total').text('$ ' + this.currentSubTotal);

        // this line updates the quantity in the just-added item
        this.$('.class-qty').val(quantity);

        // Backbone.off('calculateSubtotal');

        // updates total dollar value of cart on click of add item
        this.updateCartTotalPrice();
    },

    // if one clicks update button, sums subtotals
    updateCartTotalPrice: function() {
        var subTotalsArr = [];

        $('.cart-item').find('.sub-total').each(function() {
            var dollarAmount = parseInt($(this).text().replace('$', ''));
            subTotalsArr.push(dollarAmount);
        });

        // if one removes all the items in the cart, set the array val to zero
        if(subTotalsArr.length == 0) {
            var subTotalsArr = [0];
        }
        Backbone.trigger('updateTotalPrice', subTotalsArr, this.model);
    },

    // removes item from cart, re-calculates total price
    removeItemFromCart: function(e) {
        e.preventDefault();
        var _this = this;

        // remove the item from the DOM
        this.$el.slideUp(150, function() {
            _this.remove();
        });

        // remove the item from the collection
        this.model.destroy();

        // decrement cart total number
        this.updateCartTotalQuantity();

        // decrement cart total price
        this.updateCartTotalPrice();

    },

    // updates the cart total on cart item quantity update. purely in DOM. only called on remove.
    updateCartTotalQuantity: function() {
        var quantityArr = [];

        app.cartCollection.each(function(cartItemModel) {
            var itemQuantity = cartItemModel.get('quantity');
            quantityArr.push(itemQuantity);
        });

        if(quantityArr.length == 0) {
            var quantityArr = [0];
        }

        Backbone.trigger('updateCartTotalQty', quantityArr);
    },

    // calculates num of items for each item in the cart
    updateItemTotal: function(e) {
        e.preventDefault();
        var updatedQty = parseInt(this.$('.class-qty').val());

        // if someone changes the quantity to zero, remove item
        if(updatedQty === 0) {
            this.removeItemFromCart(e);
        }

        this.listenTo(this.model, 'change:quantity', this.calculateSubtotal);
        this.model.set('quantity', updatedQty);
                // console.log(this.model)
        // this.calculateSubtotal(updatedQty);
        // Backbone.trigger('updateOriginalModelQuantity', updatedQty);
    },

    // updates quantity for single item
    updateQuantity: function(quantity) {

        this.$el.find('.class-qty').val(quantity)



        // Backbone.trigger('calculateSubtotal', quantity);

        // updates the quantity of the original element if changed from the cart.
        // listener attached here so it only runs once
        // Backbone.on('updateOriginalModelQuantity', this.updateOriginalModelQuantity, this);
    }


});
'use strict';

window.app = window.app || {};

app.CartNotifyView = Backbone.View.extend({

    template: _.template($('#cartNotifyTemplate').html()),

    events: {
        'click #check-out': 'checkout'
    },

    initialize: function() {
        this.render();

        // variables
        this.totalCost = this.$('.total-cost');

        // event bus
        Backbone.on('updateTotalPrice', this.updateTotalPrice, this);
        Backbone.on('displayTotalPrice', this.displayTotalPrice, this);
        Backbone.on('updateCartTotalQty', this.updateCartTotalQty, this);

        // grab our items from localstorage
        // later we will need to clear localStorage after a successful checkout
        if(localStorage.length) {
            app.cartCollection.fetch({
                success: function(coll, resp) {
                    // console.log(resp)
                    coll.each(function(modelFromStorage) {
                        app.cartItemView = new app.CartItemView({
                            model: modelFromStorage
                        }).renderFromLocalStore();
                    }, this);
                }
            });
        }
    },

    render: function() {
        this.$el.html(this.template);
        return this;
    },

    // when you change the quantity of an item in the cart, update the total number of items in the cart
    updateTotalPrice: function(subTotals, model) {
        var subTotArray = subTotals;
        var updatedTotalPrice = subTotArray.reduce(function(a, b) {
            return a + b;
        });
        this.totalCost.text(updatedTotalPrice);
    },

    // the cart price total
    displayTotalPrice: function(quantity, price) {
        this.currentPrice = parseInt(this.totalCost.text());
        var totalPrice = quantity * parseInt(price);
        this.totalCost.text(this.currentPrice + totalPrice);
    },

    // updates the cart total on cart item quantity update
    updateCartTotalQty: function(quantityArray) {
        var updatedQty= quantityArray.reduce(function(a, b) {
            return a + b;
        });
        this.$('.items-total').text(updatedQty + ' Items');
    },

    checkout: function() {
        // grab all collection data
        // create json
        // send off

        // app.cartCollection.localStorage = new Backbone.LocalStorage('CartCollection');


        

        // console.log('hi', app.cartCollection)

        // console.log(localStorage.CartCollection)


        // app.cartCollection.toJSON();

        // app.app.cartCollectionStorage.fetch();

        // console.log(app.cartCollectionStorage)

        // var storage = app.cartCollectionStorage.findAll();
        // console.log(storage)
        // var ls = new Backbone.LocalStorage("CartCollection");
        


    }
});

app.cartNotifyView = new app.CartNotifyView({
    el: '#cart'
});
'use strict';

window.app = window.app || {};

app.ClassView = Backbone.View.extend({

    initialize: function() {
        this.render();
    },

    render: function() {
        this.collection.each(function(model) {
            this.renderSeminars(model);
        }, this);
    },

    renderSeminars: function(seminarModel) {
        this.$el.prepend(new app.SingleSeminarView({
            model: seminarModel
        }).render().el).hide().slideDown(500).fadeIn(700);
    }

});
'use strict';

window.app = window.app || {};

app.LocationView = Backbone.View.extend({
    tagName: 'div',
    className: 'one-location',

    events: {
        'click .location-icon': 'showClassLocationMsg'
    },

    template: _.template($('#locationTemplate').html()),

    initialize: function() {
        this.render();
    },

    render: function() {
    	var _this = this;
        this.collection.each(function(model) {
            var hasBeenRendered = model.get('hasBeenRendered');
            if(hasBeenRendered) {
                return false;
            } else { 
                _this.$el.append(_this.template(model.toJSON()));
                model.set('hasBeenRendered', true);
                _this.renderSchedules(model);
            }
        }, this);
    },

    renderSchedules: function(theModel) {
        var _this = this;
        var courseIdToGet = theModel.get('courseId');
        var cityIdToGet = theModel.get('cityId');
        var searchIdToGet = theModel.get('searchId');
        var elemToAppendSchedules = this.$el.find('.schedule-items-wrap');
        this.$el.prev().find('.location-loader').css('display', 'block');
        app.scheduleCollection.fetch({
            remove: false,
            data: JSON.stringify({
                "courseId": courseIdToGet,
                "cityId": cityIdToGet,
                "searchId": searchIdToGet
            }),
            type: "POST",
            contentType: "application/json",

            success: function() {
                _this.$el.prev().find('.location-loader').css('display', 'none');
                app.scheduleView = new app.ScheduleView({
                    collection: app.scheduleCollection,
                    el: elemToAppendSchedules
                });
            }
        });
    },

    showClassLocationMsg: function() {
        this.$el.find('.location-msg').toggleClass('showing');
    }
});
'use strict';

window.app = window.app || {};

app.ScheduleView = Backbone.View.extend({
    tagName: 'li',
    className: 'seminar',

    events: {
        'click .add-to-cart': function(e) {
            this.addToCart(e);
        }
    },

    template: _.template($('#scheduleTemplate').html()),

    initialize: function() {
        this.render();
    },

    render:function () {
        var _this = this;
        this.collection.each(function(singleClass) {
            var hasBeenRendered = singleClass.get('hasBeenRendered');
            if(hasBeenRendered) {
                return false;
            } else {
                _this.$el.append(_this.template(singleClass.toJSON()));
                singleClass.set('hasBeenRendered', true);
            }
        }, this);
    },


    // this just creates the data model and adds it to the collection
    addToCart: function(e) {
        e.preventDefault();
        var target = $(e.currentTarget);
        var _this = this;
        this.$classQty = target.parent().prev().find('.class-qty');
        if(this.$classQty.val() == '') {
            target.parent().prev().find('.attendee-msg').addClass('showing');
            this.$classQty.css('border-color', 'red');
            this.$el.find('.btn-blue-hollow:focus').blur();
            setTimeout(function() {
                target.parent().prev().find('.attendee-msg').removeClass('showing');
                _this.$classQty.css('border-color', '#d7d7d7');
            }, 3000);
            return false;
        } else {
            this.$el.find('.btn-blue-hollow:focus').blur();

            var id = target.data('id'),
                modelData = this.collection.get(id),
                courseIdNum = modelData.get('courseId'),
                price = modelData.get('price'),
                classDate = modelData.get('date'),
                thequantity = parseInt(this.$classQty.val()),
                inCart = modelData.get('inCart'),
                theId = modelData.get('id');

                modelData.set('quant', thequantity);
                modelData.set('theId', theId);

                var modelQty = modelData.get('quant');


            if(!inCart) {
                modelData.set('inCart', true);
                
                // get the class title
                var relatedClassModel = app.globalCollection.findWhere({
                    seminarId: courseIdNum 
                });

                // get the cityState
                var relatedLocationModel = app.locationCollection.findWhere({
                    courseId: courseIdNum
                });

                var titleOfClass = relatedClassModel.get('title');
                var cityOfClass = relatedLocationModel.get('cityState');

                var loadedFromLocalStore = [],
                    isItemInCollection = false,
                    inputQuantity = this.$('.qty').val(),
                    uniqueIdentifierOfModelAdded = theId;

                // loop through the localstorage collection and add our unique identifier to the array
                app.cartCollection.each(function(cartItemModel) {
                    console.log(cartItemModel.get('theId'))
                    loadedFromLocalStore.push(cartItemModel.get('theId'));
                });

                // loop through array of unique identifiers, compare to identifier of model we are adding
                // if it exists, set our 'isItemInCollection' var to true.
                for(var i = 0; i < loadedFromLocalStore.length; i++) {
                    if(uniqueIdentifierOfModelAdded == loadedFromLocalStore[i]) {
                        console.log('yep');
                        isItemInCollection = true;
                    }
                }

                // if item is not in collection
                if(!isItemInCollection) {

                    // create a new model
                    app.cartItemModel = new app.CartItemModel({
                        title: titleOfClass,
                        city: cityOfClass,
                        date: classDate,
                        quantity: thequantity,
                        theId: theId,
                        price: modelData.get('price')
                    });

                    // this.cartItemModel.set('quantity', thequantity);

                    // attach our 'add' listener
                    this.listenTo(app.cartCollection, 'add', this.renderCartItem);

                    // adding to collection
                    // app.cartCollection.add(this.cartItemModel);
                    
                    // saving it to localstorage
                    app.cartCollection.create(app.cartItemModel.toJSON());

                    if(!$('.cart-visible').hasClass('down')) {
                        $('.cart-tab').trigger('click');
                    }

                    // clear input field
                    this.$classQty.val('');

                    // remove listener
                    this.stopListening();


                } else {
                    console.log('update quantity here');
                    console.log(app.cartItemModel, modelData)
                    return false;
                }
            } else {
                console.log('in cart update qty here')
                app.cartItemModel.set('quantity', modelQty);
                modelData.set('quant', modelQty);
            }
        }
    },

    // creates our new view, adds to cart by calling render in the cartItemView
    renderCartItem: function(cartItem) {
        var itemQuantity = cartItem.get('quantity');
        var itemPrice = cartItem.get('price');
        app.cartItemView = new app.CartItemView({
            model: cartItem,
            quantity: itemQuantity,
            price: itemPrice
        }).render();

        this.addQtyToCart(itemQuantity, cartItem);
        Backbone.trigger('calculateSubtotal', itemQuantity);
    },

    updateQuantity: function(qty) {
        console.log('hi')
        this.$classQty.val('');
        
        console.log(this.$el)
    },

    // total number of cart items in cart view (input fields)
    addQtyToCart: function(theQuantity, cartItem) {
        // cartItem.set('qty', theQuantity);
        // this.$classQty.val(theQuantity)
        // console.log(this.model)
        // this.listenTo(this.cartItemModel, 'change:quantity', this.updateQuantity);
        var oldVal = $('.items-total').text();
        // console.log(theQuantity) // good
        // console.log(this.$el) // div.schedule-items-wrap
        // console.log('==============')
        // this.quantity = theQuantity;
        var newNum = parseInt(oldVal) + parseInt(theQuantity);
        $('.items-total').text(newNum + ' Items');
        // this.model.set('quantity', this.quantity);
        // Backbone.trigger('updateCartTotalPrice', itemQuantity);
    }

});
'use strict';

window.app = window.app || {};

app.SingleSeminarView = Backbone.View.extend({
    tagName: 'li',
    className: 'seminar-item col-xs-12',

    events: {
        'click .view-opts': 'showClassOptions'
    },

    template: _.template($('#classTemplate').html()),

    initialize: function() {

    },

    render: function() {
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    },

    showClassOptions: function(e) {
        e.preventDefault();
        var _this = this;
        var open = this.model.get('open');
        var schedulesLoaded = this.model.get('schedulesLoaded');
        var $schedItemWrap = this.$('.schedule-item-wrap');

        var viewText = $(e.target);

        if(open) {
            // if it's open, close it
            $schedItemWrap.slideUp(400, function() {
                viewText.removeClass('red').html('<span class="plus">+</span>View Upcoming Seminars');
            });
            this.model.set('open', false);
            this.$el.css('padding-bottom', 25 + 'px');
        } else {
            // open it
            $schedItemWrap.slideDown(400, function() {
                viewText.addClass('red').html('<span class="plus turn">+</span>View Less');
            });
            this.model.set('open', true);   
            this.$el.css('padding-bottom', 0);
        }

        // styling
        $schedItemWrap.css({
            "margin-top": 30 + 'px',
            "border-top": '1px solid #D7D7D7'
        });

        if(!schedulesLoaded) {
            var seminarIdToGet = this.model.get('seminarId');
            var searchIdToGet = this.model.get('searchId');
            var elemToRender = $($(e.currentTarget).parent().parent().parent().next('.schedule-item-wrap'));
            app.locationCollection.fetch({
                remove: false,
                data: JSON.stringify({
                    "courseId": seminarIdToGet,
                    "searchId": searchIdToGet
                }),
                type: "POST",
                contentType: "application/json",

                success: function(data) {
                    // $('.location-loader').css('display', 'none');
                    app.locationView = new app.LocationView({
                        collection: app.locationCollection,
                        el: elemToRender
                    });
                    // this.model = seminar
                    _this.model.set('open', true);
                    _this.model.set('schedulesLoaded', true);
                }
            });
        } else {
            return false;
        }
    },

    // on update of quantity in cart item, sends back to class list
    updateOriginalModelQuantity: function(updatedQuantity) {
        this.model.set('quantity', updatedQuantity);
        this.$('.qty').val(updatedQuantity);
        Backbone.off('updateOriginalModelQuantity');
    },

    showTotalPrice: function(e) {
        e.preventDefault();
        var price = this.model.get('price');
        Backbone.trigger('displayTotalPrice', this.quantity, price);
    }

});

app.singleSeminarView = new app.SingleSeminarView();
'use strict';

function Catalog() {
	this.$category = $('.class-category');
	this.$page = $('html, body');

	// the electrical sort item menu
	this.$categorySelect = $('.elec-sort-category');

	// items to hide/show
	this.$sortItem = $('.electric .seminar-topic');

	this.clickScrollTo();
	this.sortElectricItems();
}

Catalog.prototype.clickScrollTo = function() {
	var _this = this;
	var offsetAmount = 40;
	this.$category.on('click', function(e) {
		e.preventDefault();
		_this.$page.animate({
            scrollTop: $($.attr(this, 'href')).offset().top - offsetAmount
        }, 300);
	});
};

Catalog.prototype.sortElectricItems = function() {
	var _this = this;
	this.$categorySelect.on('click', function(e) {
		e.preventDefault();
		_this.$categorySelect.parent().removeClass('current');
		var $target = $(e.target);
		var filterVal = $(this).data('category');
		if(filterVal == 'all') {
			_this.$sortItem.fadeIn('fast').css('display', 'inline-block');
			$target.parent().addClass('current');
		} else {
			_this.$sortItem.each(function() {
				if($(this).data('type') !== filterVal) {
					$(this).fadeOut('fast');
				} else {
					$(this).fadeIn('fast').css('display', 'inline-block');
					$target.parent().addClass('current');
				}
			});
		}
	});
};
'use strict';

function CountUp($win) {
	this.$win = $win;
	this.$numbers = $('.number-callout').find('h3');
	this.endValuesArr = [];
	this.triggered = false;
	this.$counterStartMarker = $('#js-counter-start');

	this.getMaxVal();
	this.resetVals();
}

CountUp.prototype.getMaxVal = function() {
	var _this = this;

	// loop through numbers on screen
	$('.number-callout').find('h3').each(function(index) {

		// grab the value, strip non-numeric chars
		var number = parseInt($(this).html().replace(/\D/g,''));

		// push values into array
		_this.endValuesArr.push(number);
	});
};

CountUp.prototype.resetVals = function() {

	// reset values to zero on load
	this.$numbers[0].innerHTML = 0 + '%';
	this.$numbers[1].innerHTML = 0 + 'k';
	this.$numbers[2].innerHTML = 0;
};

CountUp.prototype.startCounter = function() {
	var _this = this;

	// number of times to run the interval
	var maxInt = this.endValuesArr.length;
	var indx = 0;
	var startNum = 0;
	var numOfCalls = 0;
	var inter;


	function increase() {

		// number to count up to, grabbed from array
		var max = _this.endValuesArr[indx];

		// increase starting number each time through
		startNum++;

		// if it's the first one, add % to the end
		if(indx === 0) {
			_this.$numbers[indx].innerHTML = startNum + '%';
		} else if (indx === 2) {

			// if it's the third one, add 'k' to the end
			_this.$numbers[indx].innerHTML = startNum + 'k';
		} else {
			_this.$numbers[indx].innerHTML = startNum;
		}
		
		// if the counter = max num to count to
		if(startNum === max) {
			
			// increase index counter
			indx++;

			// "increase times we've called this fn" counter
			numOfCalls++;

			// reset starting number to zero
			startNum = 0;

			// and clear the interval
			clearInterval(inter);

			// but if we haven't modified each dom number element, restart interval
			if(indx <= maxInt) {
				inter = setInterval(increase, 6);
			}
		} 

		// if we've run the interval once per dom element, stop.
		if(numOfCalls == 3) {
			window.clearInterval(inter);
		}
	}
	
	// set it off.
	inter = setInterval(increase, 6);

};

CountUp.prototype.handleWindowScroll = function(currentScrollTop) {
	var _this = this;

	// the scroll top of the window, from the TPCApp.js file
	this.currentScrollTop = currentScrollTop;

	// if the headline is scrolled up out of view, set a variable to true
	if(this.$counterStartMarker.offset().top.toFixed(0) <= this.currentScrollTop) {
		_this.triggered = true;
	} 

	// if the headline is out of view, start the counter
	if(_this.triggered) {
		 this.startCounter();

		 // then unbind the scroll so it only runs once.
		 this.$win.off('scroll');
	}
}

'use strict';

// the site for the plugin used: http://ghusse.github.io/jQRangeSlider/index.html

function DatePicker() {

	// date, month, year vars
	this.date = new Date();
	this.month = this.date.getMonth() + 1;
	this.year = this.date.getFullYear();

	var _this = this;

	// where the red buttons should start
	var selectorStartDate = this.getStartDate(this.year, this.month);
	var selectorEndDate = this.getEndDate(this.year, this.month);

	// the last month showing on the date range, a total of 13 months after current month
	var rangeEndDate = selectorEndDate[1] + 9;

	// range selector start month
	this.startMonth = selectorStartDate[1];
	
	// range selector end month
	this.endMonth = selectorEndDate[1];

	// insert the next year under january
	var nextYearNumber = [this.year];

	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

	if($(window).width()<= 700) {
		var months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
	}

  	$('#date-range-slider').dateRangeSlider({

  		// bounds: the months in the range
    	bounds: {min: new Date(selectorStartDate), max: new Date(nextYearNumber, rangeEndDate)},

    	step: {
    		months: 1
    	},

    	valueLabels: 'hide',

    	// defaultValues: where the slider starts
    	defaultValues: {min: new Date(selectorStartDate), max: new Date(selectorEndDate)},
    	scales: [{
      		first: function(value){ 
      			return value; 
      		},

      		end: function(value) {
      			return value; 
      		},

      		next: function(value) {
        		var next = new Date(value);
        		return new Date(next.setMonth(value.getMonth() + 1));
	      	},

	      	label: function(value){

	      		// display year under january.
	      		var firstMonth = months[value.getMonth()];

	      		if(firstMonth === 'Jan' && $(window).width() >= 701) {
	      			return firstMonth + ' ' + value.getFullYear();
	      		}

	        	return months[value.getMonth()];
	      	},

	      	format: function(tickContainer, tickStart, tickEnd){
	        	tickContainer.addClass('month-label');
	        	var tickMonth = tickStart.getMonth();

	        	// add class to January because we display year too.
	        	var jan = months[tickMonth];
	        	if(jan === 'Jan') {
	        		tickContainer.addClass('first');
	        	}
	      	}
	    }]
	});

	if($(window).width() >= 700) {
		this.addYearLabel();
	}

	this.valuesChanged(this.startMonth, this.endMonth);

	// this.sendToSearch();
	setTimeout(function() {
		_this.fixWidth();
		if($(window).width() >= 700) {
			_this.sizeHandle();
		}
	}, 10);
}

DatePicker.prototype.addYearLabel = function() {
	$('.first').css({
		'line-height': 1.27,
		'marginTop': -7 + 'px',
		'position': 'relative',
		'top': 8 + 'px',
		'height': 42 + 'px'
	})
	.find('.ui-ruler-tick-label').css({
		display: 'inline-block',
		width: 84 + '%'
	});
};

DatePicker.prototype.sizeHandle = function() {
	var monthWidth = $($('.ui-ruler-tick-inner')[0]).outerWidth();
	$('.ui-rangeSlider-handle').css('width', monthWidth + 'px');
};

DatePicker.prototype.valuesChanged = function(startMonth, endMonth) {
	var rHandle = $('.ui-rangeSlider-rightHandle');
	var lHandle = $('.ui-rangeSlider-leftHandle');

	var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];

	// set initial values, dynamic based on date
	rHandle.text(months[endMonth - 2]);
	lHandle.text(months[startMonth - 1]);

	$('#date-range-slider').on("valuesChanged", function(e, data){
		var minMonth = new Date(data.values.min);
		var maxMonth = new Date(data.values.max);
		maxMonth.setDate(maxMonth.getDate() - 1);
		minMonth.setDate(maxMonth.getDate() - 1);
		var maxMonthAbbr = months[maxMonth.getMonth()];
		var minMonthAbbr = months[minMonth.getMonth()];
	  	rHandle.text(maxMonthAbbr);
	  	lHandle.text(minMonthAbbr);
	});
};

DatePicker.prototype.sendToSearch = function() {
	// document.getElementById('search-btn').addEventListener('click', function() {
	// 	var dateValues = $('#date-range-slider').dateRangeSlider("values");
	// 	var minDate = new Date(dateValues.min);
	// 	var minMonth = minDate.getMonth() + 1;
	// 	var minYear = minDate.getFullYear();
	// 	var minMonthYear = {
	// 		minMonthVal: minMonth,
	// 		minYearVal: minYear
	// 	};

	// 	var maxDate = new Date(dateValues.max);
	// 	var maxMonth = maxDate.getMonth() + 1;
	// 	var maxYear = maxDate.getFullYear();
	// 	var maxMonthYear = {
	// 		maxMonthVal: maxMonth,
	// 		maxYearVal: maxYear
	// 	};

	// 	var dataToSend = [minMonthYear, maxMonthYear];
	// });
};

DatePicker.prototype.fixWidth = function() {
	var containerWidth = $('.ui-rangeSlider-container').width();
	$('.ui-rangeSlider-innerBar').css('width', containerWidth + 'px');

};

DatePicker.prototype.getStartDate = function(year, month) {
	var startDate = [year, month];
	return startDate;
};

DatePicker.prototype.getEndDate = function(year, month) {
	this.monthEndRange = month + 4;
	this.year = year;
	if(this.monthEndRange > 12) {
		var difference = this.monthEndRange - 12;
		this.monthEndRange = difference;
		this.year = this.year + 1;
		var endDate = [this.year, this.monthEndRange];
	} else {
		var endDate = [this.year, this.monthEndRange];
	}
	return endDate;
};
'use strict';

function HomePage() {
	this.$overlay = $('.topic-circles .overlay-contain');

	this.showActiveSelection();
}

HomePage.prototype.showActiveSelection = function() {
	this.$overlay.on('click', function() { 
	    var $this = $(this);
	    if($this.hasClass('chosen')) {
	    	$this.removeClass('chosen');
	    }
	 	else {
	 		$this.addClass('chosen');
	 	}
	});
};
'use strict';

window.app = window.app || {};

function MainSearchSelect() {

	var _this = this;

	$('#main-search').select2({
		// data:sampleArray,
		tags: true,	
		selectOnBlur: true,
		maximumSelectionLength: 1,
		dropdownAutoWidth: true,
		// tokenSeparators: [",", " "],

		placeholder: function() {
			$(this).data('placeholder');
		}
	});

	this.autofillLocation();
};

MainSearchSelect.prototype.getSearchParams = function() {
	var topicsArray = [];

	// get the city or zip
	var searchLocationVal = $('#main-search').select2('val');

	// if empty, show message
	if(searchLocationVal == null) {
		$('.empty-location-msg').fadeIn(150).delay(200).fadeTo(150,0.5).delay(150).fadeTo(150,1).delay(200).fadeTo(150,0.5).delay(150).fadeTo(150,1).delay(200).fadeTo(150,0.5).delay(150).fadeTo(150,1);
		return false;
	} else {
		var location = $('#main-search').select2('val').toString();
		$('.empty-location-msg').fadeOut(150);
		
		// get the selected class topic
		$('.chosen').each(function() {
			var selectedTopic = $(this).data('topic');
			if(selectedTopic === 'all') {
				topicsArray.push("electrical", "management", "hvac", "mechanical");
			} else {
				topicsArray.push(selectedTopic);
			}
		});

		if(topicsArray.length == 0) {
			topicsArray.push("electrical", "management", "hvac", "mechanical");
		}

		// get the date range
		var dateValues = $('#date-range-slider').dateRangeSlider("values");
		var minDate = new Date(dateValues.min);
		var minMonth = minDate.getMonth() + 1;
		var minYear = minDate.getFullYear();
		var minMonthYear = {
			minMonthVal: minMonth,
			minYearVal: minYear
		};

		var maxDate = new Date(dateValues.max);
		var maxMonth = maxDate.getMonth() + 1;
		var maxYear = maxDate.getFullYear();
		var maxMonthYear = {
			maxMonthVal: maxMonth,
			maxYearVal: maxYear
		};

		var selectedDates = {
			min: minMonthYear,
			max: maxMonthYear
		};

		var searchResults = {
			location: location,
			classTopics: topicsArray,
			dates: selectedDates
		};

		app.resStringified = JSON.stringify(searchResults);
		return app.resStringified;
	}
};

MainSearchSelect.prototype.autofillLocation = function() {
	var visitorLocation = $('#main-search').data('location');
	if(visitorLocation == 'undefiend' || visitorLocation == '') {
		return false;
	} else {
		$('#main-search').prepend('<option value="'+ visitorLocation +'" selected>'+ visitorLocation +'</option>').trigger('change');
	}
};
'use strict';

function OnSiteForm() {
	this.showPromoField();
}

OnSiteForm.prototype.showPromoField = function() {
	var hearSelect = document.getElementById('hear');
	var promoField = document.querySelectorAll('.promo-wrap');
	hearSelect.addEventListener('change', function() {
		var selectedOpt = this.options[this.selectedIndex].text;
		if(selectedOpt === 'Direct Mail' || selectedOpt === 'Print Ad' || selectedOpt === 'Email') {
			$(promoField).slideDown().addClass('showing');
		} else {
			if($(promoField).hasClass('showing')) {
				$(promoField).slideUp();	
			} else {
				$(promoField).css('display', 'none');
			}
		}
	});
};
'use strict';

function Register() {

	if($('#supervisor-diff').length) {
		this.$differentInfo = $('#supervisor-diff');
	}

	if($('#mail-checkbox').length) {
		this.$differentInfo = $('#mail-checkbox');
	}

	this.$differentInfoFields = $('.hidden-different-check');
	this.$billingInfoText = $('.billing-info-desc');
	this.$billingOptsSelect = $('#billing-opts');
	this.$ccInfo = $('.cc-info');
	this.$nextBtn = $('.next-btn');
	this.$cvv = $('#cvv');

	this.$nextBtn.bind('click', false);

	this.showOtherInfo();
	this.billingOptions();
}

Register.prototype.showOtherInfo = function() {
	var _this = this;
	this.$differentInfo.on('change', function() {
		if($(this).is(':checked')) {
			_this.$differentInfoFields.slideDown('fast');
			_this.$billingInfoText.addClass('hidden');

		} else {
			_this.$differentInfoFields.slideUp('fast');
			_this.$billingInfoText.removeClass('hidden');
		}
	});
};

Register.prototype.billingOptions = function() {
	var _this = this;

	// disable next button
	_this.$nextBtn.unbind('click', false).addClass('disabled');

	this.$billingOptsSelect.on('change', function() {
		var selectedOption = $('#billing-opts').val();
		if(selectedOption === 'credit') {

			// disable next button
			_this.$nextBtn.unbind('click', false).addClass('disabled');
			_this.$ccInfo.slideDown('fast');
			_this.$billingInfoText.addClass('hidden');

			_this.$cvv.on('change', function() {
				if(!_this.$cvv.val()) {

					// disable next button if cvv empty
					_this.$nextBtn.unbind('click', false).addClass('disabled');
				} else {
					// enable next button if cvv has value
					_this.$nextBtn.bind('click', false).removeClass('disabled');
				}
			});

		} else {
			// enable next button if invoice is chosen
			_this.$nextBtn.unbind('click', false);
			_this.$ccInfo.slideUp('fast');
			_this.$billingInfoText.removeClass('hidden');
			_this.$nextBtn.bind('click', false).removeClass('disabled');
		}
	});


	// show/hide cvv text info
	$('.cvv-text').on('click', function() {
		$(this).find('span').toggleClass('showing');
	});
};
'use strict';

window.app = window.app || {};

function TPCApp() {
	var _this = this;
	this.$win = $(window);

	$('.carousel').carousel();

	if($('.catalog-top').length) {
		this.catalog = new Catalog();
	}
	
	this.homePage = new HomePage();

	if($('#main-search').length) {
		app.mainSearchSelect = new MainSearchSelect();
	}

	if($('#date-range-slider').length) {
		this.datePicker = new DatePicker();
	}

	if($('#count').length) {
		this.countUp = new CountUp(this.$win);
	}

	// share popover init
	if($('.share-btn-wrap').length) {
		$('[data-toggle="popover"]').popover({
			animation: true,
			// container: '.btn-share',
			trigger: 'click',
			html: true
		});
	}

	if($('.caro-form-container').length || $('.register-two').length) {
		this.onSiteForm = new OnSiteForm();
	}

	// register
	if($('.register-two').length || $('.contact').length) {
		this.register = new Register();
	}

	this.bindScroll();

	// CHECK IF USER IS ON A RETINA DEVICE
	var isRetina = false;
	var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
	        (min--moz-device-pixel-ratio: 1.5),\
	        (-o-min-device-pixel-ratio: 3/2),\
	        (min-resolution: 1.5dppx)";
	if (window.devicePixelRatio > 1) {
	    isRetina = true;
	}
	if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
	    isRetina = true;
	}

	this.animateCart(isRetina);
}

TPCApp.prototype.bindScroll = function() {
	var _this = this;
	this.$win.on('scroll', function() {
		_this.handleWindowScroll();
	});
};

TPCApp.prototype.handleWindowScroll = function() {
	this.currentScrollTop = this.$win.scrollTop();

	// only run this on certain pages.
	if($('#count').length) {
		this.countUp.handleWindowScroll(this.currentScrollTop);
	}
};

// this should go in the Backbone app eventually
TPCApp.prototype.animateCart = function(retinaScreen) {
	// if(Modernizr.csstransitions) {
	var _this = this;
	this.$carttab = $('.cart-tab');
	this.$cartvis = $('.cart-visible');
	this.$cartTopImg = $('.cart-top').find('img');
	if(retinaScreen) {
		this.$carttab.find('img').attr('src', '/assets/images/icon-cart-retina.png').css({
			width: 32 + 'px',
			top: -15 + 'px'
		});
	}

	this.$carttab.on('click', function() {
		$('.cart').slideToggle(300, function() {
			$(this).toggleClass('down');

			// change out cart icon, and if user is on retina, account for that.
			if(retinaScreen) {
				_this.$cartvis.toggleClass('down').find('img').attr('src', '/assets/images/icon-cart-close-arrow-2x.png');
				_this.$cartTopImg.attr('src', '/assets/images/icon-cart-retina.png').css({
					width: 32 + 'px'
				});
				if(!$(this).hasClass('down')) {
					_this.$carttab.find('img').attr('src', '/assets/images/icon-cart-retina.png');
				}
			} else {
				_this.$cartvis.toggleClass('down').find('img').attr('src', '/assets/images/icon-cart-close-arrow.png');
				if(!$(this).hasClass('down')) {
					_this.$cartTopImg.attr('src', '/assets/images/icon-cart-tab.png');
					_this.$carttab.find('img').attr('src', '/assets/images/icon-cart-tab.png');
				}
			}
		});
	});
};