(function ($) {
	var ListView = Backbone.View.extend({
		el: $('body'), //set el to body tag

		events: {
			'click button#add': 'addItem'
		},

		initialize: function () {
			//bind this anon function to render and addItem's this
			_.bindAll(this, 'render', 'addItem');

			this.counter = 0;
			this.render();
		},

		render: function () {
			$(this.el).append("<button id='add'>Add list item</button>");
			$(this.el).append("<ul></ul>");
		},

		addItem: function () {
			this.counter++;
			$('ul', this.el).append("<li>hello world" + this.counter + "</li>");
		}
	});

	var listView = new ListView();
})(jQuery);