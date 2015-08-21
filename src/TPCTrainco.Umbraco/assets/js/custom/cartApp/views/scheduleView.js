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
        var target = $(e.currentTarget);
        this.$classQty = target.parent().prev().find('.class-qty');
        if(this.$classQty.val() == '') {
            target.parent().prev().find('.attendee-msg').addClass('showing');
            this.$classQty.css('border-color', 'red');
            this.$el.find('.btn-blue-hollow:focus').blur();
            setTimeout(function() {
                target.parent().prev().find('.attendee-msg').removeClass('showing');
                this.$classQty.css('border-color', '#d7d7d7');
            }, 3000);
            return false;
        } else {
            this.$el.find('.btn-blue-hollow:focus').blur();

            var id = target.data('id'),
                modelData = this.collection.get(id),
                courseIdNum = modelData.get('courseId'),
                price = modelData.get('price'),
                classDate = modelData.get('date'),
                thequantity = parseInt(this.$classQty.val()),
                inCart = modelData.get('inCart'),
                theId = modelData.get('id');

                modelData.set('quant', thequantity);
                modelData.set('theId', theId);

                var modelQty = modelData.get('quant');

            if(!inCart) {
                modelData.set('inCart', true);
                
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

                console.log('incoll', isItemInCollection)
                // if item is not in collection (or on the page)
                if(!isItemInCollection) {

                    // create a new model
                    app.cartItemModel = new app.CartItemModel({
                        title: titleOfClass,
                        city: cityOfClass,
                        date: classDate,
                        quantity: thequantity,
                        theId: theId,
                        price: modelData.get('price')
                    });

                    // this.cartItemModel.set('quantity', thequantity);

                    // attach our 'add' listener
                    this.listenTo(app.cartCollection, 'add', this.renderCartItem);

                    // adding to collection
                    // app.cartCollection.add(this.cartItemModel);
                    
                    // saving it to localstorage
                    app.cartCollection.create(app.cartItemModel.toJSON());

                    // clear input field
                    this.$classQty.val('');

                    // remove listener
                    this.stopListening();

                    this.listenTo(modelData, 'change:quant', this.updateQuantity);
                } else {
                    console.log('ret fals')
                    return false;
                }
            } else {
                console.log(modelQty)
                app.cartItemModel.set('quantity', modelQty);
                modelData.set('quant', modelQty);
                console.log(modelData.get('quant'))

                // this.updateQuantity(theId, modelQty, modelData);
            }
        }
    },

    // creates our new view, adds to cart by calling render in the cartItemView
    renderCartItem: function(cartItem) {
        var itemQuantity = cartItem.get('quantity');
        var itemPrice = cartItem.get('price');
        console.log(itemPrice)
        app.cartItemView = new app.CartItemView({
            model: cartItem,
            quantity: itemQuantity,
            price: itemPrice
        }).render();

        this.addQtyToCart(itemQuantity, cartItem);
        Backbone.trigger('calculateSubtotal', itemQuantity);
    },

    updateQuantity: function(qty) {
        console.log('hi')
        this.$classQty.val('');
        
        console.log(this.$el)
    },

    // total number of cart items in cart view (input fields)
    addQtyToCart: function(theQuantity, cartItem) {
        // cartItem.set('qty', theQuantity);
        // this.$classQty.val(theQuantity)
        console.log(theQuantity, cartItem, 'kskssksks')
        // console.log(this.model)
        // this.listenTo(this.cartItemModel, 'change:quantity', this.updateQuantity);
        var oldVal = $('.items-total').text();
        console.log(oldVal); // fix, 00
        // console.log(theQuantity) // good
        // console.log(this.$el) // div.schedule-items-wrap
        // console.log('==============')
        // this.quantity = theQuantity;
        var newNum = parseInt(oldVal) + parseInt(theQuantity);
        $('.items-total').text(newNum + ' Items');
        // this.model.set('quantity', this.quantity);
    }

});