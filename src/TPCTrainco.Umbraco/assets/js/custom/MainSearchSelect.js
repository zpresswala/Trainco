'use strict';

window.app = window.app || {};

function MainSearchSelect() {

	var _this = this;

	$('#main-search').select2({
		// data:sampleArray,
		tags: true,
		selectOnBlur: true,
		maximumSelectionLength: 1,
		dropdownAutoWidth: true,
		// tokenSeparators: [",", " "],

		placeholder: function () {
			$(this).data('placeholder');
		}
	});

	this.autofillLocation();
};


MainSearchSelect.prototype.getSearchParams = function () {
	var topicsArray = [];

	// get the city or zip
	var searchLocationVal = $('#main-search').select2('val');

	// if empty, show message
	if (searchLocationVal == null) {
		$('.empty-location-msg').fadeIn(150).delay(200).fadeTo(150, 0.5).delay(150).fadeTo(150, 1).delay(200).fadeTo(150, 0.5).delay(150).fadeTo(150, 1).delay(200).fadeTo(150, 0.5).delay(150).fadeTo(150, 1);
		$('.class-loader').fadeOut(150);
		return false;
	} else {
		var location = $('#main-search').select2('val').toString();
		$('.empty-location-msg').fadeOut(150);

		// get the selected class topic
		$('.chosen').each(function () {
			var selectedTopic = $(this).data('topic');
			if (selectedTopic === 'all') {
				topicsArray.push("electrical", "management", "hvac", "mechanical");
			} else {
				topicsArray.push(selectedTopic);
			}
		});

		if (topicsArray.length == 0) {
			topicsArray.push("electrical", "management", "hvac", "mechanical");
		}

		// get the date range
		var dateValues = $('#date-range-slider').dateRangeSlider("values");
		var minDate = new Date(dateValues.min);
		var minMonth = minDate.getMonth() + 1;
		var minYear = minDate.getFullYear();

		var maxDate = new Date(dateValues.max);
		var maxMonth = maxDate.getMonth() + 1;
		var maxYear = maxDate.getFullYear();

		this.updateHashBang(location, topicsArray, minMonth + '/' + minYear, maxMonth + '/' + maxYear);

		app.resStringified = this.generateJsonSearchString(location, topicsArray, minMonth, minYear, maxMonth, maxYear);
		return app.resStringified;
	}
};


MainSearchSelect.prototype.getSearchParamsFromHash = function () {
	var topicsArray = [];
	var location = '';

	var hashArray = this.processHashBang();

	topicsArray = hashArray['topics'].split(',');
	location = hashArray['loc'];

	var minDate = hashArray['dMin'].split("/");
	var minMonth = minDate[0];
	var minYear = minDate[1];

	var maxDate = hashArray['dMax'].split("/");
	var maxMonth = maxDate[0];
	var maxYear = maxDate[1];

	app.resStringified = this.generateJsonSearchString(location, topicsArray, minMonth, minYear, maxMonth, maxYear);
	return app.resStringified;
};


MainSearchSelect.prototype.generateJsonSearchString = function (location, topicsArray, minMonth, minYear, maxMonth, maxYear) {
	var returnJson;

	var minMonthYear = {
		minMonthVal: minMonth,
		minYearVal: minYear
	};

	var maxMonthYear = {
		maxMonthVal: maxMonth,
		maxYearVal: maxYear
	};

	var selectedDates = {
		min: minMonthYear,
		max: maxMonthYear
	};

	var searchResults = {
		location: location,
		classTopics: topicsArray,
		dates: selectedDates
	};

	returnJson = JSON.stringify(searchResults);
	return returnJson;
};



MainSearchSelect.prototype.autofillLocation = function () {
	var visitorLocation = $('#main-search').data('location');
	if (visitorLocation == 'undefined' || visitorLocation == '') {
		return false;
	} else {
		$('#main-search').prepend('<option value="' + visitorLocation + '" selected>' + visitorLocation + '</option>').trigger('change');
	}
};


MainSearchSelect.prototype.c = function () {
	var url = window.location.href;

	var vars = {};
	var hashes = url.slice(url.indexOf('#') + 1).split('&');

	for (var i = 0; i < hashes.length; i++) {
		var hash = hashes[i].split('=');

		if (hash.length > 1) {
			vars[hash[0]] = hash[1];
		} else {
			vars[hash[0]] = null;
		}
	}

	return vars;
};

MainSearchSelect.prototype.updateHashBang = function (location, topics, dateMin, dateMax) {
	var hashStr = 'loc=' + (location || '') + '&topics=' + (topics.toString() || '') + '&dMin=' + (dateMin || '') + '&dMin=' + (dateMax || '');
	window.location.hash = hashStr;
};