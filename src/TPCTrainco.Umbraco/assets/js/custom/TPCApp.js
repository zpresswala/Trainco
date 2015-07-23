﻿'use strict';

function TPCApp() {
	var _this = this;
	this.$win = $(window);
	
	$('.carousel').carousel();
	
	this.homePage = new HomePage();

	this.mainSearchSelect = new MainSearchSelect();

	if($('#date-range-slider').length) {
		this.datePicker = new DatePicker();
	}

	if($('#count').length) {
		this.countUp = new CountUp(this.$win);
	}

	this.bindScroll();

	// $('[data-toggle="popover"]').popover({
	// 	animation: true,
	// 	container: '.btn-share',
	// 	trigger: 'click',
	// 	html: true
	// });
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