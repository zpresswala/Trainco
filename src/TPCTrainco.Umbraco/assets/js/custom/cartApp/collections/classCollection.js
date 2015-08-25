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

		var searchParams = app.mainSearchSelect.getHashSearchParams(),
        $emptyMsg = $('.empty-message'),
        $classLoader = $('.class-loader');

		performSearch(searchParams);
	}
});


// search button click
$('.select-date-text').on('click', function () {
	var searchParams = app.mainSearchSelect.getHashSearchParams(),
        $emptyMsg = $('.empty-message'),
        $classLoader = $('.class-loader');

	performSearch(searchParams);
});



// search button click
$('#search-btn').on('click', function () {
	var searchParams = app.mainSearchSelect.getSearchParams(),
        $emptyMsg = $('.empty-message'),
        $classLoader = $('.class-loader');

	performSearch(searchParams);
});


function performSearch(searchParams) {
	// parse the search data to show the search results message
	var dataReFormat = $.parseJSON(searchParams);
	var topics = dataReFormat.classTopics.filter(function (item, pos) {
		return dataReFormat.classTopics.indexOf(item) == pos;
	});

	console.log(searchParams);

	app.globalCollection.fetch({
		data: searchParams,
		type: "POST",
		contentType: "application/json",

		success: function (data) {
			console.log(data)
			$emptyMsg.fadeOut(100, function () {
				$classLoader.fadeIn(90).addClass('one');

				if (data.length === 0) {
					$classLoader.fadeOut(150, function () {
						$emptyMsg.fadeIn(150).text('We were unable to find classes that fit your preferences. Please change your search terms and try again.');
					});
				} else {
					$classLoader.fadeOut(150, function () {
						$emptyMsg.fadeIn(150).text('Displaying results for ' + topics.join(', ') + 'seminars in ' + dataReFormat.location + '.', function () {
							$('.results').empty();
						});
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


