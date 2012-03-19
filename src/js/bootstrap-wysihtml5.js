!function($, wysi) {
	"use scrict"

	Wysihtml5 = function(el, options) {
		this.el = el;
		this.options = options;

		$('#toolbar').button();
		this.editor =  new wysi.Editor(this.el.attr('id'), {
    		toolbar: "toolbar"
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