'use strict';

window.app = window.app || {};

app.CartNotifyView = Backbone.View.extend({

    events: {
        'click #check-out': 'checkout'
    },

    initialize: function() {
        this.template = _.template($('#cartNotifyTemplate').html());
        this.render();
        this.totalCost = this.$('.total-cost');

        // event bus
        Backbone.on('updateTotalPrice', this.updateTotalPrice, this);
        Backbone.on('displayTotalPrice', this.displayTotalPrice, this);
        Backbone.on('updateCartTotalQty', this.updateCartTotalQty, this);

        // grab our items from localstorage
        // later we will need to clear localStorage after a successful checkout
        if(localStorage.length > 1) {
            this.$('.cart-empty-msg').hide();
            app.cartCollection.fetch({
                success: function(coll, resp) {
                    coll.each(function(modelFromStorage) {
                        app.cartItemView = new app.CartItemView({
                            model: modelFromStorage
                        }).renderFromLocalStore();
                    }, this);
                }
            });
        }

        else {
            this.$('.cart-empty-msg').show();
        }
    },

    render: function() {
        this.$el.html(this.template);
        return this;
    },

    // when you change the quantity of an item in the cart, update the total number of items in the cart
    updateTotalPrice: function(subTotals) {
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
        this.$('.items-total').text(updatedQty + ' Items');
    },

    checkout: function() {
        var _this = this;
        var cartData = app.cartCollection.toJSON();
        var cartDataArray = [];
        cartData.forEach(function(item, index, array) {
            var id = item.theId;
            var quant = item.quantity;
            cartDataArray.push({ Id: id, quantity: quant });
        });

        this.$('.checkout-loader').show();

        $.ajax({
        	url: ApiDomain + '/api/carts/save',
            data: JSON.stringify(cartDataArray),
            type: "POST",
            contentType: "application/json"
        }).done(function(successObj) {
            var redirectGuid = successObj.cartGuid;
            _this.$('.checkout-loader').hide();
            _this.clearCart();
            window.location.href = '/register/?cart=' + redirectGuid;
        }).fail(function(error) {
            _this.$('.checkout-loader').hide();
            _this.$('.btn-wrapper').prepend('<p class="checkout-err-msg">An error occurred. Please try again later.</p>');
        });
    },

    clearCart: function() {
        var success = true;
        Backbone.trigger('clearCart', this, success);
        this.$('.checkout-loader').hide();
    }
});

app.cartNotifyView = new app.CartNotifyView({
    el: '#cart'
});