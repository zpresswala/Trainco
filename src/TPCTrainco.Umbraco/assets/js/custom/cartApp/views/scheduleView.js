'use strict';

window.app = window.app || {};

app.ScheduleView = Backbone.View.extend({
    tagName: 'li',
    className: 'seminar',

    events: {
        'click .add-to-cart': 'addToCart'
    },

    template: _.template($('#scheduleTemplate').html()),

    initialize: function() {
        this.render();
    },

    render:function () {
        var _this = this;
        this.collection.each(function(singleClass) {
            _this.$el.append(_this.template(singleClass.toJSON()));
        }, this);
        return this;
    },

    addToCart: function(e) {
        e.preventDefault();
        var id = $(e.currentTarget).data("id");
        var modelData = this.collection.get(id);
        var price = modelData.get('price');
        var date = modelData.get('date')
        console.log("clicked", price, date);
    }

});