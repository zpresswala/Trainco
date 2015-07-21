'use strict';

function DatePicker() {
	// $("#slider").dateRangeSlider({
	//     bounds: {min: new Date(2013, 0, 1), max: new Date(2013, 0, 1, 23, 59, 59)},
	//     defaultValues: {min: new Date(2013, 0, 1, 8), max: new Date(2013, 0, 1, 18)}
	// });
	var startDate = '2015, 8';
	var endDate = '2015, 10';

	var year = ['2016'];

	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
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
		      		if(firstMonth === 'Jan') {
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

	this.addYearLabel();

	this.initialLoad = false;

	this.valuesChanged();
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
		console.log('hi')
		var _this = this;

	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
	console.log(this.initialLoad)
	if(!this.initialLoad){
		$('.ui-rangeSlider-rightHandle').text('Sept');
		$('.ui-rangeSlider-leftHandle').text('Jun');
	} else {
		$('#date-range-slider').on("valuesChanged", function(e, data){
			_this.initialLoad = true;
			var minMonth = new Date(data.values.min);
			var maxMonth = new Date(data.values.max);
			maxMonth.setDate(maxMonth.getDate() - 1);
			minMonth.setDate(maxMonth.getDate() - 1);
			console.log(maxMonth)
			var maxMonthAbbr = months[maxMonth.getMonth()];
			var minMonthAbbr = months[minMonth.getMonth()];
		  	console.log("Values just changed. min: " + data.values.min + " max: " + data.values.max);
		  	$('.ui-rangeSlider-rightHandle').text(maxMonthAbbr);
		  	$('.ui-rangeSlider-leftHandle').text(minMonthAbbr);
		});
	}

	this.initialLoad = true;
	// setTimeout(function() {
	// 	$('#date-range-slider').trigger('valuesChanged', function(e, data));
	// }, 50);
};

DatePicker.prototype.getStartMonth = function() {
	var date = new D
};

DatePicker.prototype.getEndMonth = function() {

}