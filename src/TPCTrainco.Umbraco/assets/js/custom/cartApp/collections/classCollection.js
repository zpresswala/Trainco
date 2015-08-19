'use strict';

window.app = window.app || {};

app.ClassCollection = Backbone.Collection.extend({
    model: app.ClassModel,

    url: 'http://trainco-dev.imulus-client.com/api/seminars/search'
});

app.globalCollection = new app.ClassCollection;
$('.class-loader').css('display', 'block');
app.globalCollection.fetch({
    data: JSON.stringify({"location":"Dallas, TX"}),
    type: "POST",
    contentType: "application/json",

    success: function() {
        $('.empty-message').fadeOut(300);
        $('.class-loader').fadeOut(350);
        app.classView = new app.ClassView({
            collection: app.globalCollection,
            el: '.results'
        });
    }
});