'use strict';

window.app = window.app || {};

app.LocationCollection = Backbone.Collection.extend({
	model: app.LocationModel,

	url:'http://trainco-dev.imulus-client.com/api/locations/searchbyseminar'

});

app.locationCollection = new app.LocationCollection;