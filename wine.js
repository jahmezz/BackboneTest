// Models
// create new Wine model
window.Wine = Backbone.Model.extend({
    urlRoot: "../api/wines",
    defaults: {
        "id": null,
        "name": "",
        "grapes": "",
        "country": "USA",
        "region": "California",
        "year": "",
        "description": "",
        "picture": ""
    }
});

// define an endpoint url and model for the collection
window.WineCollection = Backbone.Collection.extend({
    model: Wine,
    url: "api/wines"
});

// Views
// add view for wine list
window.WineListView = Backbone.View.extend({

    el: $('#wineList'),

    initialize: function () {
        this.model.bind("reset", this.render, this);
        this.model.bind("add", function (wine) {
            $('#wineList').append(new WineListItemView({model: wine}).render().el);
        });
    },

    // iterates through collection, instantiates 
    // item for each wine and adds to list
    render: function (eventName) {
        _.each(this.model.models, function (wine) {
            $(this.el).append(
                new WineListItemView({model:wine}).render().el);
        }, this);
        return this;
    }
});

// add view for wine item in list
window.WineListItemView = Backbone.View.extend({

    tagName: "li",

    template: _.template($('#wine-list-item').html()),

    initialize:function () {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.close, this);
    },

    // adds model data to template
    render: function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    close: function () {
        $(this.el).unbind();
        $(this.el).remove();
    }
});

// view for form
window.wineView = Backbone.View.extend({

    el: $('#mainArea'),

    template: _.template($('#wine-details').html()),

    initialize:function () {
        this.model.bind("change", this.render, this);
    },

    // merges model data to the details form
    render: function (eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change input": "change",
        "click .save": "saveWine",
        "click .delete": "deleteWine"
    },

    change: function (event) {
        var target = event.target;
        console.log(
            'changing ' + target.id + ' from: ' + target.defaultValue +
            'to: ' + target.value);
    },

    saveWine: function () {
        this.model.set({
            name: $('#name').val(),
            grapes: $('#grapes').val(),
            country: $('#country').val(),
            region: $('#region').val(),
            year: $('#year').val(),
            description: $('#description').val(),
        });
        // if new model, create the model on the list
        // else save model to server
        if(this.model.isNew()) {
            var self = this;
            app.wineList.create(this.model, {
                success: function () {
                    app.navigate('wines/' + self.model.id, false);
                }
            });
        } else {
            this.model.save();
        }
        // return false if this didnt go through?
        return false;
    },

    // destroy the wine model object for that wine and go back to
    // last url (don't show delete url)
    deleteWine: function () {
        this.model.destroy({
            success: function () {
                alert('Wine deleted successfully');
                window.history.back();
            }
        });
        return false;
    },
    // remove all html elements
    close: function () {
        $(this.el).unbind();
        $(this.el).empty();
    }
});

window.HeaderView = Backbone.View.extend({

    el: $('.header'),

    // mount header as the html
    template: _.template($('#header').html()),

    initialize: function () {
        this.render();
    },

    // assign html to template
    render: function (eventName) {
        $(this.el).html(this.template());
        return this;
    },

    events: {
        "click .new": "newWine"
    },

    // make way for a new wine
    newWine: function (event) {
        app.navigate("wines/new", true);
        return false;
    }
});
// router for linking
var AppRouter = Backbone.Router.extend({

    // urls
    routes: {
        "": "list",
        "wines/new": "newWine",
        "wines/:id": "wineDetails"
    },

    //list out the wines
    list: function () {
        this.wineList = new WineCollection();
        var self = this;
        this.wineList.fetch({
            success: function () {
                self.WineListView = new WineListView({model: self.wineList});
                self.WineListView.render();
                if(self.requestedId) self.wineDetails(self.requestedId);
            }
        });
    },

    // details for one wine
    wineDetails: function (id) {
        if (this.wineList) {
            this.wine = this.wineList.get(id);
            if (this.wineView) this.wineView.close();
            this.wineView = new WineView({model: this.wine});
            this.wineView.render();
        } else {
            this.requestedId = id;
            this.list();
        }
    },

    newWine: function () {
        console.log('MyRouter newWine');
        if(app.wineView) app.wineView.close();
        app.wineView = new WineView({model: new Wine()});
        app.wineView.render();
    }

});

var app = new AppRouter();
Backbone.history.start();
var header = new HeaderView();