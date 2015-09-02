'use strict';

window.app = window.app || {};

app.SingleSeminarView = Backbone.View.extend({
    tagName: 'li',
    className: 'seminar-item col-xs-12',

    events: {
        'click .view-opts': 'showClassOptions'
    },

    template: _.template($('#classTemplate').html()),

    initialize: function() {
        this.firstClick = false;
    },

    render: function() {
        this.$el.append(this.template(this.model.toJSON()));
        return this;
    },

    showClassOptions: function(e) {
        e.preventDefault();
        var _this = this;
        var open = this.model.get('open');
        var $schedItemWrap = this.$('.schedule-item-wrap');
        var viewText = $(e.target);

        if(open) {
            // if it's open, close it
            $schedItemWrap.slideUp(400, function() {
                viewText.removeClass('red').html('<span class="plus">+</span>View Upcoming Seminars');
                _this.model.set('open', false);
            });
            // this.$el.css('padding-bottom', 25 + 'px');
        } else {
            // open it
            $schedItemWrap.slideDown(400, function() {
                viewText.addClass('red').html('<span class="plus turn">+</span>View Less');
                _this.model.set('open', true);  
            }); 
            // this.$el.css('padding-bottom', 0);
        }

        // styling
        $schedItemWrap.css({
            "border-top": '1px solid #D7D7D7'
        });

        var courseIdToGet = this.model.get('courseId');
        var searchIdToGet = this.model.get('searchId');
        var elemToRender = $($(e.currentTarget).closest('.result-description').next('.schedule-item-wrap'));
        
        if(!this.firstClick) {
            app.locationCollection.fetch({
                // remove: false,
                data: JSON.stringify({
                    "courseId": courseIdToGet,
                    "searchId": searchIdToGet
                }),
                type: "POST",
                contentType: "application/json",

                success: function (data) {
                    app.locationView = new app.LocationView({
                        collection: app.locationCollection,
                        el: elemToRender
                    });
                    _this.model.set('open', true);
                    _this.firstClick = true;
                }
            });
        }
    },

    // on update of quantity in cart item, sends back to class list
    updateOriginalModelQuantity: function(updatedQuantity) {
        this.model.set('quantity', updatedQuantity);
        this.$('.qty').val(updatedQuantity);
        Backbone.off('updateOriginalModelQuantity');
    },

    showTotalPrice: function(e) {
        e.preventDefault();
        var price = this.model.get('price');
        Backbone.trigger('displayTotalPrice', this.quantity, price);
    }

});

app.singleSeminarView = new app.SingleSeminarView();