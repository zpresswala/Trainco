'use strict';

// the site for the plugin used: http://ghusse.github.io/jQRangeSlider/index.html

function DatePicker() {

	var _this = this;
	var minDate = new Date();
	this.minMonth = minDate.getMonth();
	var minYear = minDate.getFullYear();
	minDate.setMonth(parseInt(this.minMonth));
	minDate.setDate(parseInt("1"));
	minDate.setFullYear(parseInt(minYear));

	var monthOffset = 14;
	var maxDate = new Date();
	this.maxMonth = maxDate.getMonth();
	var maxYear = maxDate.getFullYear() + 1;
	maxDate.setMonth(parseInt(this.maxMonth + monthOffset));
	maxDate.setDate(parseInt("1"));
	maxDate.setFullYear(parseInt(maxYear));

	// the right slider handle, add three months
	var maxRangeSelect = new Date();
	var maxRangeMonth = maxRangeSelect.getMonth();
	var maxRangeYear = maxRangeSelect.getFullYear();
	maxRangeSelect.setMonth(parseInt(maxRangeMonth + 3));
	maxRangeSelect.setDate(parseInt("1"));
	maxRangeSelect.setFullYear(parseInt(maxRangeYear));

	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

	if($(window).width()<= 700) {
		var months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
	}

  	$('#date-range-slider').dateRangeSlider({
  		bounds: {
  			min: new Date(minDate), 
  			max: new Date(maxDate)
  		},
		    
	    defaultValues: {
	    	min: new Date(minDate), 
	    	max: new Date(maxRangeSelect)
	    },
	    
	    valueLabels: 'hide',

	    step: {
	    	months: 1
	    },

	    scales: [{
	    	first: function(value){ 
  			return value; 
	  		},

	  		end: function(value) {
	  			return value; 
	  		},

	  		next: function(value) {
	    		var next = new Date(value);
	    		return new Date(next.setMonth(value.getMonth() + 1));
	      	},

	      	label: function(value){

	      		// display year under january.
	      		var firstMonth = months[value.getMonth()];

	      		if(firstMonth === 'Jan' && $(window).width() >= 701) {
	      			return firstMonth + ' ' + value.getFullYear();
	      		}

	        	return months[value.getMonth()];
	      	},

	      	format: function(tickContainer, tickStart, tickEnd){
	        	tickContainer.addClass('month-label');
	        	var tickMonth = tickStart.getMonth();

	        	// add class to January because we display year too.
	        	var jan = months[tickMonth];
	        	if(jan === 'Jan') {
	        		tickContainer.addClass('first');
	        	}
	      	}
		}]
	});

	if($(window).width() >= 700) {
		this.addYearLabel();
	}

	// trigger a change so the slider handles display the month name
	this.valuesChanged(this.minMonth, this.minMonth + 4);

	setTimeout(function() {
		_this.fixWidth();
		if($(window).width() >= 700) {
			_this.sizeHandle();
		}
	}, 10);
}

DatePicker.prototype.addYearLabel = function() {
	$('.first').css({
		'line-height': 1.27,
		'marginTop': -7 + 'px',
		'position': 'relative',
		'top': 8 + 'px',
		'height': 42 + 'px'
	})
	.find('.ui-ruler-tick-label').css({
		display: 'inline-block',
		width: 84 + '%'
	});
};

DatePicker.prototype.sizeHandle = function() {
	var monthWidth = $($('.ui-ruler-tick-inner')[0]).outerWidth();
	$('.ui-rangeSlider-handle').css('width', monthWidth + 'px');
};

DatePicker.prototype.valuesChanged = function(startMonth, endMonth) {
	var rHandle = $('.ui-rangeSlider-rightHandle');
	var lHandle = $('.ui-rangeSlider-leftHandle');

	var months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"];

	// set initial values, dynamic based on date
	rHandle.text(months[this.minMonth + 2]);
	lHandle.text(months[this.maxMonth]);

	$('#date-range-slider').on("valuesChanged", function(e, data){
		var minMonth = new Date(data.values.min);
		var maxMonth = new Date(data.values.max);

		maxMonth.setDate(maxMonth.getDate() - 1);
		minMonth.setDate(minMonth.getDate());
		console.log(minMonth, maxMonth)
		var maxMonthAbbr = months[maxMonth.getMonth()];
		var minMonthAbbr = months[minMonth.getMonth()];
	  	rHandle.text(maxMonthAbbr);
	  	lHandle.text(minMonthAbbr);
	});
};

DatePicker.prototype.fixWidth = function() {
	var containerWidth = $('.ui-rangeSlider-container').width();
	$('.ui-rangeSlider-innerBar').css('width', containerWidth + 'px');

};