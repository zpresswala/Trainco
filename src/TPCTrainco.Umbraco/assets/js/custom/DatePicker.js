'use strict';

function DatePicker() {
	// $("#slider").dateRangeSlider({
	//     bounds: {min: new Date(2013, 0, 1), max: new Date(2013, 0, 1, 23, 59, 59)},
	//     defaultValues: {min: new Date(2013, 0, 1, 8), max: new Date(2013, 0, 1, 18)}
	// });
	var _this = this;
	var startDate = '2015, 8';
	var endDate = '2015, 10';

	var year = ['2016'];

	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

	if($(window).width()<= 700) {
		var months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
	}
	  	$('#date-range-slider').dateRangeSlider({

	  		// bounds: the months in the range
	    	bounds: {min: new Date(2015, 6), max: new Date(2016, 11)},

	    	step: {
	    		months: 1
	    	},

	    	valueLabels: 'hide',

	    	// defaultValues: where the slider starts
	    	defaultValues: {min: new Date(2015, 6), max: new Date(endDate)},
	    	scales: [{
	      		first: function(value){ 
	      			return value; 
	      		},
	      		end: function(value) {
	      			console.log(value)
	      			return value; },
	      		next: function(value){
	        	var next = new Date(value);
	        	return new Date(next.setMonth(value.getMonth() + 1));
		      	},
		      	label: function(value){
		      		var firstMonth = months[value.getMonth()];
		      		if(firstMonth === 'Jan' && $(window).width() >= 701) {
		      			return firstMonth + ' ' + year;
		      		}
		        	return months[value.getMonth()];
		      	},
		      	format: function(tickContainer, tickStart, tickEnd){
		        	tickContainer.addClass('month-label');

		        	var tickNewYear = tickStart.getFullYear();
		        	var nextYear = new Date().getFullYear() + 1;

	        		if(tickNewYear === nextYear) {
	        			tickContainer.addClass('first')
	        		}
		      	}
		    }]
	});

	if($(window).width() >= 700) {
		this.addYearLabel();
	}

	this.valuesChanged();

	this.sendToSearch();
	setTimeout(function() {
		_this.fixWidth();
	}, 10);
}


DatePicker.prototype.addYearLabel = function() {
	
	var _this = this;

	$($('.first')[0]).css({
		'line-height': 1.27,
		'marginTop': -7 + 'px',
		'position': 'relative',
		'top': 8 + 'px',
		'height': 42 + 'px',
		'max-width': 50 + 'px'
	});

	setTimeout(function() {
		_this.sizeHandle();
	}, 10);

};

DatePicker.prototype.sizeHandle = function() {
	var monthWidth = $($('.ui-ruler-tick-inner')[0]).outerWidth();
	console.log(monthWidth)
	$('.ui-rangeSlider-handle').css('width', monthWidth + 'px');
};

DatePicker.prototype.valuesChanged = function() {
	var _this = this;

	var rHandle = $('.ui-rangeSlider-rightHandle');
	var lHandle = $('.ui-rangeSlider-leftHandle');

	var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];

	// set initial values, need to make dynamic
	rHandle.text('SEPT');
	lHandle.text('JUL');

	$('#date-range-slider').on("valuesChanged", function(e, data){
		var minMonth = new Date(data.values.min);
		var maxMonth = new Date(data.values.max);
		maxMonth.setDate(maxMonth.getDate() - 1);
		minMonth.setDate(maxMonth.getDate() - 1);
		var maxMonthAbbr = months[maxMonth.getMonth()];
		var minMonthAbbr = months[minMonth.getMonth()];
	  	console.log("Values just changed. min: " + data.values.min + " max: " + data.values.max);
	  	rHandle.text(maxMonthAbbr);
	  	lHandle.text(minMonthAbbr);
	});
};

DatePicker.prototype.sendToSearch = function() {
	var _this = this;
	document.getElementById('search-btn').addEventListener('click', function() {
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

		var dataToSend = [minMonthYear, maxMonthYear];
		console.log(dataToSend)
	});
};

DatePicker.prototype.fixWidth = function() {
	var containerWidth = $('.ui-rangeSlider-container').width();
	console.log(containerWidth)
	$('.ui-rangeSlider-innerBar').css('width', containerWidth + 'px');

};

DatePicker.prototype.getStartMonth = function() {
	var date = new D
};

DatePicker.prototype.getEndMonth = function() {

}