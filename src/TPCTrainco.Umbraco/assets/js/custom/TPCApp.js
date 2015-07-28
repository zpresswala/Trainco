'use strict';

function TPCApp() {
	var _this = this;
	this.$win = $(window);
	
	$('.carousel').carousel();
	
	this.homePage = new HomePage();

	if($('#main-search').length) {
		this.mainSearchSelect = new MainSearchSelect();
	}

	if($('#date-range-slider').length) {
		this.datePicker = new DatePicker();
	}

	if($('#count').length) {
		this.countUp = new CountUp(this.$win);
	}

	if($('.share-btn-wrap').length) {
		$('[data-toggle="popover"]').popover({
			animation: true,
			container: '.btn-share',
			trigger: 'click',
			html: true
		});
	}

	this.animateCart();

	this.bindScroll();
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
TPCApp.prototype.animateCart = function() {
	if(Modernizr.csstransitions) {
		$('.cart-tab').on('click', function() {
			// $('.cart, .results-container').toggleClass('down');
			$('.cart').slideToggle(300, function() {
				$(this).toggleClass('down');
				$('.cart-visible').toggleClass('down');
			});
		});
	} else {
		$('.cart-tab').on('click', function() {
			$('.cart').slideToggle('fast');
		});
	}

};