'use strict';

window.app = window.app || {};

app.LocationView = Backbone.View.extend({
    tagName: 'div',
    className: 'one-location',

    events: {

    },

    template: _.template($('#locationTemplate').html()),

    initialize: function() {
        this.render();
    },

    render: function() {
    	var _this = this;

        this.collection.each(function(model) {
            _this.$el.append(_this.template(model.toJSON()));
            _this.renderSchedules(model);
        }, this);
        
        return this;
    },

    renderSchedules: function(theModel) {
        var courseIdToGet = theModel.get('courseId');
        var cityIdToGet = theModel.get('cityId');
        var searchIdToGet = theModel.get('searchId');

        app.scheduleCollection = new app.ScheduleCollection;
        var elemToAppendSchedules = this.$el.next();
        console.log(elemToAppendSchedules)
        app.scheduleCollection.fetch({
            data: JSON.stringify({
                "courseId": courseIdToGet,
                "cityId": cityIdToGet,
                "searchId": searchIdToGet
            }),
            type: "POST",
            contentType: "application/json",

            success: function() {
                $('.location-loader').css('display', 'none');
                app.scheduleView = new app.ScheduleView({
                    collection: app.scheduleCollection,
                    el: elemToAppendSchedules
                });
            }
        });
    }
});