'use strict';

window.app = window.app || {};

app.ClassCollection = Backbone.Collection.extend({
	model: app.ClassModel,

	url: ApiDomain + '/api/seminars/search'

});

app.globalCollection = new app.ClassCollection;
		  
// check the hash to see if there is data there. (only on page load)
$(document).ready(function () {
	// moved to TPCApp.js
});

// search button click
$('#search-btn').on('click', function () {
	app.globalCollection.reset();
	app.locationCollection.reset();
	app.scheduleCollection.reset();
	var searchParams;
	searchParams = app.mainSearchSelect.getSearchParams();
	performSearch(searchParams);
});

$('#search-btn-home').on('click', function () {
	var searchParams = app.mainSearchSelect.getSearchParams();
	
	var location = $('#main-search').select2('val').toString();

	window.location.href = '/search-seminars/?homeref=1' + window.location.hash;
});


// perform the search using the API and the search parameters
function performSearch(searchParams) {
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

	app.globalCollection.fetch({
		data: searchParams,
		type: "POST",
		contentType: "application/json",

		success: function (data) {

			$('.results').empty();
			$emptyMsg.fadeOut(100, function () {
				$classLoader.fadeIn(90);

				if (data.length === 0) {
					$classLoader.fadeOut(150, function () {
						$emptyMsg.fadeIn(150).text('We were unable to find classes that fit your preferences. Please change your search terms and try again.');
					});
				} else {
					$classLoader.fadeOut(150, function () {
						if($('.search-page').length) {
							$emptyMsg.fadeIn(150).text('Displaying results for ' + topics + ' seminars in ' + dataReFormat.location + '.');
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


