'use strict';

window.app = window.app || {};
// var ApiDomain = 'http://trainco-dev.imulus-client.com';
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
		// if (app.mainSearchSelect == undefined)
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

	// if ($('.caro-form-container').length) {
	// 	this.onSiteForm = new OnSiteForm();
	// }

	// register
	if ($('.contact').length) {
		this.register = new Register();
	}

	// checkout
	if ($('.register-top').length) {
		this.Checkout = new Checkout();

		$('#reg-submit').on('click', function (e) {
			e.preventDefault();

			var formData = CreateFormPostString();

			CheckoutPost(formData);
		});
	}

	if ($('.register-two').length) {
		this.CheckoutCustomer = new CheckoutCustomer();
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


	// empty the cart on the success page
    if($('.success').length) {
		app.cartNotifyView.clearCart();
    }

    // change body bg color on search page
    if($('#search-results').length) {
    	$('body').css('background-color', '#F9F9F9 !important');
    }

    if($('.form-standard').length) {
    	this.addClassToFormBtn();
    }

    // if we are coming from a home page search, scroll down a bit on the next page
    if(window.location.search == "?homeref=1") {
    	_this.scrollToResults();
    }

    // if IE, trigger click to get rid of select2 "you can only select one" message
    // if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) {
    //    $('.select2-search--inline').trigger('click');
    // }
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
		this.$carttab.find('img').attr('src', '/images/icon-cart-retina.png').css({
			width: 32 + 'px',
			top: -15 + 'px'
		});
	}

	this.$carttab.on('click', function () {
		$('.cart').slideToggle(300, function () {
			$(this).toggleClass('down');

			// change out cart icon, and if user is on retina, account for that.
			if (retinaScreen) {
				_this.$cartvis.toggleClass('down').find('img').attr('src', '/images/icon-cart-close-arrow-2x.png');
				_this.$cartTopImg.attr('src', '/images/icon-cart-retina.png').css({
					width: 32 + 'px'
				});
				if (!$(this).hasClass('down')) {
					_this.$carttab.find('img').attr('src', '/images/icon-cart-retina.png');
				}
			} else {
				_this.$cartvis.toggleClass('down').find('img').attr('src', '/images/icon-cart-close-arrow.png');
				if (!$(this).hasClass('down')) {
					_this.$cartTopImg.attr('src', '/images/icon-cart-tab.png');
					_this.$carttab.find('img').attr('src', '/images/icon-cart-tab.png');
				}
			}
		});
	});
};

TPCApp.prototype.clickScrollTo = function () {
	var _this = this;
	var offsetAmount = 140;

	// click scroll to and jump to different page
	var jump = function(e) {
	  	if (e) {
	       e.preventDefault();
	       var target = $($.attr(this, 'href'));
	   	} else {
	       var target = location.hash;
	   	}

	  	_this.$page.animate({
	    	scrollTop: $(target).offset().top - offsetAmount
	   	}, 300 ,function() {
	       	location.hash = target;
	   	});
	}

	if (location.hash){
	    setTimeout(function(){
	        _this.$page.scrollTop(0);
	        jump();
	    }, 0);
	}

	this.$aHref.on('click', jump);
};

TPCApp.prototype.retinaLogos = function(retinaScreen) {
	if(retinaScreen) {
		$('#logo').attr('src', '/images/logo-trainco-2x.png').css('width', 220 + 'px');
	} else {
		$('#logo').attr('src', '/images/logo-trainco-1x.png');
	}
};

TPCApp.prototype.addClassToFormBtn = function() {
	$('.form-standard').find('.btn').addClass('btn-reg').addClass('btn-blue-solid');
};

// if you do a search from the home page, scroll down on the next page.
TPCApp.prototype.scrollToResults = function() {
	var _this = this;
	setTimeout(function() {
		_this.$page.animate({
			scrollTop: $('#search-btn').offset().top - 80
		}, 300);
	}, 500);
};
