'use strict';

window.app = window.app || {};

app.LocationCollection = Backbone.Collection.extend({
	model: app.LocationModel,

	url: ApiDomain + '/api/locations/searchbyseminar'

});

app.locationCollection = new app.LocationCollection;