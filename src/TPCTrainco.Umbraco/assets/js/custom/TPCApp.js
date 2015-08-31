'use strict';

window.app = window.app || {};

var ApiDomain = 'http://trainco-dev.imulus-client.com'

function TPCApp() {
	var _this = this;
	this.$win = $(window);
	this.$aHref = $('a[href^=#]');
	this.$page = $('html, body');

	$('.carousel').carousel();

	if ($('.catalog-top').length) {
		this.catalog = new Catalog();
	}

	this.homePage = new HomePage();

	if ($('#main-search').length) {
		if (app.mainSearchSelect == undefined)
			app.mainSearchSelect = new MainSearchSelect();
	}

	if ($('#date-range-slider').length) {
		this.datePicker = new DatePicker();
	}

	if ($('#count').length) {
		this.countUp = new CountUp(this.$win);
	}

	// share popover init
	if ($('.share-btn-wrap').length) {
		$('[data-toggle="popover"]').popover({
			animation: true,
			// container: '.btn-share',
			trigger: 'click',
			html: true
		});
	}

	if ($('.caro-form-container').length || $('.register-two').length) {
		this.onSiteForm = new OnSiteForm();
	}

	// register
	if ($('.register-two').length || $('.contact').length) {
		this.register = new Register();
	}

	// checkout
	if ($('.register-top').length) {
		this.Checkout = new Checkout();
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
	this.retinaLogos(isRetina);
	this.clickScrollTo();




	if (window.location.hash || $('.detail-page-app').length) {
		if (app.mainSearchSelect == undefined)
			app.mainSearchSelect = new MainSearchSelect();

		var searchParams;
		if (window.location.hash) {
			searchParams = app.mainSearchSelect.getHashSearchParams();
		}
		else {
			searchParams = app.mainSearchSelect.getSearchParams();
		}

		performSearch(searchParams);
	}


	// array indexOf polyfill for IE8
	// Production steps of ECMA-262, Edition 5, 15.4.4.14
	// Reference: http://es5.github.io/#x15.4.4.14
	if (!Array.prototype.indexOf) {
	  Array.prototype.indexOf = function(searchElement, fromIndex) {

	    var k;

	    // 1. Let O be the result of calling ToObject passing
	    //    the this value as the argument.
	    if (this == null) {
	      throw new TypeError('"this" is null or not defined');
	    }

	    var O = Object(this);

	    // 2. Let lenValue be the result of calling the Get
	    //    internal method of O with the argument "length".
	    // 3. Let len be ToUint32(lenValue).
	    var len = O.length >>> 0;

	    // 4. If len is 0, return -1.
	    if (len === 0) {
	      return -1;
	    }

	    // 5. If argument fromIndex was passed let n be
	    //    ToInteger(fromIndex); else let n be 0.
	    var n = +fromIndex || 0;

	    if (Math.abs(n) === Infinity) {
	      n = 0;
	    }

	    // 6. If n >= len, return -1.
	    if (n >= len) {
	      return -1;
	    }

	    // 7. If n >= 0, then Let k be n.
	    // 8. Else, n<0, Let k be len - abs(n).
	    //    If k is less than 0, then let k be 0.
	    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

	    // 9. Repeat, while k < len
	    while (k < len) {
	      // a. Let Pk be ToString(k).
	      //   This is implicit for LHS operands of the in operator
	      // b. Let kPresent be the result of calling the
	      //    HasProperty internal method of O with argument Pk.
	      //   This step can be combined with c
	      // c. If kPresent is true, then
	      //    i.  Let elementK be the result of calling the Get
	      //        internal method of O with the argument ToString(k).
	      //   ii.  Let same be the result of applying the
	      //        Strict Equality Comparison Algorithm to
	      //        searchElement and elementK.
	      //  iii.  If same is true, return k.
	      if (k in O && O[k] === searchElement) {
	        return k;
	      }
	      k++;
	    }
	    return -1;
	  };
	}

}

TPCApp.prototype.bindScroll = function () {
	var _this = this;
	this.$win.on('scroll', function () {
		_this.handleWindowScroll();
	});
};

TPCApp.prototype.handleWindowScroll = function () {
	this.currentScrollTop = this.$win.scrollTop();

	// only run this on certain pages.
	if ($('#count').length) {
		this.countUp.handleWindowScroll(this.currentScrollTop);
	}
};

// cart functionality
TPCApp.prototype.animateCart = function (retinaScreen) {
	// if(Modernizr.csstransitions) {
	var _this = this;
	this.$carttab = $('.cart-tab');
	this.$cartvis = $('.cart-visible');
	this.$cartTopImg = $('.cart-top').find('img');
	if (retinaScreen) {
		this.$carttab.find('img').attr('src', '/assets/images/icon-cart-retina.png').css({
			width: 32 + 'px',
			top: -15 + 'px'
		});
	}

	this.$carttab.on('click', function () {
		$('.cart').slideToggle(300, function () {
			$(this).toggleClass('down');

			// change out cart icon, and if user is on retina, account for that.
			if (retinaScreen) {
				_this.$cartvis.toggleClass('down').find('img').attr('src', '/assets/images/icon-cart-close-arrow-2x.png');
				_this.$cartTopImg.attr('src', '/assets/images/icon-cart-retina.png').css({
					width: 32 + 'px'
				});
				if (!$(this).hasClass('down')) {
					_this.$carttab.find('img').attr('src', '/assets/images/icon-cart-retina.png');
				}
			} else {
				_this.$cartvis.toggleClass('down').find('img').attr('src', '/assets/images/icon-cart-close-arrow.png');
				if (!$(this).hasClass('down')) {
					_this.$cartTopImg.attr('src', '/assets/images/icon-cart-tab.png');
					_this.$carttab.find('img').attr('src', '/assets/images/icon-cart-tab.png');
				}
			}
		});
	});
};

TPCApp.prototype.clickScrollTo = function () {
	var _this = this;
	var offsetAmount = 140;
	this.$aHref.on('click', function (e) {
		e.preventDefault();
		_this.$page.animate({
			scrollTop: $($.attr(this, 'href')).offset().top - offsetAmount
		}, 300);
	});
};

TPCApp.prototype.retinaLogos = function(retinaScreen) {
	if(retinaScreen) {
		$('#logo').attr('src', '/assets/images/logo-trainco-2x.png').css('width', 266 + 'px');
	} else {
		$('#logo').attr('src', '/assets/images/logo-trainco-1x.png');
	}
};