'use strict';

window.app = window.app || {};

app.ScheduleCollection = Backbone.Collection.extend({
    model: app.ScheduleModel,

    url: ApiDomain + '/api/schedules/searchbylocation'

});

app.scheduleCollection = new app.ScheduleCollection;