'use strict';

window.app = window.app || {};

app.BikeCollection = Backbone.Collection.extend({
    model: app.SingleBike,

    // url gets the data
    url:'http://localhost:3050/data',

    initialize: function() {
        // this.listenTo(this.collection, 'all', this.render);
    },

    render: function() {
        console.log('collection render');
    },

    // need parse here because i have bikes:{} around my array of objects
    parse: function(response, options) {
        // console.log('======')
        // console.log(response[0].locations)
        // var stuff = response;
        // console.log(response.classes)
        return response;
    }

});

// app.bikeCollection = new app.BikeCollection();