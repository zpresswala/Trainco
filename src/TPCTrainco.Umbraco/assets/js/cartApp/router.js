'use strict';

window.app = window.app || {};

app.BikeAppRouter = Backbone.Router.extend({

    // home route
    routes: {
        '': 'index',
        'bike/:id': 'oneBike',
        // 'cart': 'seeCart',
        '*notFound': 'notFound'
    },

    initialize: function() {
        // this.bikeCollection = new app.BikeCollection();
        // this.bikeCollection.fetch();
    },

    index: function() {
        console.log('index route');

        if(this.cartView) {
            $('#cart-view').html('');
        }

        this.bikeMenuView = new app.BikeMenuView({
            collection: app.bikeCollection,
            el: '.bike-list'
        });

        app.cartNotifyView = new app.CartNotifyView({
            el: '#cart-notifier'
        });
    },

    // route to show each bike
    oneBike: function(id) {
        console.log('bike route ' + id);

        app.bikeDetail = app.bikeCollection.get(id);
        app.bikeView = new app.BikeView({
            model: app.bikeDetail,
            el: '#bike-detail'
        });
    },

    seeCart: function() {
        console.log('We in cart view');
        this.cartView = new app.CartView({
            el: '#cart-view'
        });
    },

    // 404 route
    notFound: function(notFound) {
        console.log(notFound + ' error');
    }

});


app.bikeCollection = new app.BikeCollection();

app.bikeCollection.fetch({
    success: function() {
       app.bikeAppRouter = new app.BikeAppRouter();
       Backbone.history.start({pushState: true}); 
    }
});

// app.bikeAppRouter = new app.BikeAppRouter();

// console.log(app.bikeAppRouter)
