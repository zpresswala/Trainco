'use strict';

window.app = window.app || {};

app.ScheduleCollection = Backbone.Collection.extend({
    model: app.ScheduleModel,

    url:'http://trainco-dev.imulus-client.com/api/schedules/searchbylocation',

    initialize: function() {
        this.listenTo(this.collection, 'all', this.render);
    }
});