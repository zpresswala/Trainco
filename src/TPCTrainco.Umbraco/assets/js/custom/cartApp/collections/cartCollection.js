'use strict';

window.app = window.app || {};

app.CartCollection = Backbone.Collection.extend({
    
    // don't define the model here so we can add to it
    localStorage: new Backbone.LocalStorage('CartCollection'),


    url: '/'

});
app.cartCollection = new app.CartCollection();