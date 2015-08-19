'use strict';

window.app = window.app || {};

app.CartCollection = Backbone.Collection.extend({
    
    // don't define the model here so we can add to it

    localStorage: new Backbone.LocalStorage('CartCollection'),


    url: '/',


    initialize: function() {
        console.log('cart collection init');
    }


});
app.cartCollection = new app.CartCollection();