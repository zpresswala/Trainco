'use strict';

window.app = window.app || {};

app.ClassCollection = Backbone.Collection.extend({
    model: app.ClassModel,

    url: 'http://trainco-dev.imulus-client.com/api/seminars/search'
});

app.globalCollection = new app.ClassCollection;

$('#search-btn').on('click', function() {
    $('.class-loader').css('display', 'block');
    var searchParams = app.mainSearchSelect.getSearchParams(),
        $emptyMsg = $('.empty-message'),
        $classLoader = $('.class-loader');

    console.log(searchParams)

    app.globalCollection.fetch({
        data: searchParams,
        type: "POST",
        contentType: "application/json",

        success: function(data) {
            console.log(data)
            if(data.length === 0) {
                $emptyMsg.fadeIn(100).text('We were unable to find classes that fit your preferences. Please change your search terms and try again.');
                $classLoader.fadeOut(350);
            } else {
                $emptyMsg.fadeOut(300);
                $classLoader.fadeOut(350);
                app.classView = new app.ClassView({
                    collection: app.globalCollection,
                    el: '.results'
                });
            }
        }
    });
});