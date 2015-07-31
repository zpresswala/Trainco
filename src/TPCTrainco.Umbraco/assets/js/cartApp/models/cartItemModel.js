'use strict';

window.app = window.app || {};

app.CartItemModel = Backbone.Model.extend({
    
    initialize: function() {
        // console.log('The model has been initialized.');
    },

    defaults: function() {
        return {
            title: 'in the cart',
            price: 9.99,
            quantity: 1
        }; 
    }

});

app.cartItemModel = new app.CartItemModel();