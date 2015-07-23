'use strict';

// the site for the plugin used: http://ghusse.github.io/jQRangeSlider/index.html

function DatePicker() {

	// date, month, year vars
	this.date = new Date();
	this.month = this.date.getMonth() + 1;
	this.year = this.date.getFullYear();

	var _this = this;

	// where the red buttons should start
	var selectorStartDate = this.getStartDate(this.year, this.month);
	var selectorEndDate = this.getEndDate(this.year, this.month);

	// the last month showing on the date range, a total of 13 months after current month
	var rangeEndDate = selectorEndDate[1] + 9;

	// range selector start month
	this.startMonth = selectorStartDate[1];
	
	// range selector end month
	this.endMonth = selectorEndDate[1];

	// insert the next year under january
	var nextYearNumber = [this.year];

	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

	if($(window).width()<= 700) {
		var months = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
	}

  	$('#date-range-slider').dateRangeSlider({

  		// bounds: the months in the range
    	bounds: {min: new Date(selectorStartDate), max: new Date(nextYearNumber, rangeEndDate)},

    	step: {
    		months: 1
    	},

    	valueLabels: 'hide',

    	// defaultValues: where the slider starts
    	defaultValues: {min: new Date(selectorStartDate), max: new Date(selectorEndDate)},
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

	this.valuesChanged(this.startMonth, this.endMonth);

	this.sendToSearch();
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
	rHandle.text(months[endMonth - 2]);
	lHandle.text(months[startMonth - 1]);

	$('#date-range-slider').on("valuesChanged", function(e, data){
		var minMonth = new Date(data.values.min);
		var maxMonth = new Date(data.values.max);
		maxMonth.setDate(maxMonth.getDate() - 1);
		minMonth.setDate(maxMonth.getDate() - 1);
		var maxMonthAbbr = months[maxMonth.getMonth()];
		var minMonthAbbr = months[minMonth.getMonth()];
	  	rHandle.text(maxMonthAbbr);
	  	lHandle.text(minMonthAbbr);
	});
};

DatePicker.prototype.sendToSearch = function() {
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
	});
};

DatePicker.prototype.fixWidth = function() {
	var containerWidth = $('.ui-rangeSlider-container').width();
	$('.ui-rangeSlider-innerBar').css('width', containerWidth + 'px');

};

DatePicker.prototype.getStartDate = function(year, month) {
	var startDate = [year, month];
	return startDate;
};

DatePicker.prototype.getEndDate = function(year, month) {
	this.monthEndRange = month + 4;
	this.year = year;
	if(this.monthEndRange > 12) {
		var difference = this.monthEndRange - 12;
		this.monthEndRange = difference;
		this.year = this.year + 1;
		var endDate = [this.year, this.monthEndRange];
	} else {
		var endDate = [this.year, this.monthEndRange];
	}
	return endDate;
};