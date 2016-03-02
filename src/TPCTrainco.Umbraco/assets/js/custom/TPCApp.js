'use strict';

window.app = window.app || {};
var ApiDomain = 'http://trainco-dev.imulus-client.com';
function TPCApp() {
	var _this = this;
	this.$win = $(window);
	this.$aHref = $('a[href*=#]').not('.elec-sort-category');
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
		this.countUp = new CountUp();
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

	// umbraco forms
	if($('.form-standard').length) {
		this.formStyles = new FormStyles();
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

	if ($('.register-two').length || $('.summary-top').length) {
		this.CheckoutCustomer = new CheckoutCustomer();
	}

	if(Modernizr.touch) {
		document.body.addEventListener('touchstart',function(){},false);
	}

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

//	this.clickScrollTo();

	var hash = window.location.hash;

	// if one clicks "browse courses", go to that page and scroll to hash
	if($('.course-section').length || $('.onsite').length && hash) {
		_this.$page.animate({
			scrollTop: $(hash).offset().top - 140
		}, 300);
	}

	if (hash || $('.detail-page-app').length) {
		if(hash != '#cf-container') {
			// this is all the search stuff.
			if (app.mainSearchSelect == undefined) {
				app.mainSearchSelect = new MainSearchSelect();
			}

			var searchParams;
			if (hash) {
				searchParams = app.mainSearchSelect.getHashSearchParams();
			} else {
				searchParams = app.mainSearchSelect.getSearchParams();
			}

			if(hash) {
				$('.detail-page-app').slideDown();
				performSearch(searchParams);
			} else {
				$('.empty-location-msg').hide();
			}

			if(!$('.results').children().length) {
				$('.empty-message').show();
			}
		}
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
    // if(window.location.search == "?homeref=1") {
    // 	_this.scrollToResults();
    // }

    this.$win.on('resize', function(){
        _this.handleWindowResize();
    });

    if(window.location.pathname == '/search-seminars/' || window.location.pathname == '/search-seminars') {
    	this.grayBgBody();
    }

    // ie8 + ie9 placeholders
    if($('body').hasClass('ie8') || $('body').hasClass('ie9')) {
    	this.iePlaceholders();
    }

}

TPCApp.prototype.handleWindowResize = function() {
	if ($('#date-range-slider').length) {
		this.datePicker = new DatePicker();
	}
};

//
// TPCApp.prototype.clickScrollTo = function () {
// 	var _this = this;
// 	var offsetAmount = 140;
// 	this.$aHref.on('click', function (e) {
// 		if ($(this).attr('href')[0] === '#') {
// 			e.preventDefault();
// 			_this.$page.animate({
// 				scrollTop: $($.attr(this, 'href')).offset().top - offsetAmount
// 			}, 300);
// 		}
// 	});
// };

// cart functionality
TPCApp.prototype.animateCart = function (retinaScreen) {
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

// if you're on the search page, remove "gradient-bg" class from body because it looks bad if window height is tall
TPCApp.prototype.grayBgBody = function () {
	$('body').removeClass('gradient-bg');
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

TPCApp.prototype.iePlaceholders = function() {
    $.support.placeholder = false;
    var test = document.createElement('input');
    if('placeholder' in test) {
        $.support.placeholder = true;
        return function() {}
    } else {
        $('input[type="text"], input[type="email"]').each(function () {
            var _placeholder = $(this).attr('placeholder');
            $(this).val(_placeholder);
        }).focus(function() {
            var _placeholder = $(this).attr('placeholder');
            if($(this).val() == _placeholder) {
            	$(this).val(' ');
            }
	    }).blur(function() {
            var _placeholder = $(this).attr('placeholder');
            if($(this).val() == ' ' || !$(this).val()) {
            	$(this).val(_placeholder);
            }
	    });
    }
};
