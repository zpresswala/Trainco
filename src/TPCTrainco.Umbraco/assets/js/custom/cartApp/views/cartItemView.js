'use strict';

window.app = window.app || {};

// "view the cart" view
app.CartItemView = Backbone.View.extend({

    events: {
        'click .remove': 'removeItemFromCart',
        'blur .class-qty': function(e) {
            this.updateItemTotal(e);
            this.updateCartTotalPrice(e);
            this.updateCartTotalQuantity();
        }
    },

    initialize: function(options) {
        var _this = this;
        this.options = options || {};
        if($('#cartItemTemplate').length) {
            this.template = _.template($('#cartItemTemplate').html());
            this.render();
        }
        Backbone.on('calculateSubtotal', this.calculateSubtotal, this);
        Backbone.on('updateCartTotalPrice', this.updateCartTotalPrice, this);
        Backbone.on('clearCart', this.removeItemFromCart, this);
    },

    render: function() {
        var $tpl = $(this.template(this.model.toJSON()));
        this.setElement($tpl);
        $('#cart-item-list').append($tpl);
        var quantity = this.model.get('quantity');
        this.$el.find('.class-qty').val(quantity);
        return this;
    },

    // this is only called when pulling from localStorage
    renderFromLocalStore: function() {
        var $tpl = $(this.template(this.model.toJSON()));
        this.setElement($tpl);
        $('#cart-item-list').append($tpl);
        this.model.set({
            fromLS: true,
            inCart: true
        });

        // fill in the cart data
        this.showDataFromLocalStore();

        // fill in the cart's total quantity and price
        this.updateCartTotalQuantity();
        this.updateCartTotalPrice();
        
        return this;
    },

    // fills view data in from local store model data
    showDataFromLocalStore: function() {
        var lsModelQuantity = this.model.get('quantity');
        this.model.set('quantity', lsModelQuantity);
        var lsModelSubTotal = this.model.get('price') * lsModelQuantity;
        this.$el.find('.sub-total').text('$' + lsModelSubTotal);

        // if it's the read-only cart
        if($('.read-only-cart').length) {
            this.$el.find('.class-qty-num').text(lsModelQuantity); 
        } else {
            this.$el.find('.class-qty').val(lsModelQuantity);
        }
    },

    // calculates subtotal for individual item
    calculateSubtotal: function() {
        var quantity = this.model.get('quantity');
        this.currentSubTotal = this.model.get('price') * quantity;
        this.$el.find('.sub-total').text('$ ' + this.currentSubTotal);

        // this line updates the quantity in the just-added item
        this.$('.class-qty').val(quantity);

        // updates total dollar value of cart on click of add item
        this.updateCartTotalPrice();
        this.updateCartTotalQuantity();
    },

    // if one clicks update button, sums subtotals
    updateCartTotalPrice: function() {
        var subTotalsArr = [];

        $('.cart-item').find('.sub-total').each(function() {
            var dollarAmount = parseInt($(this).text().replace('$', ''));
            subTotalsArr.push(dollarAmount);
        });

        // if one removes all the items in the cart, set the array val to zero
        if(subTotalsArr.length == 0) {
            var subTotalsArr = [0];
        }

        Backbone.trigger('updateTotalPrice', subTotalsArr, this.model);
    },

    // removes item from cart, re-calculates total price
    removeItemFromCart: function(e, success) {
        var _this = this;
        var target = $(e.currentTarget);
        var id = target.data('theid');

        var removeCartItem = function() {
            
            // remove the item from the DOM
            _this.$el.slideUp(150, function() {
                _this.remove();

                // remove the item from the collection
                _this.model.destroy();

                // decrement cart total number
                _this.updateCartTotalQuantity();

                // decrement cart total price
                _this.updateCartTotalPrice();

                setTimeout(function() {
                    if(!app.cartCollection.length) {
                        $('.cart-empty-msg').fadeIn();
                    }
                }, 10);
            });

        }

        // remove item from cart btn click - 
        // if item is from localstore, remove from cartCollection, ignore schedule collection. we have a "fromLS prop".
        // if item has been added from the schedule colleciton, remove (already working), then update the original model

        if(success) {
            removeCartItem();
        } else {
            var cartItemFromLS = app.cartCollection.findWhere({ theId: id });
            var isItemFromLS = cartItemFromLS.get('fromLS');

            if(isItemFromLS) {
                removeCartItem();
                return false;
            } else {
                var originalScheduleModel = app.scheduleCollection.findWhere({id: id});
                originalScheduleModel.set('inCart', false);
                removeCartItem();
            }
        }
    },

    // updates the cart total on cart item quantity update. purely in DOM. only called on remove.
    updateCartTotalQuantity: function() {
        var quantityArr = [];

        app.cartCollection.each(function(cartItemModel) {
            var itemQuantity = cartItemModel.get('quantity');
            quantityArr.push(itemQuantity);
        });

        if(quantityArr.length == 0) {
            var quantityArr = [0];
        }

        Backbone.trigger('updateCartTotalQty', quantityArr);
    },

    // calculates num of items for each item in the cart
    updateItemTotal: function(e) {
        e.preventDefault();
        var updatedQty = parseInt(this.$('.class-qty').val());

        // if someone changes the quantity to zero, remove item
        if(updatedQty === 0) {
            this.removeItemFromCart(e);
        }

        this.listenTo(this.model, 'change:quantity', this.calculateSubtotal);
        this.model.set('quantity', updatedQty);
        this.model.save('quantity', updatedQty);
    }
});