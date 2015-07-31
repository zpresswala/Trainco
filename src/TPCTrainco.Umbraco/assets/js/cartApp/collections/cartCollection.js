'use strict';

window.app = window.app || {};

app.CartCollection = Backbone.Collection.extend({
    
    // don't define the model here so we can add to it

    localStorage: new Backbone.LocalStorage('CartCollection'),

    // model: app.cartItemModel,

    url: '/',


    initialize: function() {
        console.log('cart collection init');
    }


});
app.cartCollection = new app.CartCollection();

// console.log(app.cartItemModel)

// app.cartCollection.on('sync', function() {
// 	console.log('sync')
// });

// app.cartCollectionStorage = new Backbone.LocalStorage('CartCollection');