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

    initialize: function(options) {
        this.template = _.template($('#scheduleTemplate').html());
        this.options = options || {};
        this.locLocIdArr = options.locationLocId;
        var _this = this;
        // setTimeout(function() {
        this.render();
        // }, 2);
    },

    render:function () {
        var _this = this;

        // comparing collection locationIds to location locationIds
        $.each(_this.collection.toJSON(), function(index, value) {
            $.each(_this.locLocIdArr, function(index2, id) {
                if(value.locationId === id) {

                    // then appending to corresponding item
                    $(_this.$el[index2]).append(_this.template(value)).hide().fadeIn(300);
                }
            });
        });
    },

    // this just creates the data model and adds it to the collection
    addToCart: function(e) {
        e.preventDefault();
        var target = $(e.currentTarget);
        var _this = this;
        this.$classQty = target.parent().parent().find('.class-qty');

        var updateTheQuantity = function() {
            var changedQty = modelData.get('quant');
            var id = modelData.get('id');
            var matchingItem = app.cartCollection.where({ theId: id });
            var matchingItemIdAttr = matchingItem[0].get('theId');
            var newQty = changedQty + matchingItem[0].get('quantity');
            matchingItem[0].set('quantity', newQty);
            matchingItem[0].save();
            scrollTopAfterAdd();
            
            if(id == matchingItemIdAttr) {
                $('#cart-item-list').find('[data-theid=' + matchingItemIdAttr + ']').find('.class-qty').val(changedQty);
                Backbone.trigger('calculateSubtotal', changedQty);
            }

            _this.$classQty.val('');
        };

        // after add/update of quantity, scroll back up to the cart
        var scrollTopAfterAdd = function() {
            setTimeout(function() {
                $('html, body').animate({
                    scrollTop: $('#cart').offset().top - 80
                }, 200);
                if(!$('.cart-visible').hasClass('down')) {
                    $('.cart-tab').trigger('click');
                }
            }, 300);
        };

        // if quantity empty or zero
        if(this.$classQty.val() == '' || this.$classQty.val() == 0) {
            target.parent().prev().find('.attendee-msg').addClass('showing');
            this.$classQty.css('border-color', 'red');
            this.$el.find('.btn-blue-hollow:focus').blur();
            setTimeout(function() {
                target.parent().prev().find('.attendee-msg').removeClass('showing');
                _this.$classQty.css('border-color', '#d7d7d7');
            }, 3000);
            return false;
        } else {

            // else, add to cart
            $('.cart-empty-msg').hide();
            target.blur().text('Added!').addClass('added');
            scrollTopAfterAdd();
            setTimeout(function() {
                target.text('Add to cart').removeClass('added');
            }, 2000);

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

            // if it hasn't been added to the cart already, add it
            if(!inCart) {
                modelData.set('inCart', true);
                
                // get the class title
                var relatedClassModel = app.globalCollection.findWhere({
                    courseId: courseIdNum 
                });

                // get the cityState
                var relatedLocationModel = app.locationCollection.findWhere({
                    courseId: courseIdNum
                });

                var titleOfClass = relatedClassModel.get('title');
                var cityOfClass = relatedLocationModel.get('cityState');

                // check if it's in the cart from localstorage
                var loadedFromLocalStore = [],
                    isItemInCollection = false,
                    inputQuantity = this.$('.qty').val(),
                    uniqueIdentifierOfModelAdded = theId;

                // loop through the localstorage collection and add our unique identifier to the array
                app.cartCollection.each(function(cartItemModel) {
                    loadedFromLocalStore.push(cartItemModel.get('theId'));
                });

                // loop through array of unique identifiers, compare to identifier of model we are adding. if it exists, set our 'isItemInCollection' var to true.
                for(var i = 0; i < loadedFromLocalStore.length; i++) {
                    if(uniqueIdentifierOfModelAdded == loadedFromLocalStore[i]) {
                        isItemInCollection = true;
                    }
                }

                // if item is not in localstorage collection
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

                    // attach our 'add' listener
                    this.listenTo(app.cartCollection, 'add', this.renderCartItem);
                    
                    // saving it to localstorage
                    app.cartCollection.create(app.cartItemModel.toJSON());

                    // clear input field
                    this.$classQty.val('');

                    // remove listener
                    this.stopListening();

                } else {

                    // else, just update the quantity
                    updateTheQuantity();

                }
            } else {
                updateTheQuantity();
            }
        }
    },

    // creates our new view, adds to cart by calling render in the cartItemView
    renderCartItem: function(cartItem) {
        var itemQuantity = cartItem.get('quantity');
        var itemPrice = cartItem.get('price');
        app.cartItemView = new app.CartItemView({
            model: cartItem,
            quantity: itemQuantity,
            price: itemPrice
        }).render();

        this.addQtyToCart(itemQuantity, cartItem);
        Backbone.trigger('calculateSubtotal', itemQuantity);
    },

    // total number of cart items in cart view (input fields)
    addQtyToCart: function(theQuantity, cartItem) {
        var oldVal = $('.items-total').text();
        var newNum = parseInt(oldVal) + parseInt(theQuantity);
        $('.items-total').text(newNum + ' Items');
    }

});