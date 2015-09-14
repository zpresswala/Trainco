'use strict';

window.app = window.app || {};

function MainSearchSelect() {

	var _this = this;

	$('#main-search').select2({
		tags: true,
		selectOnBlur: true,
		maximumSelectionLength: 1,
		dropdownAutoWidth: true,

		placeholder: function () {
			$(this).data('placeholder');
		}
	});


	if (!window.location.hash)
		this.autofillLocation();


	// focus the search button after choosing a location to ensure it's ready for an enter keypress
	$('#main-search').on("select2:select", function (e) {
		if($('#search-btn').length) {
			$('#search-btn').focus();	
		}

		if($('#search-btn-home').length) {
			$('#search-btn-home').focus();	
		}

		
		
	});

	$('#main-search').on("select2:open", function (e) {
		//$('.select2-results__option').css('border', '2px solid green');
	});
};


MainSearchSelect.prototype.getSearchParams = function () {
	var topicsArray = [];
	var classId = 0;

	// get the city or zip
	var searchLocationVal = $('#main-search').select2('val');

	if ($('.secondary-search[data-classid!=""][data-classid]')) {
		classId = $('.secondary-search').data('classid');
	}

	// if empty, show message
	if (searchLocationVal == null) {
		$('.empty-location-msg').fadeIn(150).delay(200).fadeTo(150, 0.5).delay(150).fadeTo(150, 1).delay(200).fadeTo(150, 0.5).delay(150).fadeTo(150, 1).delay(200).fadeTo(150, 0.5).delay(150).fadeTo(150, 1);
		$('.class-loader').fadeOut(150);
		return;
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

		app.resStringified = this.generateJsonSearchString(location, topicsArray, classId, minMonth, minYear, maxMonth, maxYear);
		return app.resStringified;
	}
};


// get the search parameters based on the hash
MainSearchSelect.prototype.getHashSearchParams = function () {
	var hashArray = this.processHashBang();

	// if you're on the page without search params in the url
	if(!hashArray.hasOwnProperty('loc') && !hashArray.hasOwnProperty('topics')) {
		$('.detail-page-app').hide();
		return false;
	} else {
		$('.detail-page-app').show();
		var topicsArray = [];
		var classId = 0
		var location = '';

		topicsArray = hashArray['topics'].split(',');
		location = unescape(hashArray['loc']);

		this.autofillLocation(location);

		var minDate = hashArray['dMin'].split("/");
		var minMonth = minDate[0];
		var minYear = minDate[1];

		var maxDate = hashArray['dMax'].split("/");
		var maxMonth = maxDate[0];
		var maxYear = maxDate[1];

		// Update the Date Range Slider
		var minDateObj = new Date(parseInt(minYear), parseInt(minMonth) - 1);
		var maxDateObj = new Date(parseInt(maxYear), parseInt(maxMonth) - 1);
		$(document).ready(function() {
			$("#date-range-slider").dateRangeSlider("values", minDateObj, maxDateObj);
		});

		// update search parameters
		if (topicsArray != undefined && topicsArray.length == 4) {
			$('.overlay-contain[data-topic="all"]').addClass('chosen');
		}
		else {
			for (var i in topicsArray) {
				$('.overlay-contain[data-topic="' + topicsArray[i] + '"]').addClass('chosen');
			}
		}
		//a[href!=""][href]
		if ($('.secondary-search[data-classid!=""][data-classid]')) {
			classId = parseInt($('.secondary-search').data('classid'));
		}

		app.resStringified = this.generateJsonSearchString(location, topicsArray, classId, minMonth, minYear, maxMonth, maxYear);
		return app.resStringified;
	}
};

// generate a JSON search string for performSearch (in cartCollection.js)
MainSearchSelect.prototype.generateJsonSearchString = function (location, topicsArray, classId, minMonth, minYear, maxMonth, maxYear) {
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

	var searchResults

	if (classId > 0) {
		searchResults = {
			location: location,
			classId: classId,
			dates: selectedDates
		};
	}
	else {
		searchResults = {
			location: location,
			classTopics: topicsArray,
			dates: selectedDates
		};
	}

	

	returnJson = JSON.stringify(searchResults);
	return returnJson;
};


MainSearchSelect.prototype.autofillLocation = function(urlLocation) {
	if(!urlLocation) {
		var visitorLocation = $('#main-search').data('location');
		if (visitorLocation == 'undefined' || visitorLocation == '') {
			return false;
		} else {
			$('#main-search').prepend('<option value="' + visitorLocation + '" selected>' + visitorLocation + '</option>').trigger('change');
		}
	} else {
		$('#main-search').prepend('<option value="' + urlLocation + '" selected>' + urlLocation + '</option>').trigger('change');
	}
};

// get the hash and create an array of the search parameters
MainSearchSelect.prototype.processHashBang = function () {
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

// update the hash in the url
MainSearchSelect.prototype.updateHashBang = function (location, topics, dateMin, dateMax) {
	var hashStr = 'loc=' + (escape(location) || '') + '&topics=' + (topics.toString() || '') + '&dMin=' + (dateMin || '') + '&dMax=' + (dateMax || '');
	window.location.hash = hashStr;
};

MainSearchSelect.prototype.detailPageSearch = function() {
	
	// get the location
	var classLocation = $('#main-search').data('location');

	// get the classId
	var classIdSearched = $('.secondary-search').data('classid');

	return {
		"location": classLocation,
		"classId": classIdSearched
	}
};