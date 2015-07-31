'use strict';

window.app = window.app || {};

// a bike menu item
app.BikeMenuItemView = Backbone.View.extend({
    tagName: 'li',
    className: 'one-bike',

    attributes: function() {
        return {
            'data-id': this.model.get('id')
        }
    },

    events: {
        'submit .add-item': function(e) {
            // this.totalQuantity(e);
            this.createCartItemModel(e);
            // this.addQtyToCart(e);
            // this.showTotalPrice(e);
        } 
    },

    template: _.template($('#bikeMenuItemTemplate').html()),

    initialize: function() {
        // this.listenTo(this.model, 'change:quantity', this.updateQuantity);
        console.log(this.model)
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    // quantity for single item. sends to cart view.
    updateQuantity: function(model, quantity) {
        this.quantity = quantity;

        Backbone.trigger('calculateSubtotal', quantity);

        // updates the quantity of the original element if changed from the cart.
        // listener attached here so it only runs once
        Backbone.on('updateOriginalModelQuantity', this.updateOriginalModelQuantity, this);
    },

    // on update of quantity in cart item, sends back to class list
    updateOriginalModelQuantity: function(updatedQuantity) {
        this.model.set('quantity', updatedQuantity);
        this.$('.qty').val(updatedQuantity);
        Backbone.off('updateOriginalModelQuantity');
    },

    // total number of cart items in cart view, updates totals on both models.
    addQtyToCart: function() {
        this.listenTo(this.model, 'change:quantity', this.updateQuantity);
        var oldVal = $('#num-items').text();
        this.quantity = parseInt(this.$el.find('.qty').val());
        var newNum = parseInt(oldVal) + parseInt(this.quantity);
        $('#num-items').html(newNum);
        this.model.set('quantity', this.quantity);
    },

    // this just creates the data model and adds it to the collection
    createCartItemModel: function(e) {
        e.preventDefault();

        var loadedFromLocalStore = [],
            isItemInCollection = false,
            inputQuantity = this.$('.qty').val(),
            uniqueIdentifierOfModelAdded = this.model.get('brand');

        // loop through the localstorage collection and add our unique identifier to the array
        app.cartCollection.each(function(cartItemModel) {
            loadedFromLocalStore.push(cartItemModel.get('brand'));
        });

        // loop through array of unique identifiers, compare to identifier of model we are adding
        // if it exists, set our 'isItemInCollection' var to true.
        for(var i = 0; i < loadedFromLocalStore.length; i++) {
            if(uniqueIdentifierOfModelAdded == loadedFromLocalStore[i]) {
                console.log('yep');
                isItemInCollection = true;
            }
        }

        // if item is not in collection (or on the page)
        if(!isItemInCollection) {

            // if the input field is 0 or empty, don't add it
            if(inputQuantity === '' || inputQuantity === 0 || inputQuantity === 'null') {
                alert('please enter a quantity')
                return false;
            }

            // create a new model
            this.cartItemModel = new app.CartItemModel({
                price: this.model.get('price'),
                quantity: this.model.get('quantity'),
                brand: this.model.get('brand')
            });

            // attach our 'add' listener
            this.listenTo(app.cartCollection, 'add', this.renderCartItem);

            // adding to collection
            // app.cartCollection.add(this.cartItemModel);
            
            // saving it to localstorage
            app.cartCollection.create(this.cartItemModel.toJSON());

            this.$('.qty').val('');
            this.stopListening();
        } else {
            console.log('doo doo')
            // don't add the model if it's already in the DOM
            return false;

        }

        


    },

    // creates our new view, adds to cart by calling render in the cartItemView
    renderCartItem: function(cartItem) {
        // alert('stuff')
        app.cartItemView = new app.CartItemView({
            model: cartItem,
            quantity: this.quantity,
            price: this.model.get('price')
        }).render();

        this.addQtyToCart();
        Backbone.trigger('calculateSubtotal', this.quantity);
    },

    showTotalPrice: function(e) {
        e.preventDefault();
        var price = this.model.get('price');
        Backbone.trigger('displayTotalPrice', this.quantity, price);
    }

});