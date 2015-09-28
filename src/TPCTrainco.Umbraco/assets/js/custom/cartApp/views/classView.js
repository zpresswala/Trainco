'use strict';

window.app = window.app || {};

app.ClassView = Backbone.View.extend({

    initialize: function() {
        this.render();
    },

    render: function() {
        this.collection.each(function(model) {
            this.renderSeminars(model);
        }, this);
    },

    renderSeminars: function(seminarModel) {
        this.$el.append(new app.SingleSeminarView({
            model: seminarModel
        }).render().el).hide().slideDown(500).fadeIn(600);
    }

});