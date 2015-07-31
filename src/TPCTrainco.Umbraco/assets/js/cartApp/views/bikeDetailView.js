'use strict';

window.app = window.app || {};

// see a single bike view
app.BikeView = Backbone.View.extend({
    tagName: 'div',
    template: _.template($('#singleBikeTemplate').html()),

    events: {

    },

    initialize: function() {
        this.render();
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }

});