'use strict';

function MainSearchSelect() {

	var _this = this;

	$('#main-search').select2({
		// data:sampleArray,
		tags: true,	
		selectOnBlur: true,
		maximumSelectionLength: 1,
		dropdownAutoWidth: true,
		// tokenSeparators: [",", " "],

		placeholder: function() {
			$(this).data('placeholder');
		},


		
		// createSearchChoice:function(term, data) {
		// 	alert('hi')
		// 	console.log(term, data);
		// 	// if ($(data).filter(function() { 
		// 	// 	return this.text.localeCompare(term)===0; }).length===0) {
		// 	// 	return {
		// 	// 		id:term, text:term
		// 	// 	};
		// 	// } 

		// 	if ($(data).filter(function() {
		// 	      return this.text.localeCompare(term)===0;
		// 	    }).length===0) {
		// 	      return {id:term, text:term};
		// 	    }
		// },
		
		// createSearchChoicePosition: function(list, item) {
		// 	alert('stuff')
		// 	list.splice(1, 0, item);
		// }
	});
	// .on('change', function(e) {
		// var isNew = $(this).find('[data-select2-tag="true"]');
		// if(isNew.length){
		// 	isNew.replaceWith('<option class="selected value="'+isNew.val()+'">'+isNew.val()+'</option>');
		// }
	// });

	this.autofillLocation();

	$('#search-btn').on('click', function() {
		_this.getSearchParams();
	});
};

MainSearchSelect.prototype.getSearchParams = function() {
	var topicsArray = [];

	// get the city or zip
	var location = $('#main-search').select2('val').toString();

	// get the selected class topic
	$('.chosen').each(function() {
		var selectedTopic = $(this).data('topic');
		console.log('hi')
		topicsArray.push(selectedTopic);
	});

	// get the date range
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

	var selectedDates = {
		min: minMonthYear,
		max: maxMonthYear
	};
	console.log(topicsArray.length)
	if(topicsArray.length == 0) {
		topicsArray.push('all');
	}
	console.log(topicsArray)
	var searchResults = {
		location: location,
		classTopics: topicsArray,
		dates: selectedDates
	};

	var resStringified = JSON.stringify(searchResults);

	console.log(JSON.stringify(searchResults));

	console.log(searchResults)

};

MainSearchSelect.prototype.autofillLocation = function() {
	var visitorLocation = $('#main-search').data('location');
	if(visitorLocation == 'undefiend' || visitorLocation == '') {
		return false;
	} else {
		$('#main-search').prepend('<option value="'+ visitorLocation +'" selected>'+ visitorLocation +'</option>').trigger('change');
	}
};