'use strict';

function TPCApp() {
	$('.carousel').carousel();
	this.homePage = new HomePage();

	// only run this on certain pages.
	// this.countUp = new CountUp();
}