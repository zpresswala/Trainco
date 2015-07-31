'use strict';

window.app = window.app || {};

// all bikes list view
app.BikeMenuView = Backbone.View.extend({
    
    events: {
        'click .go-to-bike': 'goToOneBike',
        // 'click #add': 'addBike'
        // 'submit .add-item': 'putItemInCart'
    },

    initialize:function () {
        this.render();

        // when we add a new bike(model) to the collection, render a view for it
        this.listenTo(app.bikeCollection, 'add', this.renderBike);
    },
    
    render:function () {
        this.collection.each(function(model) {
            this.renderBike(model);
        }, this);
    },

    renderBike: function(bike) {
        // document fragment here instead?
        this.$('#bike-menu').append(new app.BikeMenuItemView({model: bike
        }).render().el);
    }

});