'use strict';

window.app = window.app || {};

app.ScheduleCollection = Backbone.Collection.extend({
    model: app.ScheduleModel,

    url:'http://trainco-dev.imulus-client.com/api/schedules/searchbylocation',

    parse: function(response) {
    	// console.log(app.locationCollection)
    	// console.log(response);
   

    	// _.each(response, function(item) {
    	// 	console.log(item.locationId);
    	// 	console.log('===========');
    	// 	var locId = item.locationId;
    	// 	var locCollectionItem = app.locationCollection.findWhere({ locationId: locId });
    	// });
    	return response;






    }
});

app.scheduleCollection = new app.ScheduleCollection;

// app.cartCollection.findWhere({ theId: id });