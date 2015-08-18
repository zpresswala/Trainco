'use strict';

window.app = window.app || {};

app.SingleSeminarView = Backbone.View.extend({
    tagName: 'li',
    className: 'seminar',

    events: {
        'click .view-opts': 'showClassOptions'
    },

    template: _.template($('#classTemplate').html()),

    initialize: function() {

    },

    render: function() {
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    },

    showClassOptions: function(e) {
        e.preventDefault();

        var seminarIdToGet = this.model.get('seminarId');
        var searchIdToGet = this.model.get('searchId');
        var elemToRender = $(e.currentTarget).parent().next('.cart-items');
        console.log(elemToRender)

        app.locationCollection = new app.LocationCollection;
        $('.location-loader').css('display', 'block');
        app.locationCollection.fetch({
            data: JSON.stringify({
                "courseId": seminarIdToGet,
                "searchId": searchIdToGet
            }),
            type: "POST",
            contentType: "application/json",

            success: function(data) {
                // $('.location-loader').css('display', 'none');
                app.locationView = new app.LocationView({
                    collection: app.locationCollection,
                    el: elemToRender
                });
            }
        });
    }
});

app.singleSeminarView = new app.SingleSeminarView();