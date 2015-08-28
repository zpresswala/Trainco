'use strict';

window.app = window.app || {};

app.LocationView = Backbone.View.extend({
    tagName: 'div',
    className: 'one-location',

    events: {
        'click .location-icon': 'showClassLocationMsg'
    },

    template: _.template($('#locationTemplate').html()),

    initialize: function() {
        this.render();
    },

    render: function() {
        var _this = this;
        this.collection.each(function(model) {
            var hasBeenRendered = model.get('hasBeenRendered');
            if(hasBeenRendered) {
                return false;
            } else { 
                _this.$el.append(_this.template(model.toJSON()));
                model.set('hasBeenRendered', true);
                _this.renderSchedules(model);
            }
        }, this);
    },

    renderSchedules: function(theModel) {
        var _this = this;
        var courseIdToGet = theModel.get('courseId');
        var cityIdToGet = theModel.get('cityId');
        var searchIdToGet = theModel.get('searchId');
        var locationIdToGet = theModel.get('locationId');
        var elemToAppendSchedules = this.$el.find('.schedule-items-wrap');
        this.$el.prev().find('.location-loader').css('display', 'block');
        app.scheduleCollection.fetch({
            remove: false,
            data: JSON.stringify({
                "courseId": courseIdToGet,
                "cityId": cityIdToGet,
                "searchId": searchIdToGet,
                "locationId": locationIdToGet
            }),
            type: "POST",
            contentType: "application/json",

            success: function(data) {
                _this.$el.prev().find('.location-loader').css('display', 'none');
                app.scheduleView = new app.ScheduleView({
                    collection: app.scheduleCollection,
                    el: elemToAppendSchedules,
                    locId: locationIdToGet
                }).render();
            },

            error: function(err) {
                console.log(err);
            }
        });
    },

    showClassLocationMsg: function() {
        this.$el.find('.location-msg').toggleClass('showing');
    }
});