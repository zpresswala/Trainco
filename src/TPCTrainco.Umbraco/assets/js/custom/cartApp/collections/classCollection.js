'use strict';

window.app = window.app || {};

app.ClassCollection = Backbone.Collection.extend({
	model: app.ClassModel,

	url: ApiDomain + '/api/seminars/search'

});

app.globalCollection = new app.ClassCollection;

// search button click or enter keypress to activate a search
var performSearchCallback = function() {
	app.globalCollection.reset();
	app.locationCollection.reset();
	app.scheduleCollection.reset();
	var searchLocationVal = $('#main-search').select2('val');
	var searchParams;
	if(searchLocationVal) {
		searchParams = app.mainSearchSelect.getSearchParams();
		performSearch(searchParams);
	} else {
		$('.empty-location-msg').show();
		$('.class-loader').hide();
	}
};

var performHomeSearchCallback = function() {
	var searchParams = app.mainSearchSelect.getSearchParams();
	var location = $('#main-search').select2('val').toString();
	window.location.href = '/search-seminars/?homeref=1' + window.location.hash;
};

// activate the search on click or enter keypress
$('#search-btn').on('click', performSearchCallback);

// home search callback
$('#search-btn-home').on('click', performHomeSearchCallback);

// trigger searches with enter keypress
$(document).keydown(function() {
	if(event.which == 13) {
		if($('#search-btn').length) {
			performSearchCallback();
		}
		if($('#search-btn-home').length) {
			performHomeSearchCallback();
		}
	}
});


// perform the search using the API and the search parameters
function performSearch(searchParams) {

	// ie8 array filter polyfill
	[].filter||(Array.prototype.filter=function(a,b,c,d,e){c=this;d=[];for(e in c)~~e+''==e&&e>=0&&a.call(b,c[e],+e,c)&&d.push(c[e]);return d})

	// ie8 array indexOf polyfill
	if (!Array.prototype.indexOf) {
	  Array.prototype.indexOf = function(searchElement, fromIndex) {

	    var k;
	    if (this == null) {
	      throw new TypeError('"this" is null or not defined');
	    }

	    var O = Object(this);

	    var len = O.length >>> 0;

	    if (len === 0) {
	      return -1;
	    }

	    var n = +fromIndex || 0;

	    if (Math.abs(n) === Infinity) {
	      n = 0;
	    }
	    if (n >= len) {
	      return -1;
	    }
	    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
	    while (k < len) {
	      if (k in O && O[k] === searchElement) {
	        return k;
	      }
	      k++;
	    }
	    return -1;
	  };
	}

	// end polyfills
	
	var $emptyMsg = $('.empty-message'),
		$classLoader = $('.class-loader');
	
	$emptyMsg.fadeOut(100, function() {
		$classLoader.fadeIn(150);
	});

	// parse the search data to show the search results message
	var dataReFormat = $.parseJSON(searchParams);

	// if no data, return
	if (dataReFormat == 'undefined' || !dataReFormat) {
		return false;

		// if no classTopics property, return, which means you are on the detail page
	} else if (!dataReFormat.hasOwnProperty('classTopics') && !dataReFormat.hasOwnProperty('classId')) {
		return false;
	} else if (dataReFormat.hasOwnProperty('classTopics')) {
		
		// if classId is found, skip the classTopics, you are on the search page
		if (dataReFormat.classTopics.length >= 4) {
			var topics = ['all'];
		} else {
			var topics = dataReFormat.classTopics.filter(function (item, pos) {
				return dataReFormat.classTopics.indexOf(item) == pos;
			});
		}

		// if more than two items selected, add and
		var length = topics.length;
		if (length == 2) {
			topics.splice(length - 1, 0, 'and');
			var topicsList = topics.join(' ');
			var topicsListTwo = topicsList.replace('and,', 'and');
			var topics = topicsListTwo;
		} else if (length > 2) {

			// if two or fewer, remove commas
			topics.splice((length - 1), 0, 'and');
			var topicsList = topics.join(', ');
			var topicsListTwo = topicsList.replace('and,', 'and');
			var topics = topicsListTwo;
		}	
	}

	$classLoader.fadeIn(90);

	if($('#search-results').length) {
		$('html, body').animate({
			scrollTop: $('#search-results').offset().top - 140
		}, 300);
	}

	app.globalCollection.fetch({
		data: searchParams,
		type: "POST",
		contentType: "application/json",

		success: function (data) {

			$('.results').empty();
			$emptyMsg.fadeOut(100, function () {

				if (data.length === 0) {
					$classLoader.fadeOut(150, function () {
						$emptyMsg.fadeIn(150).text('We were unable to find classes that fit your preferences. Please change your search terms and try again.');
					});
				} else {
					$classLoader.fadeOut(150, function () {
						if($('.search-page').length) {
							$emptyMsg.fadeIn(150).text('Displaying the closest matching ' + topics + ' seminars to your selected location of ' + dataReFormat.location + '.');
						}
					});

					app.classView = new app.ClassView({
						collection: app.globalCollection,
						el: '.results'
					});

					// if details page, trigger the locations
					if ($('.detail-page-app').length) {
						$(".view-opts").trigger("click");
					}
				}
			});
		}
	});
};