'use strict';

function CountUp() {
	
	// this.$numbers = $('.number-callout').find('h3');
	// console.log(this.$numbers)
	this.startVal = 0;
	this.endValuesArr = [];

	this.getEndVal();
	
	this.Init();

}

CountUp.prototype.getEndVal = function() {
	var _this = this;

	// loop through numbers on screen
	$('.number-callout').find('h3').each(function(index) {

		// grab the value, strip non-numeric chars
		var number = parseInt($(this).html().replace(/\D/g,''));

		// push values into array
		_this.endValuesArr.push(number);
	});
};

CountUp.prototype.Init = function() {
	console.log(this.endValuesArr);
	// for(var i = 0; i < this.endValuesArr.length; i++) {
		var temp = this.endValuesArr[0];
		console.log(temp, this.startVal)
		var start = 0;
		function increase() {
			start++;
			if(start === temp) {
				clearInterval(inter);
			}
			console.log(start)
		}

		var inter = setInterval(increase, 100);
	// 	var interval;
		// var interval = setInterval(function() {
		// 	this.startVal++;
		// 	// if(this.startVal === temp) {
		// 	// 	clearInterval(interval);
		// 	// }
		// 	console.log(this.startVal)
		// }, 100);
	// }

	console.log(this.startVal)
};
