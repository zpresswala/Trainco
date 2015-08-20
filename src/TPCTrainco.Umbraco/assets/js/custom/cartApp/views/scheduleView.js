'use strict';

window.app = window.app || {};

app.ScheduleView = Backbone.View.extend({
    tagName: 'li',
    className: 'seminar',

    events: {
        'click .add-to-cart': function(e) {
            this.addToCart(e);
        }
    },

    template: _.template($('#scheduleTemplate').html()),

    initialize: function() {
        this.render();
    },

    render:function () {
        var _this = this;
        this.collection.each(function(singleClass) {
            var hasBeenRendered = singleClass.get('hasBeenRendered');
            if(hasBeenRendered) {
                return false;
            } else {
                _this.$el.append(_this.template(singleClass.toJSON()));
                singleClass.set('hasBeenRendered', true);
            }
        }, this);
    },


    // this just creates the data model and adds it to the collection
    addToCart: function(e) {
        e.preventDefault();

        this.$el.find('.btn-blue-hollow:focus').blur();
        var id = $(e.currentTarget).data("id");
        var modelData = this.collection.get(id);
        var courseIdNum = modelData.get('courseId');
        var price = modelData.get('price');
        var classDate = modelData.get('date');

        // get the class title
        var relatedClassModel = app.globalCollection.findWhere({
            seminarId: courseIdNum 
        });

        // get the cityState
        var relatedLocationModel = app.locationCollection.findWhere({
            courseId: courseIdNum
        });

        var titleOfClass = relatedClassModel.get('title');
        var cityOfClass = relatedLocationModel.get('cityState');

        var loadedFromLocalStore = [],
            isItemInCollection = false,
            inputQuantity = this.$('.qty').val(),
            uniqueIdentifierOfModelAdded = modelData;

        // loop through the localstorage collection and add our unique identifier to the array
        app.cartCollection.each(function(cartItemModel) {
            loadedFromLocalStore.push(cartItemModel.get('id'));
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
                title: titleOfClass,
                city: cityOfClass,
                date: classDate,
                price: modelData.get('price')
            });

            console.log(this.cartItemModel)

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
        console.log(cartItem)
        app.cartItemView = new app.CartItemView({
            model: cartItem,
            quantity: this.quantity
            // price: this.model.get('price')
        }).render();

        this.addQtyToCart();
        Backbone.trigger('calculateSubtotal', this.quantity);
    },

    // total number of cart items in cart view, updates totals on both models.
    addQtyToCart: function() {
        // this.listenTo(this.model, 'change:quantity', this.updateQuantity);
        // var oldVal = $('#num-items').text();
        // this.quantity = parseInt(this.$el.find('.qty').val());
        // var newNum = parseInt(oldVal) + parseInt(this.quantity);
        // $('#num-items').html(newNum);
        // this.model.set('quantity', this.quantity);
    }

});