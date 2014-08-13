(function ($) {

	// create Item with part1, part2
	var Item = Backbone.Model.extend({
		defaults: {
			part1: 'hello',
			part2: 'world'
		}
	});

	// collection = list of Items
	var List = Backbone.Collection.extend({
		model: Item
	});

	// represent how to render Item in html
	var ItemView = Backbone.View.extend({
		tagName: 'li', // this.el has tagName li now

		initialize: function () {
			_.bindAll(this, 'render'); // render's this is now always ItemView
		},

		// renders Item as <li><span>stuff</span></li>
		render: function () {
			$(this.el).html('<span>' + this.model.get('part1') + ' ' + this.model.get('part2') + '</span>');
			return this; // return this = chainable
		}
	});

	// the visible list
	var ListView = Backbone.View.extend({
		el: $('body'), // we are attaching things to body
		events: {
			'click button#add': 'addItem'
		},

		initialize: function () {
			_.bindAll(this, 'render', 'addItem', 'appendItem'); // this application!

			// attach a List collection to this view
			this.collection = new List();
			this.collection.bind('add', this.appendItem); // collection event binder

			this.counter = 0;
			this.render();
		},

		//renders the list to hold the item
		render: function () {
			var self = this;
			$(this.el).append("<button id='add'>Add list item</button>");
			$(this.el).append('<ul></ul>');
			// add to view anything that is already in collection
			_(this.collection.models).each(function (item) {
				self.appendItem(item);
			}, this);
		},

		//add item to collection
		addItem: function () {
			this.counter++;
			//create item with part2 having an additional counter
			var item = new Item();
			item.set({
				part2: item.get('part2') + this.counter // modify item defaults
			});
			this.collection.add(item); //triggers appendItem()
		},

		appendItem: function (item) {
			// itemView with item in it
			var itemView = new ItemView({
				model: item
			});
			//append to end of ul the itemview html
			$('ul', this.el).append(itemView.render().el);
		}
	});
	var ListView = new ListView();
})(jQuery);