!function($, wysi) {
	"use scrict"

	Wysihtml5 = function(el, options) {
		this.el = el;
		this.options = options;
		this.toolbar = $('#toolbar').button();
		var self = this;
		this.toolbar.find("a[data-wysihtml5-command='formatBlock']").click(function(e) {
			var el = $(e.srcElement);
			self.toolbar.find('.current-font').text(el.html())
		});
		
		
		this.editor =  new wysi.Editor(this.el.attr('id'), {
    		toolbar: "toolbar"
  		});

		this.editor.on('aftercommand:composer', function() { 
			console.log(arguments);
		});
	};

	Wysihtml5.prototoype = {
		constructor: Wysihtml5
	};

	$.fn.wysihtml5 = function (options) {
		return this.each(function () {
			var $this = $(this);
	      	$this.data('wysihtml5', new Wysihtml5($this, options));	
	    })
  	};

  	$.fn.wysihtml5.Constructor = Wysihtml5;

}(window.jQuery, window.wysihtml5);