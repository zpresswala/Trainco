'use strict';

window.app = window.app || {};

app.SingleSeminarView = Backbone.View.extend({
    tagName: 'li',
    className: 'seminar-item col-xs-12',

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

        // styling
        console.log(this.$el)
        this.$el.css('padding-bottom', 25 + 'px');
        this.$el.find('.text-desc').css({
            "padding-bottom": 30 + 'px',
            "border-bottom": '1px solid #D7D7D7'
        });

        var seminarIdToGet = this.model.get('seminarId');
        var searchIdToGet = this.model.get('searchId');
        var elemToRender = $($(e.currentTarget).parent().parent().parent().next('.schedule-item-wrap'));
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