'use strict';

window.app = window.app || {};

app.CartNotifyView = Backbone.View.extend({

    template: _.template($('#cartNotifyTemplate').html()),

    events: {
        'click #check-out': 'checkout'
    },

    initialize: function() {
        this.render();

        // variables
        this.totalCost = this.$('#total-cost');

        // event bus
        Backbone.on('updateTotalPrice', this.updateTotalPrice, this);
        Backbone.on('displayTotalPrice', this.displayTotalPrice, this);
        Backbone.on('updateCartTotalQty', this.updateCartTotalQty, this);

        // grab our items from localstorage
        // later we will need to clear localStorage after a successful checkout
        if(localStorage.length) {
            app.cartCollection.fetch({
                success: function(coll, resp) {
                    console.log(resp)
                    coll.each(function(modelFromStorage) {
                        app.cartItemView = new app.CartItemView({
                            model: modelFromStorage
                        }).renderFromLocalStore();
                    }, this);
                }
            });
        }
    },

    render: function() {
        this.$el.html(this.template);
        return this;
    },

    // when you change the quantity of an item in the cart, update the total number of items in the cart
    updateTotalPrice: function(subTotals, model) {
        var subTotArray = subTotals;
        var updatedTotalPrice = subTotArray.reduce(function(a, b) {
            return a + b;
        });
        this.totalCost.text(updatedTotalPrice);
    },

    // the cart price total
    displayTotalPrice: function(quantity, price) {
        this.currentPrice = parseInt(this.totalCost.text());
        var totalPrice = quantity * parseInt(price);
        this.totalCost.text(this.currentPrice + totalPrice);
    },

    // updates the cart total on cart item quantity update
    updateCartTotalQty: function(quantityArray) {
        var updatedQty= quantityArray.reduce(function(a, b) {
            return a + b;
        });
        this.$('#num-items').text(updatedQty);
    },

    checkout: function() {
        // grab all collection data
        // create json
        // send off

        // app.cartCollection.localStorage = new Backbone.LocalStorage('CartCollection');


        

        console.log('hi', app.cartCollection)

        console.log(localStorage.CartCollection)


        // app.cartCollection.toJSON();

        // app.app.cartCollectionStorage.fetch();

        // console.log(app.cartCollectionStorage)

        // var storage = app.cartCollectionStorage.findAll();
        // console.log(storage)
        // var ls = new Backbone.LocalStorage("CartCollection");
        


    }


    // goToCart: function(e) {
    //     e.preventDefault();

    //     app.bikeAppRouter.navigate(e.target.pathname, {

    //         // trigger true makes backbone call the matching route
    //         trigger: true
    //     });
    // }

});