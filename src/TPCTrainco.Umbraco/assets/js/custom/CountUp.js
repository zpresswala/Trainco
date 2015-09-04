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
		var number = parseInt($(this).data('value').toString().replace(/\D/g,''));

		// push values into array
		_this.endValuesArr.push(number);
	});
};

CountUp.prototype.resetVals = function() {

	// reset values to zero on load
	this.$numbers[0].innerHTML = '-';
	this.$numbers[1].innerHTML = '-';
	this.$numbers[2].innerHTML = '-';
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

		// if it's the first one, add k+ to the end
		if(indx === 0) {
			_this.$numbers[indx].innerHTML = startNum + 'K+';
		} else if (indx === 2) {

			// if it's the third one, add '+' to the end
			_this.$numbers[indx].innerHTML = startNum + '+';
		} else {
			_this.$numbers[indx].innerHTML = startNum + 'K+';
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
