'use strict';

window.app = window.app || {};

app.SingleBike = Backbone.Model.extend({
    
    initialize: function() {
        // console.log('The model has been initialized.');
    }

    // defaults: function() {
    //     return {
    //         model: 'Sledgehammer',
    //         photo: '/images/placeholder.gif'
    //     }; 
    // }

});

app.bikeModel = new app.SingleBike();