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
    url: "../api/wines"
});

// Views
// add view for wine list
window.WineListView = Backbone.View.extend({
    // html
    tagName: 'ul',
    // 
    initialize: function() {
        this.model.bind("reset", this.render, this);
        var self = this;
        this.model.bind("add", function(wine) {
            $(self.el).append(
                new WineListItemView({model: view}).render().el);
        });
    },

    // iterates through collection, instantiates 
    // item for each wine and adds to list
    render: function(eventName) {
        _.each(this.model.models, function(wine) {
            $(this.el).append(
                new WineListItemView({model: wine}).render().el);
        }, this);
        return this;
    }
});

// add view for wine item in list
window.WineListItemView = Backbone.View.extend({
    tagName: "li",
    template: _.template($('#tpl-wine-list-item').html()),

    // adds model data to template
    render: function(eventName) {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    close: function() {
        $(this.el).unbind();
        $(this.el).remove();
    }
});

// view for form
window.wineView = Backbone.View.extend({
    template: _.template($('#tpl-wine-details').html()),

    // merges model data to the details form
    render: function(eventName) {
        $(this.el).html(this.template(this.model.JSON()));
        return this;
    },

    events: {
        "change input": "change",
        "click .save": "saveWine",
        "click .delete": "deleteWine"
    },

    change: function(event) {
        var target = event.target;
        console.log(
            'changing ' +target.id + ' from: ' + target.defaultValue);
    }
});
// router for linking
var AppRouter = Backbone.Router.extend({
    // urls
    routes: {
        "": "list",
        "wines/:id": "wineDetails"
    },
    //list out the wines
    list: function() {
        this.wineList = new WineCollection();
        this.WineListView = new WineListView({model: this.wineList});
        this.wineList.fetch();
        $('#sidebar').html(this.WineListView.render().el);
    },
    // details for one wine
    wineDetails: function(id) {
        this.wine = this.wineList.get(id);
        this.wineView = new wineView({model: this.wine});
        $('#content').html(this.wineView.render().el);
    }
});

var app = new AppRouter();
Backbone.history.start();