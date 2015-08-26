'use strict';

window.app = window.app || {};

app.ClassCollection = Backbone.Collection.extend({
	model: app.ClassModel,

	url: 'http://trainco-dev.imulus-client.com/api/seminars/search'

});

app.globalCollection = new app.ClassCollection;

// check the hash to see if there is data there. (only on page load)
$(document).ready(function () {
	if (window.location.hash) {
		if (app.mainSearchSelect == undefined)
			app.mainSearchSelect = new MainSearchSelect();

		var searchParams = app.mainSearchSelect.getHashSearchParams();
		performSearch(searchParams);
	}
});

// search button click
$('#search-btn').on('click', function () {
	var searchParams = app.mainSearchSelect.getSearchParams();
	performSearch(searchParams);
});

$('#search-btn-home').on('click', function () {
	var searchParams = app.mainSearchSelect.getSearchParams();
	
	var location = $('#main-search').select2('val').toString();

	window.location.href = '/search-seminars/?loc=' + encodeURIComponent(location) + window.location.hash;
});

// perform the search using the API and the search parameters
function performSearch(searchParams) {

	// parse the search data to show the search results message
	var dataReFormat = $.parseJSON(searchParams);
	if (dataReFormat == undefined || dataReFormat == false) {
		return;
	}
	if(dataReFormat.classTopics.length >= 4) {
		var topics = ['all'];
	} else {
		var topics = dataReFormat.classTopics.filter(function (item, pos) {
			var length = dataReFormat.classTopics.length;
			return dataReFormat.classTopics.indexOf(item) == pos;
		});
	}

	// if more than two items selected, add and
	if(topics.length == 2) {
		var length = topics.length;
		topics.splice(length - 1, 0, 'and');
		var topicsList = topics.join(' ');
		var topicsListTwo = topicsList.replace('and,','and');
		var topics = topicsListTwo;
	} else if(topics.length > 2) {

		// if two or fewer, remove commas
		topics.splice(length - 1, 0, 'and');
		var topicsList = topics.join(', ');
		var topicsListTwo = topicsList.replace('and,','and');
		var topics = topicsListTwo;
	}

	var $emptyMsg = $('.empty-message'),
		$classLoader = $('.class-loader');

	console.log(searchParams.toString());

	app.globalCollection.fetch({
		data: searchParams,
		type: "POST",
		contentType: "application/json",

		success: function (data) {
			console.log(data)
			$('.results').empty();
			$emptyMsg.fadeOut(100, function () {
				$classLoader.fadeIn(90);

				if (data.length === 0) {
					$classLoader.fadeOut(150, function () {
						$emptyMsg.fadeIn(150).text('We were unable to find classes that fit your preferences. Please change your search terms and try again.');
					});
				} else {
					$classLoader.fadeOut(150, function () {
						$emptyMsg.fadeIn(150).text('Displaying results for ' + topics + ' seminars in ' + dataReFormat.location + '.');
					});

					app.classView = new app.ClassView({
						collection: app.globalCollection,
						el: '.results'
					});
				}
			});
		}
	});
};


