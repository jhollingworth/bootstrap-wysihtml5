!function($, wysi) {
	"use strict"
	
	var templates = {
		"font-styles": "<li class='dropdown'>" +
							"<a class='btn dropdown-toggle' data-toggle='dropdown' href='#'>" +
								"<i class='icon-font'></i>&nbsp;<span class='current-font'>Normal text</span>&nbsp;<b class='caret'></b>" +
							"</a>" +
						    "<ul class='dropdown-menu'>" +
						      	"<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='div'>Normal text</a></li>" +
					            "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h1'>Heading 1</a></li>" +
					            "<li><a data-wysihtml5-command='formatBlock' data-wysihtml5-command-value='h2'>Heading 2</a></li>" +
						    "</ul>" +
						"</li>",
		"emphasis":     "<li>" +
							"<div class='btn-group'>" 
							    + "<a class='btn' data-wysihtml5-command='bold' title='CTRL+B'>Bold</a>" 
							    + "<a class='btn' data-wysihtml5-command='italic' title='CTRL+I'>Italic</a>" 
							    //,+ "<a class='btn' data-wysihtml5-command='underline' title='CTRL+U'>Underline</a>" 
							+ "</div>" 
						+ "</li>",
		"lists": 		"<li>" 
							+ "<div class='btn-group'>" 
						    	+ "<a class='btn' data-wysihtml5-command='insertUnorderedList' title='Unordered List'><i class='icon-list'></i></a>" 
							    + "<a class='btn' data-wysihtml5-command='insertOrderedList' title='Ordered List'><i class='icon-th-list'></i></a>" 
							    + "<a class='btn' data-wysihtml5-command='Outdent' title='Outdent'><i class='icon-indent-right'></i></a>"  							    
							    + "<a class='btn' data-wysihtml5-command='Indent' title='Indent'><i class='icon-indent-left'></i></a>" 
							+ "</div>" 
						+ "</li>",

		"html": 
						"<li>"
							+ "<div class='btn-group'>"
								+ "<a class='btn' data-wysihtml5-action='change_view' title='Edit HTML'><i class='icon-pencil'></i></a>" 
							+ "</div>"
						+ "</li>"
	};
	
	var defaultOptions = {
		"font-styles": true,
		"emphasis": true,
		"lists": true,
		"html": false,
		events: {},
		parserRules: {
			tags: {
				"b":  {},
				"i":  {},
				"br": {},
				"ol": {},
				"ul": {},
				"li": {},
				"h1": {},
				"h2": {},
				"u": 1,
				"a":  {
					set_attributes: {
						target: "_blank",
						rel:    "nofollow"
					},
					check_attributes: {
						href:   "url" // important to avoid XSS
					}
				}
			}
		}
	};

	var Wysihtml5 = function(el, options) {
		this.el = el;
		this.toolbar = this.createToolbar(el, options || defaultOptions);
		this.editor =  this.createEditor(options);

  		$('iframe.wysihtml5-sandbox').each(function(i, el){
			$(el.contentWindow).off('focus.wysihtml5').on({
			  'focus.wysihtml5' : function(){
			     $('li.dropdown').removeClass('open');
			   }
			});
		});
	};

	Wysihtml5.prototype = {
		constructor: Wysihtml5,

		createEditor: function(options) {
			var parserRules = defaultOptions.parserRules; 

			if(options && options.parserRules) {
				parserRules = options.parserRules;
			}
				
			var editor = new wysi.Editor(this.el.attr('id'), {
	    		toolbar: this.toolbar.attr('id'),
				parserRules: parserRules
	  		});

	  		if(options && options.events) {
				for(var eventName in options.events) {
					editor.on(eventName, options.events[eventName]);
				}
			}	

	  		return editor;
		},
		
		createToolbar: function(el, options) {
			var toolbar = $("<ul/>", {
					id : el.attr('id') + "-wysihtml5-toolbar",
					class : "wysihtml5-toolbar",
					style: "display:none"
				});

			for(var key in defaultOptions) {
				var value = false;
				
				if(options[key] != undefined) {
					if(options[key] == true) {
						value = true;
					}
				} else {
					value = defaultOptions[key];
				}
				
				if(value == true) {
					toolbar.append(templates[key]);

					if(key == "html") {
						var changeViewSelector = "a[data-wysihtml5-action='change_view']";
						toolbar.find(changeViewSelector).click(function(e) {
							toolbar.find('a.btn').not(changeViewSelector).toggleClass('disabled');
						});
					}
				}
			}
			
			var self = this;
			
			toolbar.find("a[data-wysihtml5-command='formatBlock']").click(function(e) {
				var el = $(e.srcElement);
				self.toolbar.find('.current-font').text(el.html())
			});
			
			this.el.before(toolbar);
			
			return toolbar;
		}
	};

	$.fn.wysihtml5 = function (options) {
		return this.each(function () {
			var $this = $(this);
	      	$this.data('wysihtml5', new Wysihtml5($this, options));
	    })
  	};

  	$.fn.wysihtml5.Constructor = Wysihtml5;

}(window.jQuery, window.wysihtml5);